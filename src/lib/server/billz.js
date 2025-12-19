"use server";

const SHOP_ID = "29ce1934-120f-459a-8046-8bfa89529a3c";
const CASHBOX_ID = "83cdf361-cb50-48ce-a56f-01c8068bf63b";

const PAYMENT_TYPE_IDS = {
  cash: "6042429f-0d4c-40b7-9ee8-55c115865146",
  card: "0bf1d4d2-1383-4ba2-92c8-8569d60e3b60",
  payme: "0bf1d4d2-1383-4ba2-92c8-8569d60e3b60",
};

const BILLZ_PROXY_BASE =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BASE_URL ||
  "http://localhost:3000";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

function buildBillzUrl(path) {
  return new URL(`/api/billz/${path}`, BILLZ_PROXY_BASE).toString();
}

async function sendBillz(path, payload, method = "POST") {
  const url = buildBillzUrl(path);
  const response = await fetch(url, {
    method,
    headers: DEFAULT_HEADERS,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Billz API failed (${response.status})`);
  }

  return data;
}

async function createDraftOrder() {
  return sendBillz("v2/order?Billz-Response-Channel=HTTP", {
    shop_id: SHOP_ID,
    cashbox_id: CASHBOX_ID,
  });
}

async function addProducts(orderId, items = []) {
  const responses = [];

  for (const item of items) {
    const product = {
      product_id: item.productId || item.product_id || item.id,
      sold_measurement_value: item.quantity || 1,
      used_wholesale_price: false,
      is_manual: false,
      response_type: "HTTP",
    };

    const res = await sendBillz(
      `v2/order-product/${orderId}?Billz-Response-Channel=HTTP`,
      product
    );
    responses.push(res);
  }

  return responses;
}

async function attachCustomer(orderId, customerId) {
  if (!customerId) return null;
  return sendBillz(
    `v2/order-customer-new/${orderId}?Billz-Response-Channel=HTTP`,
    {
      customer_id: customerId,
      check_auth_code: false,
    },
    "PUT"
  );
}

async function completePayment(orderId, paymentMethod, amount = 0) {
  const paymentTypeId = PAYMENT_TYPE_IDS[paymentMethod] || PAYMENT_TYPE_IDS.cash;
  const paymentName = paymentMethod === "cash" ? "Наличные" : "Безналичный расчет";

  return sendBillz(
    `v2/order-payment/${orderId}?Billz-Response-Channel=HTTP`,
    {
      payments: [
        {
          company_payment_type_id: paymentTypeId,
          paid_amount: amount,
          company_payment_type: { name: paymentName },
          returned_amount: 0,
        },
      ],
      comment: "",
      with_cashback: 0,
      without_cashback: false,
      skip_ofd: false,
    }
  );
}

/**
 * Builds a Billz order from the provided payload and keeps the legacy response shape.
 */
export async function buildBillzOrder(payload) {
  const checkoutMethod =
    payload.checkout?.paymentMethod || payload.payment_method || "cash";

  const createOrderData = await createDraftOrder();
  const orderId =
    createOrderData?.data?.id ||
    createOrderData?.id ||
    createOrderData?.result?.id;

  if (!orderId) {
    throw new Error("Billz response did not return an order id");
  }

  await addProducts(orderId, payload.items || []);
  await attachCustomer(orderId, payload.user?.id || payload.user?.customer_id);
  const paymentResult = await completePayment(orderId, checkoutMethod, payload.totals?.amount || 0);

  const filteredResponse = {
    orderNumber: createOrderData?.data?.order_number,
    orderType: createOrderData?.data?.order_type,
    orderId,
    products: payload.items,
    paymentMethod: payload.checkout || payload.payment_method,
    total: payload.totals,
    raw: {
      createOrderData,
      paymentResult,
    },
  };

  return filteredResponse;
}
