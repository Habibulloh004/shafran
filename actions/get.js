"use server";

import { headers } from "next/headers";

const backUrl = process.env.BASE_URL || process.env.BACKEND_URL || "http://localhost:8080";

export async function getData({
  endpoint,
  tag,
  revalidate,
  throwOnError = true,
  ignoreStatuses = [],
}) {
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
      if (ignoreStatuses.includes(response.status)) {
        return null;
      }

      if (!throwOnError) {
        return null;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    if (throwOnError) {
      throw error;
    }

    return null;
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

const BACKEND_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8082";

// Backend orqali Billz API ga so'rov yuborish
async function fetchBillz(endpoint, params = {}, { revalidate = 600 } = {}) {
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
    next: { revalidate },
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
    }, { revalidate: 3600 });
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
    }, { revalidate: 1800 });
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

// Kategoriya daraxtidan berilgan ID va uning barcha bolalar (descendant) ID larini yig'ish
function collectCategoryIds(categories, targetId) {
  const ids = new Set();

  // Rekursiv: targetId ni topib, uning barcha descendantlarini yig'ish
  const collectDescendants = (cats) => {
    for (const cat of cats) {
      ids.add(String(cat.id));
      const children = cat.subRows || cat.children || [];
      if (children.length > 0) {
        collectDescendants(children);
      }
    }
  };

  // Daraxtdan targetId ni topish
  const findAndCollect = (cats) => {
    for (const cat of cats) {
      if (String(cat.id) === String(targetId)) {
        // Topildi — o'zini va barcha bolalarini qo'shish
        ids.add(String(cat.id));
        const children = cat.subRows || cat.children || [];
        if (children.length > 0) {
          collectDescendants(children);
        }
        return true;
      }
      const children = cat.subRows || cat.children || [];
      if (children.length > 0) {
        if (findAndCollect(children)) return true;
      }
    }
    return false;
  };

  findAndCollect(categories);

  // Agar hech narsa topilmasa, faqat targetId ni qo'shish
  if (ids.size === 0) {
    ids.add(String(targetId));
  }

  return ids;
}

// Berilgan categoryId ning barcha ancestor (ota-ona) IDlarini yig'ish
function collectAncestorIds(categories, targetId) {
  const ancestors = [];

  const findPath = (cats, path) => {
    for (const cat of cats) {
      const currentPath = [...path, String(cat.id)];
      if (String(cat.id) === String(targetId)) {
        ancestors.push(...path); // targetId dan oldingi barcha IDlar
        return true;
      }
      const children = cat.subRows || cat.children || [];
      if (children.length > 0) {
        if (findPath(children, currentPath)) return true;
      }
    }
    return false;
  };

  findPath(categories, []);
  return new Set(ancestors);
}

// Productlarni olish (filter bilan)
export async function getBillzProducts(params = {}) {
  try {
    // category_id ni ajratib olish (Billz API buni qo'llab-quvvatlamaydi)
    const { category_id, ...billzParams } = params;

    // Barcha productlarni olish
    const data = await fetchBillz("/v2/products", {
      page: 1,
      limit: 200,
      ...billzParams,
    }, { revalidate: 600 });

    let products = data?.data || data?.products || [];

    // Agar category_id berilgan bo'lsa, client-side filter qilish
    if (category_id && products.length > 0) {
      try {
        const allCategories = await getBillzCategories({ limit: 100 });

        // Tanlangan kategoriya va uning barcha bolalari IDlari
        const matchIds = collectCategoryIds(allCategories, category_id);
        // Tanlangan kategoriyaning ota-onalari IDlari
        const ancestorIds = collectAncestorIds(allCategories, category_id);

        products = products.filter((product) => {
          const productCatIds = (product.categories || []).map((c) => String(c.id));
          if (productCatIds.length === 0) return false;

          // Product kategoriyasi tanlangan kategoriya yoki uning bolasi bo'lsa — mos
          if (productCatIds.some((id) => matchIds.has(id))) return true;

          // Product kategoriyasi tanlangan kategoriyaning ota-onasi bo'lsa — mos
          // (masalan, product "Parfyumeriya"ga biriktirilgan, lekin user "Erkak atir"ni tanlagan)
          if (productCatIds.some((id) => ancestorIds.has(id))) return true;

          return false;
        });
      } catch (filterError) {
        console.error("Category filter error, returning all products:", filterError);
      }
    }

    // Client-side pagination
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 24;
    const total = products.length;
    const offset = (page - 1) * limit;
    const paginatedProducts = products.slice(offset, offset + limit);

    return {
      data: paginatedProducts,
      pagination: {
        current_page: page,
        items_per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      },
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
    }, { revalidate: 600 });

    const products = data?.products || data?.data || [];
    const product = products.find(p => String(p.id) === String(productId));

    return product || null;
  } catch (error) {
    console.error("getBillzProduct error:", error);
    return null;
  }
}
