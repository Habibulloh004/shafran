import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
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
 * CASH to'lov - faqat Shafran backend'ga yuborish
 * Billz integratsiyasi backend tomonida amalga oshiriladi
 */
async function handleCashOrder(payload, token, user) {
  if (!token) {
    return NextResponse.json(
      { success: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  try {
    // Shafran backend'ga order yaratish
    // Backend o'zi Billz'ga yuboradi va Telegram xabar yuboradi
    const result = await createShafranOrder(payload, token);
    console.log("[Cash Order] Backend order created:", result?.data?.order_number);

    return NextResponse.json({
      success: true,
      data: {
        orderId: result?.data?.id,
        orderNumber: result?.data?.order_number,
        status: result?.data?.status,
        ...result?.data,
      },
    });
  } catch (err) {
    console.error("[Cash Order] Failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Buyurtma yaratib bo'lmadi",
      },
      { status: 500 }
    );
  }
}

/**
 * PAYME to'lov - Shafran backend orqali
 * To'lov muvaffaqiyatli bo'lganda backend Billz'ga order yaratadi
 */
async function handlePaymeOrder(payload, userId, token) {
  if (!token) {
    return NextResponse.json(
      { success: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  let shafranResult = null;
  let shafranMeta = null;

  try {
    // 1. Shafran backend'da order yaratish
    shafranResult = await createShafranOrder(payload, token);
    shafranMeta = normalizeShafranOrder(shafranResult);
    console.log("[Payme Order] Backend order created:", shafranMeta);

    if (!shafranMeta.id) {
      throw new Error("Backend order did not return an identifier");
    }
  } catch (err) {
    console.error("[Payme Order] Backend order failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Buyurtma yaratib bo'lmadi",
      },
      { status: 500 }
    );
  }

  // 2. Payme checkout yaratish
  const checkoutAmount = shafranMeta.totalAmount || payload.totals?.amount || 0;
  const checkoutCurrency = shafranMeta.currency || payload.totals?.currency || "UZS";

  try {
    const payme = await createShafranPaymeCheckout({
      orderId: shafranMeta.id,
      amount: checkoutAmount,
      currency: checkoutCurrency,
      userId,
      rawPayload: payload,
    });
    console.log("[Payme Order] Checkout created:", payme);

    // Telegram notification is handled by the backend server

    return NextResponse.json({
      success: true,
      data: {
        orderId: shafranMeta.id,
        orderNumber: shafranMeta.orderNumber,
        paymentMethod: "payme",
        payme: {
          paymentUrl: payme.paymentUrl,
          orderId: payme.orderId,
          transactionId: payme.transactionId,
        },
      },
    });
  } catch (err) {
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
    const orderUserId = order?.user_id;
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
    console.error("[Orders GET] Failed to fetch orders:", error);
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
 * Barcha Billz integratsiyasi backend tomonida amalga oshiriladi:
 * - Cash to'lov: backend darhol Billz'ga yuboradi
 * - Payme to'lov: to'lov muvaffaqiyatli bo'lganda backend Billz'ga yuboradi
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

  if (paymentMethod === "payme") {
    return handlePaymeOrder(payload, userId, token);
  }

  return handleCashOrder(payload, token, sessionUser);
}
