# Billz cash payment order flow

## Background
Use this prompt to describe how to create a cash-based order in the Billz backend (refer to `src/lib/server/billz.js`). The caller should understand the expectations for payload shape, the sequence of HTTP calls, and the final data that the app relies on without needing to read the code first.

## Workflow
1. **Prepare the draft order**
   - POST to `/api/billz/v2/order?Billz-Response-Channel=HTTP` with `shop_id` and `cashbox_id`.
   - Capture the returned `orderId` (under `data.id`, `id`, or `result.id`) and `order_number`/`order_type` from `data`.

2. **Add products**
   - For each cart item send POST to `/api/billz/v2/order-product/{orderId}?Billz-Response-Channel=HTTP`.
   - Include `product_id`, `sold_measurement_value` (quantity), `used_wholesale_price: false`, `is_manual: false`, `response_type: HTTP`.

3. **Attach customer (optional)**
   - If a user/customer identifier exists, send PUT to `/api/billz/v2/order-customer-new/{orderId}?Billz-Response-Channel=HTTP`.
   - Payload: `{ customer_id, check_auth_code: false }`.

4. **Complete payment**
   - POST to `/api/billz/v2/order-payment/{orderId}?Billz-Response-Channel=HTTP`.
   - For cash set:
     ```json
     {
       "payments": [
         {
           "company_payment_type_id": "6042429f-0d4c-40b7-9ee8-55c115865146",
           "paid_amount": <totals.amount>,
           "company_payment_type": { "name": "Наличные" },
           "returned_amount": 0
         }
       ],
       "comment": "",
       "with_cashback": 0,
       "without_cashback": false,
       "skip_ofd": false
     }
     ```
   - Use the same static IDs defined in `PAYMENT_TYPE_IDS`.

## Payload contract
- `payload.items`: list detailing `productId`/`product_id`, `quantity`, `price`.
- `payload.checkout.paymentMethod` (defaults to `cash`).
- `payload.totals.amount`: number used as `paid_amount`.
- `payload.user?.id` or `payload.user?.customer_id` used during customer attachment.

## Response expectation
- Return an object with `orderId`, `orderNumber`, `paymentMethod`, `products`, `total`, and `raw` containing the Billz API responses (`createOrderData`, `paymentResult`).
- The UI relies on `filteredResponse.paymentMethod` to know the chosen payment option; cash orders set this to `"cash"`.

The prompt should guide a human or another agent to recreate `buildBillzOrder` in `src/lib/server/billz.js` when `paymentMethod === "cash"`, matching the existing static IDs and headers.
