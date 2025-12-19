# Order Creation Flow & Billz Dispatch

## 1. Cart, checkout state, and derived totals
- `useOrderStore` builds the cart via `addItem`/`removeItem`/`updateQuantity`, persists it in `localStorage`, and exposes checkout flags (delivery method, payment method, bonus usage, language, etc.). The helper `computeOrderTotals` recalculates quantity, amount, and currency whenever `items` changes, so the UI always has fresh aggregates (`src/store/orderStore.js:7`).
- Every cart item carries `productId`, names, pricing, variant metadata, and an `image` snapshot so the front end can render a detailed basket without re-fetching product info (`src/store/orderStore.js:27`).

## 2. Order confirmation UI and user gating
- `Order` (the confirm-order component) pulls cart items, totals, checkout flags, and the authenticated user from `useOrderStore`, `computeOrderTotals`, and `useAuthStore`, then renders them with quantity, currency, and buttons. It refuses to submit until the user (from `authStore`) exists, showing a modal with a login redirect if needed (`src/app/(root)/confirm-order/_components/order.jsx:13`).
- `handleSubmit` runs inside `startTransition` so the UI stays responsive while the server action runs. It constructs a payload that includes `items`, the `checkoutState` bundle (delivery, payment, etc.), totals, and `user`, and calls the `createOrder` server action (`src/app/(root)/confirm-order/_components/order.jsx:50`).
- After `createOrder` resolves, success updates the persisted profile orders via `setOrders`, clears the cart/reset checkout state, and redirects to `confirm-order?status=success` (with an optional `gender` parameter) while failures open the error dialog with the returned message (`src/app/(root)/confirm-order/_components/order.jsx:55-79`).

## 3. Server action `createOrder` and Billz payload builder
- `createOrder` lives in `actions/post.js` and runs on the server (`"use server"`). It wraps the incoming payload into `orderData` and always POSTs through the Next.js host at `backUrl` (defaults to `http://localhost:8080`) so every Billz call can travel through the internal proxy (`actions/post.js:7`).
- **Step 1 – create a draft Billz order:** send shop/cashbox identifiers in `firstStepData` to `POST /api/billz/v2/order?Billz-Response-Channel=HTTP`. A missing `orderId` aborts early and surfaces the error to the UI. The response is snapped into `orderResponse.createOrderData` for later reporting (`actions/post.js:73-145`).
- **Step 2 – add products:** the cart’s `items` are mapped to Billz’s `order-product` schema with `product_id`, `sold_measurement_value`, and the static flags `used_wholesale_price: false`, `is_manual: false`, and `response_type: "HTTP"`. Each product call targets `POST /api/billz/v2/order-product/${orderId}`; any failure halts the loop and returns the upstream error details (`actions/post.js:147-172`).
- **Step 3 – attach the customer:** if the user object carried an `id`, the action `PUT /api/billz/v2/order-customer-new/${orderId}?Billz-Response-Channel=HTTP` with `customer_id` and `check_auth_code: false` ensures the Billz order is associated with the right customer profile (`actions/post.js:174-197`).
- **Step 4 – submit payment:** the payload selects a payment type name based on `orderData.checkout.paymentMethod` and hardcodes a `company_payment_type_id`. The `payments` array, `comment`, and OFD flags are sent to `POST /api/billz/v2/order-payment/${orderId}`. Responses or failures from this step are stored to `orderResponse.addPaymentMethodData` or bubbled up (`actions/post.js:198-227`).
- Upon success, the action returns a distilled object (order number/type, `orderId`, original products, checkout method, and totals) so the UI can add it to the profile history (`actions/post.js:219-229`).

## 4. Billz proxy route and environment requirements
- Every Billz operation is funneled through the Next.js API route `src/app/api/billz/[...path]/route.js`, which builds the real endpoint by combining the incoming path with `https://api-admin.billz.ai` and the query string. It injects `BILLZ_API_TOKEN`, `platform-id`, and `Billz-Response-Channel: HTTP` headers on each outgoing request while logging both the request and response (`src/app/api/billz/[...path]/route.js:1`).
- The proxy honors all HTTP verbs (GET, POST, PUT, DELETE, PATCH) so the order action can call whichever endpoint it needs without worrying about tokens or headers (`src/app/api/billz/[...path]/route.js:60`).
- Required environment variables are `BILLZ_API_TOKEN` (the Bearer token) and optionally `BILLZ_PLATFORM_ID` (default `1`), plus any `BASE_URL` override for `backUrl` inside `createOrder`. Those env vars keep credentials on the server and away from the browser.

## 5. Profile persistence and cleanup
- When the order succeeds, the result is appended to `profileStore.orders`, which itself persists in `localStorage`, so order history survives reloads (`src/store/profileStore.js:4`).
- `clearCart`/`resetCheckout` wipe `useOrderStore`, and `router.push` sends the user to the success page so they can see the new status. If `createOrder` errors, the modal simply displays the error message without mutating any stores (`src/app/(root)/confirm-order/_components/order.jsx:55-79`).

## 6. Auxiliary Billz helpers
- `src/lib/api/orders.js` contains a more terse, promise-based helper for the same four Billz steps (draft order, add product, attach customer, complete payment) with constants for shop/cashbox/payment type IDs. It mirrors the proxy URLs and error checking, so it serves as a reference implementation or alternative for other parts of the app (`src/lib/api/orders.js:1-111`).
