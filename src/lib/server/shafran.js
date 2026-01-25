const SHAFRAN_API = process.env.BASE_URL || "http://localhost:8080";

async function handleJsonResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Shafran API request failed");
  }
  return data;
}

export async function createShafranOrder(payload, token) {
  if (!token) {
    console.warn("[Shafran] No token provided, skipping Shafran order creation");
    return null;
  }

  const response = await fetch(`${SHAFRAN_API}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      delivery_method: payload.checkout?.deliveryMethod || "address_delivery",
      payment_method: payload.checkout?.paymentMethod || "cash",
      currency: payload.totals?.currency || "UZS",
      total_amount: payload.totals?.amount || 0,
      notes: payload.checkout?.comment || "",
      products:
        payload.items?.map((item) => ({
          product_id: item.productId || item.id,
          product_name: item.name,
          variant_label: item.variantLabel || "",
          quantity: item.quantity || 1,
          unit_price: item.price || 0,
          line_total: (item.price || 0) * (item.quantity || 1),
        })) || [],
    }),
  });

  return handleJsonResponse(response);
}

export async function createShafranPaymeCheckout({
  orderId,
  amount,
  currency,
  userId,
  rawPayload,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const payloadDetails = {
    ...((rawPayload && typeof rawPayload === "object") ? rawPayload : {}),
    internalOrderId: orderId,
  };

  console.log({ payloadDetails })
  const response = await fetch(`${SHAFRAN_API}/api/payme/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      total_amount: amount,
      order_id: orderId,
      currency,
      userId: userId || "",
      metadata: {
        source: "shafran-app",
        internalOrderId: orderId,
      },
      orderDetails: JSON.stringify(payloadDetails),
      url: siteUrl,
    }),
  });

  const payload = await handleJsonResponse(response);
  console.log("Payme checkout payload:", payload);
  console.log({ payloadDetails })
  const transactionId =
    payload?.transaction_id

  const normalizedOrderId =
    payload?.orderId

  const paymentUrl =
    payload?.url || payload?.payment_url

  return {
    transactionId,
    orderId: orderId,
    paymentUrl,
    rawResponse: payload,
  };
}

export async function fetchShafranOrders(token) {
  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const response = await fetch(`${SHAFRAN_API}/api/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = await handleJsonResponse(response);
  console.log("orders", payload)
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  return [];
}

export function normalizeShafranOrder(result) {
  const core = result?.data || result || {};
  const id = core?.id
  const orderNumber = core?.order_number || core?.orderNumber || null;
  const totalAmount =
    core?.total_amount ??
    core?.total?.amount ??
    core?.total_amount ??
    core?.totalAmount ??
    core?.amount ??
    core?.subtotal ??
    0;
  const currency =
    core?.currency ||
    core?.total?.currency ||
    core?.currency_code ||
    core?.total_currency ||
    "UZS";

  return {
    id,
    orderNumber,
    totalAmount,
    currency,
    raw: result,
  };
}
