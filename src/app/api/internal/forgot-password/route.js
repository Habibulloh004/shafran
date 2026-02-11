import { NextResponse } from "next/server";
import { apiPost } from "@/lib/api/client";

export async function POST(request) {
  let payload = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_PAYLOAD" },
      { status: 400 }
    );
  }

  const { action } = payload;

  // Step 1: Request reset code
  if (!action || action === "request") {
    const phone = payload?.phone || "";
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Введите номер телефона." },
        { status: 400 }
      );
    }

    try {
      const result = await apiPost("/api/auth/forgot-password", {
        body: { phone },
      });
      return NextResponse.json({
        success: true,
        token: result?.token,
        session_id: result?.session_id,
        code: result?.code,
      });
    } catch (error) {
      console.error("Forgot password request failed", error);
      const message =
        error?.details?.message ||
        error?.message ||
        "Не удалось отправить запрос.";
      return NextResponse.json(
        { success: false, error: message },
        { status: error?.status || 500 }
      );
    }
  }

  // Step 2: Verify code
  if (action === "verify") {
    const { token, code, session_id } = payload;
    if (!token || !code) {
      return NextResponse.json(
        { success: false, error: "Код и токен обязательны." },
        { status: 400 }
      );
    }

    try {
      const result = await apiPost("/api/auth/verify-reset-code", {
        body: { token, code, session_id },
      });
      return NextResponse.json({
        success: true,
        verified: result?.verified,
        token: result?.token,
      });
    } catch (error) {
      console.error("Verify reset code failed", error);
      const message =
        error?.details?.message ||
        error?.message ||
        "Неверный код подтверждения.";
      return NextResponse.json(
        { success: false, error: message },
        { status: error?.status || 500 }
      );
    }
  }

  // Step 3: Reset password
  if (action === "reset") {
    const { token, new_password } = payload;
    if (!token || !new_password) {
      return NextResponse.json(
        { success: false, error: "Токен и новый пароль обязательны." },
        { status: 400 }
      );
    }

    try {
      const result = await apiPost("/api/auth/reset-password", {
        body: { token, new_password },
      });
      return NextResponse.json({ success: true, message: result?.message });
    } catch (error) {
      console.error("Reset password failed", error);
      const message =
        error?.details?.message ||
        error?.message ||
        "Не удалось сменить пароль.";
      return NextResponse.json(
        { success: false, error: message },
        { status: error?.status || 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: "Unknown action" },
    { status: 400 }
  );
}
