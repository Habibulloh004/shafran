"use server";

const PAYME_CHECKOUT_URL =
  process.env.PAYME_CHECKOUT_URL ||
  process.env.BASE_URL ||
  "http://localhost:8080";
const PAYME_CALLBACK_URL =
  process.env.PAYME_CALLBACK_URL ||
  `${process.env.BASE_URL || "http://localhost:3000"}/api/payme/webhook`;
const PAYME_RETURN_URL =
  process.env.PAYME_RETURN_URL ||
  `${process.env.BASE_URL || "http://localhost:3000"}/confirm-order?status=success`;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export async function createPaymeTransaction({ orderId, amount = 0, description = "" }) {
  const payload = {
    order_id: orderId,
    amount,
    order_description: description || `Order ${orderId}`,
    return_url: PAYME_RETURN_URL,
    callback_url: PAYME_CALLBACK_URL,
  };

  try {
    const response = await fetch(`${PAYME_CHECKOUT_URL}/api/payme/checkout`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || data?.message || "Payme checkout failed");
    }

    const transactionId =
      data?.transaction_id ?? data?.result?.id ?? data?.id ?? null;
    const paymentUrl =
      data?.payment_url ??
      data?.result?.payment_url ??
      data?.result?.url ??
      null;

    return {
      transactionId: transactionId ?? `payme-${orderId}`,
      paymentUrl: paymentUrl ?? `${PAYME_RETURN_URL}&mock_transaction=${orderId}`,
      rawResponse: data,
    };
  } catch (error) {
    console.warn("[Payme] Fallback checkout:", error);
    const fallbackId = `mock-payme-${orderId}-${Date.now()}`;
    return {
      transactionId: fallbackId,
      paymentUrl: `${PAYME_RETURN_URL}&mock_transaction=${fallbackId}`,
      rawResponse: {
        fallback: true,
        error: error?.message,
      },
    };
  }
}
