import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { buildBillzOrder } from "@/lib/server/billz";
import {
  createInternalOrder,
  updateInternalOrder,
  appendOrderLog,
} from "@/lib/server/internalOrders";
import {
  createShafranOrder,
  createShafranPaymeCheckout,
  fetchShafranOrders,
  normalizeShafranOrder,
} from "@/lib/server/shafran";

async function getAuthSession() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  if (!authCookie?.value) {
    return { token: null, user: null };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(authCookie.value));
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
}

/**
 * CASH to'lov - Shafran server + Billz
 */
async function handleCashOrder(order, token) {
  let shafranResult = null;
  let shafranError = null;

  if (!token) {
    const errorMsg = "AUTH_REQUIRED: valid user token is required to create cash orders";
    console.error("[Cash Order] Missing auth token:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 401 }
    );
  }

  // 1. Shafran serverga order yaratish
  try {
    shafranResult = await createShafranOrder(order.rawPayload, token);
    console.log("[Cash Order] Shafran order created:", shafranResult?.data?.order_number);
  } catch (err) {
    shafranError = err?.message || "Shafran order failed";
    console.error("[Cash Order] Shafran order failed:", shafranError);
  }

  // 2. Billz ga order yaratish
  let billzResult = null;
  let billzError = null;

  try {
    billzResult = await buildBillzOrder(order.rawPayload);
    console.log("[Cash Order] Billz order created:", billzResult?.orderId);
  } catch (err) {
    billzError = err?.message || "Billz order failed";
    console.error("[Cash Order] Billz order failed:", billzError);
  }

  // Agar ikkisi ham muvaffaqiyatsiz bo'lsa
  if (!shafranResult && !billzResult) {
    return NextResponse.json(
      {
        success: false,
        error: shafranError || billzError || "Buyurtma yaratib bo'lmadi",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      internalOrderId: order.id,
      shafran: shafranResult,
      billz: billzResult,
    },
  });
}

/**
 * PAYME to'lov - Shafran server orqali Payme checkout
 */
async function handlePaymeOrder(order, userId, token) {
  if (!token) {
    const message = "AUTH_REQUIRED: valid user token is required to create Payme orders";
    appendOrderLog(order.id, message);
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }

  let shafranResult = null;
  let shafranMeta = null;

  try {
    shafranResult = await createShafranOrder(order.rawPayload, token);
    shafranMeta = normalizeShafranOrder(shafranResult);
    console.log({ shafranResult, shafranMeta });
    if (!shafranMeta.id) {
      throw new Error("Shafran order did not return an identifier");
    }
    appendOrderLog(
      order.id,
      `Shafran order ${shafranMeta.orderNumber || shafranMeta.id} created before Payme checkout`
    );
  } catch (err) {
    appendOrderLog(order.id, `Shafran order creation failed before Payme: ${err?.message}`);
    updateInternalOrder(order.id, {
      status: "failed",
      error: err?.message,
    });
    console.error("[Payme Order] Shafran order failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Shafran order yaratib bo'lmadi",
      },
      { status: 500 }
    );
  }

  const checkoutAmount = shafranMeta.totalAmount || order.amount;
  const checkoutCurrency = shafranMeta.currency || order.currency;

  try {
    const payme = await createShafranPaymeCheckout({
      orderId: shafranResult?.data?.id,
      amount: checkoutAmount,
      currency: checkoutCurrency,
      userId,
      rawPayload: order.rawPayload,
    });
    console.log("[Payme Order] Checkout created:", payme);

    updateInternalOrder(order.id, {
      status: "pending_payment",
      shafran: {
        response: shafranResult,
        meta: shafranMeta,
      },
      payme: {
        transactionId: payme.transactionId,
        orderId: payme.orderId,
        paymentUrl: payme.paymentUrl,
        amount: checkoutAmount,
        rawResponse: payme.rawResponse,
      },
    });
    appendOrderLog(
      order.id,
      `Payme checkout created (${payme.transactionId || "no transaction id"})`
    );

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        paymentMethod: "payme",
        payme: {
          paymentUrl: payme.paymentUrl,
          orderId: payme.orderId,
          transactionId: payme.transactionId,
        },
        shafran: {
          orderId: shafranMeta.id,
          orderNumber: shafranMeta.orderNumber,
        },
      },
    });
  } catch (err) {
    appendOrderLog(order.id, `Payme checkout failed: ${err?.message}`);
    updateInternalOrder(order.id, {
      status: "failed",
      error: err?.message,
    });
    console.error("[Payme Order] Checkout failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Payme checkout yaratib bo'lmadi",
      },
      { status: 500 }
    );
  }
}

function filterOrdersByUser(orders, user) {
  if (!Array.isArray(orders)) {
    return [];
  }

  if (!user?.user_id) {
    return orders;
  }

  const userId = user.user_id;
  return orders.filter((order) => {
    const orderUserId =
      order?.user_id;
    return !!orderUserId && orderUserId === userId;
  });
}

export async function GET() {
  const session = await getAuthSession();
  console.log("[Orders GET] Auth session:", session);
  if (!session.token) {
    return NextResponse.json(
      { success: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }


  try {
    const orders = await fetchShafranOrders(session.token);
    const filteredOrders = filterOrdersByUser(orders, session.user);

    return NextResponse.json({
      success: true,
      data: filteredOrders,
    });
  } catch (error) {
    console.error("[Orders GET] Failed to fetch backend orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Не удалось получить заказы.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Order yaratish
 */
export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const session = await getAuthSession();
  const token = session.token;
  const sessionUser = session.user;
  const paymentMethod =
    payload.checkout?.paymentMethod ||
    payload.payment_method ||
    "cash";

  const userId =
    sessionUser?.id ||
    sessionUser?.user_id ||
    payload.user?.id ||
    payload.user?.user_id ||
    null;

  console.log("[Order] Creating order with payment method:", paymentMethod);

  // Order tracking uchun
  if (paymentMethod === "payme") {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }
    const shafranOrder = createInternalOrder(payload, { authToken: token });
    appendOrderLog(shafranOrder.id, "ShafranOrder created before Payme checkout");
    return handlePaymeOrder(shafranOrder, userId, token);
  }

  const order = {
    id: crypto.randomUUID(),
    rawPayload: payload,
    paymentMethod,
    amount: payload.totals?.amount || 0,
    currency: payload.totals?.currency || "UZS",
    createdAt: new Date().toISOString(),
  };

  return handleCashOrder(order, token);
}
