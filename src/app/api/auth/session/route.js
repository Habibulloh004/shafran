import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const serializeValue = (payload) => {
  try {
    return encodeURIComponent(JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to serialize auth payload", error);
    return "";
  }
};

const buildCookieOptions = (maxAge = DEFAULT_MAX_AGE) => ({
  name: AUTH_COOKIE,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge,
});

/**
 * GET - Session mavjudligini tekshirish
 * AuthSyncProvider bu endpoint'ni chaqiradi
 */
export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);

  if (!authCookie?.value) {
    return NextResponse.json(
      { success: false, error: "NO_SESSION" },
      { status: 401 }
    );
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(authCookie.value));
    if (!parsed?.token) {
      return NextResponse.json(
        { success: false, error: "INVALID_SESSION" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        token: parsed.token,
        user: parsed.user || null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_SESSION" },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    body = null;
  }

  const token = typeof body?.token === "string" ? body.token : null;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "TOKEN_REQUIRED" },
      { status: 400 }
    );
  }

  const payload = {
    token,
    user: body?.user || null,
    phone_number:
      body?.user?.phone_number ||
      body?.phone_number ||
      body?.user?.phone ||
      null,
    issued_at: new Date().toISOString(),
  };

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    ...buildCookieOptions(body?.maxAge ?? DEFAULT_MAX_AGE),
    value: serializeValue(payload),
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    ...buildCookieOptions(0),
    value: "",
  });
  return response;
}
