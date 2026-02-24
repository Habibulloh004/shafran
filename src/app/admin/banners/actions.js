"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL = (
  process.env.BASE_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:8082"
).replace(/\/+$/, "");

const jsonHeaders = { Accept: "application/json" };

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}

export async function fetchBannersAction() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/banner/`, {
      method: "GET",
      headers: jsonHeaders,
      cache: "no-store",
    });

    const payload = await parseResponse(response);
    if (!response.ok) {
      return {
        success: false,
        error: payload?.error || `HTTP ${response.status}`,
        data: [],
      };
    }

    return { success: true, data: payload?.data || payload || [] };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function fetchBannerByIdAction(id) {
  const list = await fetchBannersAction();
  if (!list.success) {
    return { success: false, error: list.error, data: null };
  }

  const banner = list.data.find((item) => String(item.id) === String(id));
  if (!banner) {
    return { success: false, error: "Banner not found", data: null };
  }

  return { success: true, data: banner };
}

export async function createBannerAction(formData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/banner/`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    const payload = await parseResponse(response);
    if (!response.ok) {
      return {
        success: false,
        error: payload?.error || `HTTP ${response.status}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true, data: payload };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateBannerAction(id, formData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/banner/${id}`, {
      method: "PUT",
      body: formData,
      cache: "no-store",
    });

    const payload = await parseResponse(response);
    if (!response.ok) {
      return {
        success: false,
        error: payload?.error || `HTTP ${response.status}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/banners");
    revalidatePath(`/admin/banners/${id}/edit`);
    return { success: true, data: payload };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteBannerAction(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/banner/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    const payload = await parseResponse(response);
    if (!response.ok) {
      return {
        success: false,
        error: payload?.error || `HTTP ${response.status}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true, data: payload };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
