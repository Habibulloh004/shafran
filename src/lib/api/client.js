'use server';

const DEFAULT_REVALIDATE = 300;

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:8080";

// Billz API so'rovlari local Next.js proxy orqali yuboriladi
const getBaseUrl = (path) => {
  // /api/billz/* so'rovlari local serverga yuboriladi (proxy uchun)
  if (path.startsWith("/api/billz/")) {
    // Server-side da absolute URL kerak
    if (typeof window === "undefined") {
      return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    }
    // Client-side da relative URL ishlatiladi
    return "";
  }
  return baseUrl;
};

const normalizePath = (path) => path.replace(/\/\/+/g, "/").replace(":/", "://");

const buildUrl = (path, params) => {
  const effectiveBaseUrl = getBaseUrl(path);
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? new URL(path)
      : new URL(
          normalizePath(`${effectiveBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`)
        );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => url.searchParams.append(key, entry));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url;
};

const shouldSendJson = (body) =>
  body !== undefined &&
  body !== null &&
  !(body instanceof FormData) &&
  typeof body !== "string";

export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    params,
    body,
    headers = {},
    token,
    cache: cacheMode = "no-store",
    revalidate = DEFAULT_REVALIDATE,
    tags,
    signal,
  } = options;

  const isGet = method.toUpperCase() === "GET";
  const url = buildUrl(path, isGet ? params : undefined);

  const requestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
    signal,
  };

  if (token) {
    requestInit.headers.Authorization = `Bearer ${token}`;
  }

  if (isGet) {
    requestInit.cache = cacheMode;
    if (cacheMode === "no-store") {
      requestInit.next = {
        tags,
      };
    } else {
      requestInit.next = {
        revalidate,
        tags,
      };
    }
  } else {
    requestInit.cache = "no-store";
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }

    if (body instanceof FormData) {
      requestInit.body = body;
    } else if (body !== undefined && body !== null) {
      if (shouldSendJson(body)) {
        requestInit.headers["Content-Type"] = "application/json";
        requestInit.body = JSON.stringify(body);
      } else {
        requestInit.body = body;
      }
    }
  }

  const response = await fetch(url.toString(), requestInit);

  if (!response.ok) {
    let errorPayload;

    try {
      errorPayload = await response.json();
    } catch (error) {
      errorPayload = null;
    }

    const message =
      errorPayload?.error?.message ||
      errorPayload?.message ||
      response.statusText ||
      "Unexpected API error";

    throw new ApiError(message, response.status, errorPayload);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiGet(path, options = {}) {
  return apiFetch(path, { ...options, method: "GET" });
}

export async function apiPost(path, options = {}) {
  return apiFetch(path, { ...options, method: "POST" });
}

export async function apiPut(path, options = {}) {
  return apiFetch(path, { ...options, method: "PUT" });
}

export async function apiPatch(path, options = {}) {
  return apiFetch(path, { ...options, method: "PATCH" });
}

export async function apiDelete(path, options = {}) {
  return apiFetch(path, { ...options, method: "DELETE" });
}
