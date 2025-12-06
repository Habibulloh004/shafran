/**
 * Billz Order API - Sodda va toza
 */

const SHOP_ID = "83cdf361-cb50-48ce-a56f-01c8068bf63b";
const CASHBOX_ID = "cef95f48-35e7-4a28-a59e-28624f0896ab";

const PAYMENT_TYPE_IDS = {
  cash: "6042429f-0d4c-40b7-9ee8-55c115865146",
  card: "0bf1d4d2-1383-4ba2-92c8-8569d60e3b60",
};

/**
 * Checkout dan order yaratish
 */
export async function createOrder(payload) {
  console.log("[ORDER] Starting order creation...");

  // 1. Draft order yaratish
  const orderId = await createDraftOrder();
  console.log("[ORDER] Draft created:", orderId);

  // 2. Mahsulotlarni qo'shish
  for (const item of payload.items) {
    await addProduct(orderId, item.productId || item.id, item.quantity);
    console.log("[ORDER] Product added:", item.name);
  }

  // 3. Mijozni biriktirish
  const customerId = payload.user?.id || payload.user?.customer_id;
  if (customerId) {
    await attachCustomer(orderId, customerId);
    console.log("[ORDER] Customer attached:", customerId);
  }

  // 4. To'lovni yakunlash
  const paymentType = payload.checkout?.paymentMethod || "cash";
  const amount = payload.totals?.amount || 0;
  await completePayment(orderId, paymentType, amount);
  console.log("[ORDER] Payment completed");

  return { success: true, order_id: orderId };
}

/**
 * Step 1: Draft order yaratish
 */
async function createDraftOrder() {
  const res = await fetch("/api/billz/v2/order?Billz-Response-Channel=HTTP", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shop_id: SHOP_ID,
      cashbox_id: CASHBOX_ID,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Draft order yaratishda xatolik");

  return data.result || data.order_id || data.id;
}

/**
 * Step 2: Mahsulot qo'shish
 */
async function addProduct(orderId, productId, quantity) {
  const res = await fetch(`/api/billz/v2/order-product/${orderId}?Billz-Response-Channel=HTTP`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: productId,
      sold_measurement_value: quantity || 1,
      used_wholesale_price: false,
      is_manual: false,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Mahsulot qo'shishda xatolik");

  return data;
}

/**
 * Step 3: Mijoz biriktirish
 */
async function attachCustomer(orderId, customerId) {
  const res = await fetch(`/api/billz/v2/order-customer-new/${orderId}?Billz-Response-Channel=HTTP`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: customerId,
      check_auth_code: false,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Mijoz biriktirishda xatolik");

  return data;
}

/**
 * Step 4: To'lovni yakunlash
 */
async function completePayment(orderId, paymentType, amount) {
  const paymentTypeId = PAYMENT_TYPE_IDS[paymentType] || PAYMENT_TYPE_IDS.cash;
  const paymentName = paymentType === "card" ? "Карта" : "Наличные";

  const res = await fetch(`/api/billz/v2/order-payment/${orderId}?Billz-Response-Channel=HTTP`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "To'lovda xatolik");

  return data;
}
