import { NextResponse } from "next/server";
import {
  getInternalOrder,
  updateInternalOrder,
  appendOrderLog,
  findOrderByPaymeTransaction,
} from "@/lib/server/internalOrders";
import { buildBillzOrder } from "@/lib/server/billz";

function respond(payload, options = {}) {
  return NextResponse.json(payload, options);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const transactionId = body?.transaction_id || body?.transactionId;
  const status = (body?.status || "").toLowerCase();
  const orderId = body?.order_id || body?.orderId;

  const order =
    (orderId && getInternalOrder(orderId)) ||
    findOrderByPaymeTransaction(transactionId);

  if (!order) {
    return respond({ success: false, error: "Order not found" }, { status: 404 });
  }

  if (order.billz?.orderId) {
    return respond({ success: true, message: "Billz order already processed" });
  }

  if (status === "success" || status === "completed") {
    appendOrderLog(order.id, `Payme callback confirmed (transaction ${transactionId})`);
    try {
      const billz = await buildBillzOrder(order.rawPayload);
      appendOrderLog(order.id, `Billz order ${billz.orderId} created after Payme success`);
      updateInternalOrder(order.id, {
        status: "paid",
        billz: {
          orderId: billz.orderId,
          response: billz,
        },
      });
      return respond({ success: true, billz });
    } catch (error) {
      updateInternalOrder(order.id, { status: "failed", error: error?.message });
      appendOrderLog(order.id, `Billz creation failed after Payme success: ${error?.message}`);
      return respond({ success: false, error: error?.message || "Billz creation failed" }, { status: 500 });
    }
  }

  const cancelReason =
    status === "failed" || status === "cancelled" ? status : "unknown";
  appendOrderLog(order.id, `Payme transaction ${transactionId} reported ${cancelReason}`);
  updateInternalOrder(order.id, { status: "cancelled" });
  return respond({ success: true, message: "Order cancelled" });
}
