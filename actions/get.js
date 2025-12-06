"use server";

import { headers } from "next/headers";

const backUrl = process.env.BACKEND_URL;

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
