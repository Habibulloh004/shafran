import { apiGet } from "./client";

const normalizeProductList = (response) => {
  if (!response) {
    return { data: [], pagination: null };
  }

  if (Array.isArray(response)) {
    return { data: response, pagination: null };
  }

  const data =
    response?.data ||
    response?.products ||
    response?.items ||
    [];

  const pagination =
    response?.pagination ||
    response?.meta ||
    null;

  return { data, pagination };
};

const findProductById = (payload, id) => {
  if (!payload) return null;
  const targetId = String(id);

  if (Array.isArray(payload)) {
    return payload.find((entry) => String(entry.id) === targetId) || null;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data.find((entry) => String(entry.id) === targetId) || null;
  }

  if (Array.isArray(payload?.products)) {
    return (
      payload.products.find((entry) => String(entry.id) === targetId) || null
    );
  }

  if (payload?.data && String(payload.data.id) === targetId) {
    return payload.data;
  }

  if (String(payload?.id) === targetId) {
    return payload;
  }

  return null;
};

export async function getProducts(params = {}) {
  // Billz API uchun default pagination
  const queryParams = {
    page: 1,
    limit: 24,
    ...params,
  };

  const attemptChain = [
    // Billz API - /v2/products (plural - to'g'ri endpoint)
    () =>
      apiGet("/api/billz/v2/products", {
        params: queryParams,
        revalidate: 300,
        tags: ["products"],
      }),
    // Backend API fallback
    () =>
      apiGet("/api/products", {
        params: queryParams,
        revalidate: 300,
        tags: ["products"],
      }),
  ];

  for (const attempt of attemptChain) {
    try {
      const response = await attempt();
      const normalized = normalizeProductList(response);
      if (normalized.data.length > 0 || normalized.pagination) {
        return normalized;
      }
    } catch (error) {
      if (error?.status === 404) {
        continue;
      }

      if (error?.status && ![401, 402, 403].includes(error.status)) {
        throw error;
      }
    }
  }

  return { data: [], pagination: null };
}

export async function getProductDetail(id, params) {
  // Birinchi navbatda barcha productlardan qidiramiz (chunki /v2/products/{id} ishlamaydi)
  const attemptChain = [
    // Billz API - barcha productlarni olib ichidan topish
    () =>
      apiGet("/api/billz/v2/products", {
        params: {
          page: 1,
          limit: 100,
          ...(params || {}),
        },
        revalidate: 900,
        tags: [`product:${id}`],
      }),
    // Backend API fallback
    () =>
      apiGet(`/api/products/${id}`, {
        ...(params || {}),
        revalidate: 900,
        tags: [`product:${id}`],
      }),
  ];

  for (const attempt of attemptChain) {
    try {
      const response = await attempt();
      const product = findProductById(response, id);
      if (product) {
        return product;
      }
    } catch (error) {
      if (error?.status === 404) {
        continue;
      }

      if (error?.status && ![401, 402, 403].includes(error.status)) {
        throw error;
      }
    }
  }

  return null;
}
