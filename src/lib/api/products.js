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

export async function getProducts(params) {
  const attemptChain = [
    () =>
      apiGet("/api/billz/v2/products", {
        params,
        revalidate: 300,
        tags: ["products"],
      }),
    () =>
      apiGet("/api/products", {
        params,
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
  const detailParams = {
    ...(params || {}),
    revalidate: 900,
    tags: [`product:${id}`],
  };

  const attemptChain = [
    () => apiGet(`/api/billz/v2/products/${id}`, detailParams),
    () =>
      apiGet("/api/billz/v2/products", {
        params: {
          ...(params || {}),
          product_id: id,
          id,
        },
        revalidate: 900,
        tags: [`product:${id}`],
      }),
    () => apiGet(`/api/products/${id}`, detailParams),
  ];

  let lastNotFoundError = null;

  for (const attempt of attemptChain) {
    try {
      const response = await attempt();
      const product = findProductById(response, id);
      if (product) {
        return product;
      }
    } catch (error) {
      if (error?.status === 404) {
        lastNotFoundError = error;
        continue;
      }

      if (error?.status && ![401, 402, 403].includes(error.status)) {
        throw error;
      }
    }
  }

  if (lastNotFoundError) {
    throw lastNotFoundError;
  }

  return null;
}
