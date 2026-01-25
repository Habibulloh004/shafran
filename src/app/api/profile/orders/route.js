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

export async function GET() {
  const session = await getSession();
  if (!session.token) {
    return NextResponse.json(
      { success: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  try {
    // Backend allaqachon user_id bo'yicha filter qiladi (token'dan user ID olinadi)
    const orders = await fetchShafranOrders(session.token);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("[Profile Orders] fetchShafranOrders failed", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Не удалось загрузить заказы." },
      { status: 500 }
    );
  }
}
