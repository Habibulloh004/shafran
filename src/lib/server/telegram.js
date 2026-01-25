"use server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

/**
 * Telegram'ga xabar yuborish
 */
async function sendTelegramMessage(chatId, text, options = {}) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("[Telegram] Bot token not configured");
    return { success: false, error: "Bot token not configured" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          ...options,
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("[Telegram] Send message failed:", result);
      return { success: false, error: result.description };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("[Telegram] Error sending message:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Narxni formatlash
 */
function formatPrice(amount, currency = "UZS") {
  if (!amount) return "0";
  return new Intl.NumberFormat("ru-RU").format(amount) + " " + currency;
}

/**
 * Yangi order haqida admin guruhga xabar yuborish
 */
export async function notifyNewOrder(orderData) {
  if (!TELEGRAM_ADMIN_CHAT_ID) {
    console.warn("[Telegram] Admin chat ID not configured");
    return { success: false, error: "Admin chat ID not configured" };
  }

  const {
    orderId,
    orderNumber,
    items = [],
    totals = {},
    user = {},
    paymentMethod = "cash",
    status = "pending",
  } = orderData;

  // Mahsulotlar ro'yxatini formatlash
  const productsList = items
    .map((item, index) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      return `   ${index + 1}. <b>${item.name || "Без названия"}</b>
      ${item.quantity || 1} x ${formatPrice(item.price, item.currency || "UZS")} = ${formatPrice(itemTotal, item.currency || "UZS")}`;
    })
    .join("\n\n");

  // To'lov usuli
  const paymentMethodText =
    paymentMethod === "payme" ? "Payme" : "Наличными";

  // Foydalanuvchi ma'lumotlari
  const userName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Не указано";
  const userPhone = user.phone_number || user.phone || "Не указано";

  // Xabar matni
  const message = `
<b>🛒 YANGI BUYURTMA!</b>

<b>📋 Buyurtma raqami:</b> #${orderNumber || orderId || "N/A"}

<b>👤 Mijoz:</b>
   Ism: ${userName}
   Telefon: ${userPhone}

<b>📦 Mahsulotlar:</b>
${productsList}

<b>💰 Jami:</b> ${formatPrice(totals.amount, totals.currency || "UZS")}
<b>📊 Soni:</b> ${totals.quantity || items.length} ta

<b>💳 To'lov usuli:</b> ${paymentMethodText}
<b>📍 Status:</b> ${status === "paid" ? "✅ To'langan" : "⏳ Kutilmoqda"}

━━━━━━━━━━━━━━━━━━
<i>Shafran Parfumery</i>
`.trim();

  return sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, message);
}

/**
 * To'lov muvaffaqiyatli bo'lganda xabar yuborish
 */
export async function notifyPaymentSuccess(orderData) {
  if (!TELEGRAM_ADMIN_CHAT_ID) {
    return { success: false, error: "Admin chat ID not configured" };
  }

  const { orderId, orderNumber, amount, currency = "UZS" } = orderData;

  const message = `
<b>✅ TO'LOV QABUL QILINDI!</b>

<b>📋 Buyurtma:</b> #${orderNumber || orderId || "N/A"}
<b>💰 Summa:</b> ${formatPrice(amount, currency)}
<b>💳 Usul:</b> Payme

━━━━━━━━━━━━━━━━━━
<i>Shafran Parfumery</i>
`.trim();

  return sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, message);
}
