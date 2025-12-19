import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { fetchShafranOrders } from "@/lib/server/shafran";

async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE);
  if (!cookie?.value) {
    return { token: null, user: null };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(cookie.value));
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
}

function filterOrdersForUser(orders, user) {
  if (!Array.isArray(orders)) return [];
  if (!user?.id) return orders;
  const userId = user.id || user.user_id;
  return orders.filter((order) => {
    const orderUserId =
      order?.user_id ||
      order?.user?.id ||
      order?.user?.user_id ||
      order?.customer_id;
    return !!orderUserId && orderUserId === userId;
  });
}

export async function GET() {
  const session = await getSession();
  if (!session.token) {
    return NextResponse.json(
      { success: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  try {
    const orders = await fetchShafranOrders(session.token);
    const filtered = filterOrdersForUser(orders, session.user);
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("[Profile Orders] fetchShafranOrders failed", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Не удалось загрузить заказы." },
      { status: 500 }
    );
  }
}
