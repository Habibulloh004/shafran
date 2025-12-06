"use server";

import { NextResponse } from "next/server";
import { apiPost } from "@/lib/api/client";

export async function POST(request) {
  let payload = null;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "INVALID_PAYLOAD" },
      { status: 400 }
    );
  }

  const body = {
    phone: payload?.phone || "",
    email: payload?.email || "",
  };

  if (!body.phone && !body.email) {
    return NextResponse.json(
      { success: false, error: "Введите номер телефона или email." },
      { status: 400 }
    );
  }

  try {
    await apiPost("/api/auth/forgot-password", {
      body,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password request failed", error);
    const message =
      error?.details?.error?.message ||
      error?.message ||
      "Не удалось отправить запрос на восстановление.";
    return NextResponse.json(
      { success: false, error: message },
      { status: error?.status || 500 }
    );
  }
}
