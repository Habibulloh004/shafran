// Stub – in-memory order store for the Payme webhook callback
const orders = new Map();

export function getInternalOrder(id) {
  return orders.get(id) || null;
}

export function updateInternalOrder(id, patch) {
  const order = orders.get(id);
  if (order) {
    Object.assign(order, patch);
    orders.set(id, order);
  }
}

export function appendOrderLog(id, message) {
  const order = orders.get(id);
  if (order) {
    order.logs = order.logs || [];
    order.logs.push({ message, ts: Date.now() });
  }
}

export function findOrderByPaymeTransaction(transactionId) {
  if (!transactionId) return null;
  for (const order of orders.values()) {
    if (order.paymeTransactionId === transactionId) return order;
  }
  return null;
}

export function createInternalOrder(data) {
  orders.set(data.id, data);
  return data;
}
