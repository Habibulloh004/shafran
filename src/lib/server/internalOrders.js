import { randomUUID } from "crypto";

const orders = new Map();
const paymeIndex = new Map();

function stamp() {
  return new Date().toISOString();
}

function normalizePayload(payload) {
  const clonedItems = Array.isArray(payload.items) ? payload.items.map((item) => ({ ...item })) : [];
  return {
    ...payload,
    items: clonedItems,
    checkout: { ...(payload.checkout || {}) },
    user: { ...(payload.user || {}) },
    totals: { ...(payload.totals || {}) },
  };
}

export function createInternalOrder(payload, options = {}) {
  const normalized = normalizePayload(payload);
  const id = randomUUID();

  const order = {
    id,
    status: "pending",
    createdAt: stamp(),
    updatedAt: stamp(),
    rawPayload: normalized,
    paymentMethod:
      normalized.checkout?.paymentMethod ||
      normalized.payment_method ||
      "cash",
    amount:
      normalized.totals?.amount ??
      normalized.total ??
      normalized.sum ??
      0,
    currency:
      normalized.totals?.currency ||
      normalized.currency ||
      "UZS",
    billz: null,
    payme: null,
    logs: [],
    authToken: options.authToken || null,
  };

  orders.set(id, order);
  return order;
}

export function getInternalOrder(id) {
  return orders.get(id) || null;
}

export function listInternalOrders() {
  return Array.from(orders.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function findOrderByPaymeTransaction(transactionId) {
  if (!transactionId) return null;
  const orderId = paymeIndex.get(transactionId);
  if (!orderId) return null;
  return getInternalOrder(orderId);
}

export function appendOrderLog(id, message) {
  const order = getInternalOrder(id);
  if (!order) return;
  const entry = { timestamp: stamp(), message };
  const updated = { ...order, logs: [...order.logs, entry], updatedAt: stamp() };
  orders.set(id, updated);
  return updated;
}

export function updateInternalOrder(id, updates = {}) {
  const order = getInternalOrder(id);
  if (!order) return null;
  const next = {
    ...order,
    ...updates,
    updatedAt: stamp(),
  };

  if (updates.payme?.transactionId) {
    paymeIndex.set(updates.payme.transactionId, id);
  }

  if (updates.payme === null && order?.payme?.transactionId) {
    paymeIndex.delete(order.payme.transactionId);
  }

  orders.set(id, next);
  return next;
}
