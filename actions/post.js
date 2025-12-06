"use server";

import { revalidateTag, revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const backUrl = process.env.BASE_URL || 'http://localhost:8080';

// Universal POST action
export async function postData({
  endpoint,
  data,
  tag,
  revalidateTags,
  revalidatePaths,
  redirectTo,
  requireAuth = false
}) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Auth token qo'shish (agar kerak bo'lsa)
    if (requireAuth) {
      const token = await getAuthToken(); // Bu funksiyani keyinroq implement qilasiz
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${backUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Cache revalidation
    if (tag) {
      const tags = Array.isArray(tag) ? tag : [tag];
      tags.forEach(t => revalidateTag(t));
    }

    if (revalidateTags) {
      const tags = Array.isArray(revalidateTags) ? revalidateTags : [revalidateTags];
      tags.forEach(t => revalidateTag(t));
    }

    if (revalidatePaths) {
      const paths = Array.isArray(revalidatePaths) ? revalidatePaths : [revalidatePaths];
      paths.forEach(p => revalidatePath(p));
    }

    // Redirect qilish
    if (redirectTo) {
      redirect(redirectTo);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to post data:", error);
    return { success: false, error: error.message };
  }
}
// Order actions
export async function createOrder(data) {
  const orderData = {
    items: data.items,
    checkout: data.checkout,
    totals: data.totals,
    user: data.user
  };

  const headers = { "Content-Type": "application/json" };

  // 1) First step data
  const firstStepData = {
    shop_id: "29ce1934-120f-459a-8046-8bfa89529a3c",
    cashbox_id: "83cdf361-cb50-48ce-a56f-01c8068bf63b"
  };

  // 2) Payment method
  const paymentMethodData = {
    payments: [
      {
        company_payment_type_id: "6042429f-0d4c-40b7-9ee8-55c115865146",
        paid_amount: orderData.totals.amount,
        company_payment_type: {
          name:
            orderData?.checkout?.paymentMethod === "cash"
              ? "Наличные"
              : "Безналичный расчет"
        },
        returned_amount: 0
      }
    ],
    comment: orderData?.checkout?.comment || "",
    with_cashback: 0,
    without_cashback: false,
    skip_ofd: false
  };

  // 3) Product map
  const products = orderData.items.map((item) => ({
    sold_measurement_value: item.quantity,
    product_id: item.productId,
    used_wholesale_price: false,
    is_manual: false,
    response_type: "HTTP"
  }));

  console.log({ products })

  // --- 1. CREATE ORDER ---
  const createOrderRes = await fetch(
    `${backUrl}/api/billz/v2/order?Billz-Response-Channel=HTTP`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(firstStepData)
    }
  );

  if (!createOrderRes.ok) {
    const errorData = await createOrderRes.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.error || `Create Order Failed: ${createOrderRes.status}`
    };
  }

  const createOrderData = await createOrderRes.json();
  const orderId = createOrderData.id;

  if (!orderId)
    return { success: false, error: "Order ID not returned from API." };

  const orderResponse = { createOrderData };

  // --- 2. ADD PRODUCTS ---
  let productSuccess = null;

  for (const [index, product] of products.entries()) {
    const res = await fetch(
      `${backUrl}/api/billz/v2/order-product/${orderId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(product)
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `Product ${index + 1} add failed: ${JSON.stringify(errorData)}`
      };
    }

    const json = await res.json();
    productSuccess = (json);
  }

  orderResponse.productSuccess = productSuccess;

  // --- 3. ADD CUSTOMER ---
  const addCustomerRes = await fetch(
    `${backUrl}/api/billz/v2/order-customer-new/${orderId}?Billz-Response-Channel=HTTP`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        customer_id: orderData.user.id,
        check_auth_code: false
      })
    }
  );

  if (!addCustomerRes.ok) {
    const errorData = await addCustomerRes.json().catch(() => ({}));
    return {
      success: false,
      error: `Add customer failed: ${JSON.stringify(errorData)}`
    };
  }

  const addCustomerInOrderData = await addCustomerRes.json();
  orderResponse.addCustomerInOrderData = addCustomerInOrderData;

  // --- 4. ADD PAYMENT METHOD ---
  const addPaymentRes = await fetch(
    `${backUrl}/api/billz/v2/order-payment/${orderId}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(paymentMethodData)
    }
  );

  if (!addPaymentRes.ok) {
    const errorData = await addPaymentRes.json().catch(() => ({}));
    return {
      success: false,
      error: `Add payment failed: ${JSON.stringify(errorData)}`
    };
  }

  const addPaymentMethodData = await addPaymentRes.json();
  orderResponse.addPaymentMethodData = addPaymentMethodData;

  const filterOrderResponse = {
    orderNumber: orderResponse?.createOrderData?.data?.order_number,
    orderType: orderResponse?.createOrderData?.data?.order_type,
    orderId: orderResponse?.createOrderData?.id,
    products: orderData?.items,
    paymentMethod: orderData?.checkout,
    total: orderData?.totals
  }

  // SUCCESS
  return { success: true, data: filterOrderResponse };
}

// Review actions
export async function createReview(formData) {
  const reviewData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  return await postData({
    endpoint: '/api/reviews',
    data: reviewData,
    tag: ['reviews'],
    revalidatePaths: ['/reviews', '/admin/reviews']
  });
}
// Client actions
export async function createClient(formData) {
  const clientData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    image: formData.get('image'),
    url: formData.get('url')
  };

  return await postData({
    endpoint: '/api/clients',
    data: clientData,
    tag: ['clients'],
    revalidatePaths: ['/admin/clients'],
    requireAuth: true
  });
}
export async function loginUser(data) {
  try {
    const userData = {
      phone: data.phone,
      password: data.password
    };

    const response = await fetch(`${backUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const billzRes = await fetch(`${backUrl}/api/billz/v1/client?phone_number=${data.phone}`);
    if (!response.ok && !billzRes.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }
    const billzResData = await billzRes.json();
    const result = await response.json();
    console.log("Login result:", result);
    console.log("Billz client data:", billzResData);
    if (billzResData?.clients?.length > 0) {

      const sessionPayload = {
        token: result.token,
        user: billzResData.clients[0],
      };

      if (result.token) {
        cookies().set('user-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60, // 7 kun
          path: '/'
        });
      }
      revalidateTag('user');
      revalidatePath('/profile');

      return { success: true, data: sessionPayload };
    }

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
}
export async function registerUser(data) {
  try {
    const registerData = { ...data }
    console.log("Register data:", registerData);
    const haveUser = await fetch(`${backUrl}/api/billz/client?phone_number=${registerData.phone}`);
    const haveUserData = await haveUser.json().catch(() => ({}));
    console.log("Have user response:", haveUserData);
    if (haveUserData?.clients?.length > 0) {
      return { success: false, error: 'Пользователь с таким номером уже существует' };
    } else {
      const response = await fetch(`${backUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          phone: registerData.phone,
          password: registerData.password,
        }),
      });
      const billzRes = await fetch(`${backUrl}/api/billz/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          phone_number: registerData.phone,
          date_of_birth: registerData.date_of_birth,
          gender: registerData.gender
        }),
      });
      const billzResData = await billzRes.json();
      const responseData = await response.json();

      console.log("Register response:", responseData);
      console.log("Client creation response:", billzResData);
      if (!response.ok && !billzResData.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Login failed');
      }
      revalidatePath('/login');
      return { success: true, data: responseData, billzData: billzResData };
    }

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
}

