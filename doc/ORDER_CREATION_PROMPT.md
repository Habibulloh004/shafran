# Order creation backend prompt

This document translates the client-side order confirmation flow into a backend task description. Use it as the spec for any Billz-order implementation or API that should satisfy `src/app/(root)/confirm-order/_components/order.jsx`.

## Payload the UI sends to `createOrder`

The page submits a single object that bundles cart state, checkout preferences, totals, and the authenticated user:

- **`items`** – an array where each entry comes from `useOrderStore`. Every item carries:
  - `productId` (Billz expects `product_id`) plus optional `categoryId`.
  - `name`, `description`, `variantLabel`, and `variantId` so the UI can render copies; the backend can store them for audit/logging if needed.
  - `price`, `currency`, `quantity`, and `image`/`productSnapshot` for bookkeeping before shipping the concise Billz payload.
- **`checkout`** – the checkout state bundle:
  - `deliveryMethod` (default `address`), `selectedAddress`, `paymentMethod` (`cash` or other strings), `selectedDigitalPayment`.
  - Bonus flags: `useBonus` (boolean), `bonusAmount`, card metadata (`cardNumber`, `expiry`), and `language`.
- **`totals`** – derived from `computeOrderTotals(items)` and contains `{ amount, quantity, currency }`.
- **`user`** – authenticated profile object pulled from `useAuthStore`; only `user.id` is essential for Billz (others may help logging/tracing).

## Order creation steps (Billz backend)

1. **Create a draft order**
   - `POST /api/billz/v2/order?Billz-Response-Channel=HTTP`
   - Payload: `{ shop_id: "29ce1934-120f-459a-8046-8bfa89529a3c", cashbox_id: "83cdf361-cb50-48ce-a56f-01c8068bf63b" }`
   - Expect `id` inside response; abort if missing.

2. **Add each product**
   - For every cart item, call `POST /api/billz/v2/order-product/{orderId}` with:
     ```json
     {
       "sold_measurement_value": <item.quantity>,
       "product_id": <item.productId>,
       "used_wholesale_price": false,
       "is_manual": false,
       "response_type": "HTTP"
     }
     ```
   - Stop and surface the error if any product call returns a non-ok status.

3. **Attach the customer**
   - `PUT /api/billz/v2/order-customer-new/{orderId}?Billz-Response-Channel=HTTP`
   - Payload: `{ "customer_id": user.id, "check_auth_code": false }`

4. **Register payment**
   - `POST /api/billz/v2/order-payment/{orderId}`
   - Payment data uses:
     - `company_payment_type_id: "6042429f-0d4c-40b7-9ee8-55c115865146"`
     - `paid_amount: totals.amount`
     - `company_payment_type.name` depends on `checkout.paymentMethod` (“Наличные” vs “Безналичный расчет”).
     - Includes optional `comment` from `checkout.comment` plus `with_cashback`, `without_cashback`, `skip_ofd` flags (all currently `0`/`false`).

5. **Return distilled result**
   - On success, respond with:
     ```json
     {
       "orderNumber": createOrderData.data.order_number,
       "orderType": createOrderData.data.order_type,
       "orderId": createOrderData.id,
       "products": items,
       "paymentMethod": checkout,
       "total": totals
     }
     ```
   - This structure is appended to `profileStore.orders` on the client and used for the confirmation redirect.

## Environment & helpers

- All Billz calls go through the proxy at `/api/billz/[...path]/route.js`, which injects the `BILLZ_API_TOKEN`, optional `BILLZ_PLATFORM_ID`, and `Billz-Response-Channel: HTTP` header.
- The backend should honor `BASE_URL` overrides for local testing (`backUrl` defaults to `http://localhost:8080` inside `createOrder`).
- Keep the same error handling strategy: return a descriptive message when any step fails so the client shows it in the dialog.

Use this prompt when building or reviewing the backend endpoint that powers `createOrder` so it matches what the UI expects to send and receive.

## Payme-specific flow

- When `checkout.paymentMethod === "payme"` the client must not trigger any Billz calls yet. The backend should:
  1. Persist the incoming order data (`items`, `checkout`, `totals`, `user`) as a platform `Order` record with status `pending` or similar.
  2. Issue the Payme payment link/transaction by calling your internal Payme checkout pipeline (e.g. `/api/payme/checkout` or the JSON-RPC `CreateTransaction` sequence described in `doc/PROJECT_DOCUMENTATION.md`), forwarding the just-created internal `order_id` and `totals.amount`.
  3. Return the Payme response to the client so the UI can redirect the user to Payme (send back the payment URL, transaction ID, and any metadata required to resume).
  4. Do **not** invoke any of the Billz steps during this request.

- All downstream decisions must happen automatically on the backend:
  - After Payme confirms the transaction, complete the Billz workflow from Step 1 above (create draft order, add products, attach customer, register payment) using the same static IDs and headers, and mark the internal order as `paid`/`completed`.
  - If Payme reports the payment as cancelled/failed, abort the Billz workflow, mark the internal order as `cancelled`, and notify the client (or allow the UI to poll for status).
  - Ensure any retries or webhook events that arrive after the initial Payme response are idempotent so a single Payme callback never creates duplicate Billz orders.

- Keep logging around the Payme transaction ID, internal order ID, and Billz order ID so the client-facing request can trace the final status.

This ensures the frontend still calls a single `createOrder`-style endpoint but the server branches: immediate Billz creation for non-Payme methods and deferred Billz creation tied to the Payme lifecycle as described above.
