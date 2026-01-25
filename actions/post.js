"use server";

import { AUTH_COOKIE } from '@/lib/auth/constants';
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
  try {
    // Server action ichida to'liq URL kerak
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || 'http://localhost:3000';

    const cookieStore = await cookies();
    const requestCookies = cookieStore.getAll();
    const cookieHeader = requestCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    const headers = {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    };

    const response = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: data.items,
        checkout: data.checkout,
        totals: data.totals,
        user: data.user,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: payload?.error || "Не удалось оформить заказ",
      };
    }

    return {
      success: payload?.success ?? true,
      data: payload?.data ?? payload,
    };
  } catch (error) {
    console.error("createOrder error:", error);
    return {
      success: false,
      error: error?.message || "Не удалось оформить заказ",
    };
  }
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

    // 1. Backend'dan login
    const response = await fetch(`${backUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }

    const result = await response.json();
    console.log("Login result:", result);

    if (!result.token) {
      throw new Error('Token not received');
    }

    // 2. Billz'dan client ma'lumotlarini olish
    let billzClient = null;
    try {
      const billzRes = await fetch(`${backUrl}/api/billz/v1/client?phone_number=${data.phone}`);
      if (billzRes.ok) {
        const billzResData = await billzRes.json();
        console.log("Billz client data:", billzResData);
        if (billzResData?.clients?.length > 0) {
          billzClient = billzResData.clients[0];
        }
      }
    } catch (billzErr) {
      console.warn("Billz client fetch failed:", billzErr);
    }

    // 3. Session payload yaratish
    const sessionPayload = {
      token: result.token,
      user: {
        ...(billzClient || {}),
        user_id: result.user?.id,
        id: billzClient?.id || result.user?.id,
      },
    };

    // 4. Cookie o'rnatish
    const cookiePayload = {
      ...sessionPayload,
      phone_number: billzClient?.phone_number || billzClient?.phone || data.phone,
      issued_at: new Date().toISOString(),
    };

    const cookieStore = await cookies();
    cookieStore.set({
      name: AUTH_COOKIE,
      value: encodeURIComponent(JSON.stringify(cookiePayload)),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    revalidateTag('user');
    revalidatePath('/profile');

    return { success: true, data: sessionPayload };
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

// Universal PUT action
export async function putData({
  endpoint,
  data,
  tag,
  revalidateTags,
  revalidatePaths,
}) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${backUrl}${endpoint}`, {
      method: "PUT",
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

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to put data:", error);
    return { success: false, error: error.message };
  }
}

// Universal DELETE action
export async function deleteData({
  endpoint,
  tag,
  revalidateTags,
  revalidatePaths,
}) {
  try {
    const response = await fetch(`${backUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

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

    return { success: true };
  } catch (error) {
    console.error("Failed to delete data:", error);
    return { success: false, error: error.message };
  }
}
