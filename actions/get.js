"use server";

import { headers } from "next/headers";

const backUrl = process.env.BASE_URL || process.env.BACKEND_URL || "http://localhost:8080";

export async function getData({ endpoint, tag, revalidate }) {
  try {
    // Cache options obyektini yaratish
    const cacheOptions = {};

    // Agar revalidate berilgan bo'lsa
    if (revalidate !== undefined) {
      if (revalidate === false) {
        cacheOptions.cache = 'force-cache'; // Doimiy cache
      } else if (revalidate === 0) {
        cacheOptions.cache = 'no-store'; // Cache qilmaslik
      } else if (typeof revalidate === 'number' && revalidate > 0) {
        cacheOptions.next = { revalidate }; // Time-based revalidation
      }
    }

    // Agar tag berilgan bo'lsa
    if (tag) {
      if (!cacheOptions.next) {
        cacheOptions.next = {};
      }
      cacheOptions.next.tags = Array.isArray(tag) ? tag : [tag];
    }

    const response = await fetch(`${backUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      ...cacheOptions
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  try {
    const headersList = headers();
    const host = headersList.get("host");

    if (host) {
      const proto =
        headersList.get("x-forwarded-proto") ??
        (host.includes("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // headers() throws outside request lifecycle, fall back below
  }

  return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";
}

export async function getBasicData({ endpoint, tag, revalidate }) {
  try {
    const baseUrl = resolveApiBaseUrl();

    if (!baseUrl) {
      throw new Error("Missing base URL for getBasicData");
    }

    const isAbsoluteUrl = /^https?:\/\//.test(endpoint);
    const requestUrl = isAbsoluteUrl ? endpoint : `${baseUrl}${endpoint}`;

    const res = await fetch(requestUrl, {
      next: {
        revalidate: revalidate ?? 3600 * 12, // default 12 soat
        tags: tag ? [tag] : [],
      },
    });

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("getBasicData error:", err);
    return null;
  }
}
export async function getCurrencyData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_CURRENCY || "https://bct-admin-eight.vercel.app/api/currency"

    if (!baseUrl) {
      throw new Error("Missing base URL for getBasicData");
    }

    const res = await fetch(baseUrl, {
      next: {
        cache: "no-store"
      },
    });

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("getBasicData error:", err);
    return null;
  }
}


// Revalidate qilish uchun yordamchi funksiya
export async function revalidateData(tag) {
  const { revalidateTag } = await import('next/cache');

  if (Array.isArray(tag)) {
    tag.forEach(t => revalidateTag(t));
  } else {
    revalidateTag(tag);
  }
}

// Path-based revalidation uchun
export async function revalidatePath(path) {
  const { revalidatePath: nextRevalidatePath } = await import('next/cache');
  nextRevalidatePath(path);
}

// ============================================
// Billz API Server Actions (Backend proxy orqali)
// ============================================

// Backend URL - hardcoded chunki env variables serverda yuklanmayapti
const BACKEND_URL = "https://api.shafranselective.uz";

// Backend orqali Billz API ga so'rov yuborish
async function fetchBillz(endpoint, params = {}) {
  const url = new URL(`${BACKEND_URL}/api/billz${endpoint}`);

  // Query parametrlarini qo'shish
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });

  console.log(`[BILLZ via Backend] GET ${url.toString()}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(`[BILLZ via Backend] Error: ${response.status}`);
    throw new Error(`Billz API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Brandlarni olish
export async function getBillzBrands(params = {}) {
  try {
    const data = await fetchBillz("/v2/brand", {
      page: 1,
      limit: 100,
      ...params,
    });
    return data?.data || data?.brands || [];
  } catch (error) {
    console.error("getBillzBrands error:", error);
    return [];
  }
}

// Kategoriyalarni olish
export async function getBillzCategories(params = {}) {
  try {
    const data = await fetchBillz("/v2/category", {
      page: 1,
      limit: 100,
      is_deleted: false,
      ...params,
    });
    return data?.data || data?.categories || [];
  } catch (error) {
    console.error("getBillzCategories error:", error);
    return [];
  }
}

// Bitta kategoriyani olish (list ichidan topamiz)
export async function getBillzCategory(categoryId) {
  try {
    // Barcha kategoriyalarni olib, ichidan keraklisini topamiz
    const categories = await getBillzCategories({ limit: 100 });

    // Rekursiv qidirish funksiyasi
    const findCategory = (cats, id) => {
      for (const cat of cats) {
        if (String(cat.id) === String(id)) {
          return cat;
        }
        // subRows ichidan ham qidirish
        if (cat.subRows && cat.subRows.length > 0) {
          const found = findCategory(cat.subRows, id);
          if (found) return found;
        }
        // children ichidan ham qidirish
        if (cat.children && cat.children.length > 0) {
          const found = findCategory(cat.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return findCategory(categories, categoryId);
  } catch (error) {
    console.error("getBillzCategory error:", error);
    return null;
  }
}

// Productlarni olish (filter bilan)
export async function getBillzProducts(params = {}) {
  try {
    const data = await fetchBillz("/v2/products", {
      page: 1,
      limit: 24,
      ...params,
    });
    return {
      data: data?.data || data?.products || [],
      pagination: data?.pagination || data?.meta || null,
    };
  } catch (error) {
    console.error("getBillzProducts error:", error);
    return { data: [], pagination: null };
  }
}

// Bitta productni olish (list ichidan topamiz)
export async function getBillzProduct(productId) {
  try {
    // Barcha productlarni olib, ichidan keraklisini topamiz
    const data = await fetchBillz("/v2/products", {
      page: 1,
      limit: 100,
    });

    const products = data?.products || data?.data || [];
    const product = products.find(p => String(p.id) === String(productId));

    return product || null;
  } catch (error) {
    console.error("getBillzProduct error:", error);
    return null;
  }
}
