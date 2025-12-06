
import { apiGet } from "./client";

export async function getCategories(params) {
  return apiGet("/api/billz/v2/category", {
    params,
    revalidate: 600,
    tags: ["categories"],
  });
}

const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const findCategoryById = (payload, id) => {
  if (!payload) return null;
  const normalizedId = String(id);
  const visited = new Set();

  const visitNode = (node) => {
    if (!node || visited.has(node)) return null;
    visited.add(node);

    if (String(node.id) === normalizedId) {
      return node;
    }

    const childCollections = [
      asArray(node.subRows),
      asArray(node.children),
      asArray(node.data),
      asArray(node.categories),
      asArray(node.items),
    ];

    for (const collection of childCollections) {
      for (const child of collection) {
        const found = visitNode(child);
        if (found) return found;
      }
    }

    return null;
  };

  const searchCollection = (collection) => {
    for (const item of collection) {
      const found = visitNode(item);
      if (found) {
        return found;
      }
    }
    return null;
  };

  if (Array.isArray(payload)) {
    return searchCollection(payload);
  }

  if (Array.isArray(payload?.categories)) {
    return searchCollection(payload.categories);
  }

  if (Array.isArray(payload?.data)) {
    return searchCollection(payload.data);
  }

  if (payload?.data && typeof payload.data === "object") {
    return visitNode(payload.data);
  }

  if (typeof payload === "object") {
    return visitNode(payload);
  }

  return null;
};

export async function getCategoryDetail(id, params) {
  const detailParams = {
    ...(params || {}),
    revalidate: 900,
    tags: [`category:${id}`],
  };

  const attemptChain = [
    () => apiGet(`/api/billz/v2/category/${id}`, detailParams),
    () =>
      apiGet("/api/billz/v2/category", {
        params: {
          ...(params || {}),
          category_id: id,
          id,
        },
        revalidate: 900,
        tags: [`category:${id}`],
      }),
    () => apiGet(`/api/categories/${id}`, detailParams),
  ];

  let lastNotFoundError = null;

  for (const attempt of attemptChain) {
    try {
      const response = await attempt();
      const detail = findCategoryById(response, id);
      if (detail) {
        return detail;
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

export async function getBrands(params) {
  return apiGet("/api/billz/v2/brands", {
    params,
    revalidate: 1800,
    tags: ["brands"],
  });
}

export async function getFragranceNotes(params) {
  return apiGet("/api/billz/v2/fragrance-notes", {
    params,
    revalidate: 1800,
    tags: ["fragrance-notes"],
  });
}

export async function getSeasons(params) {
  return apiGet("/api/billz/v2/seasons", {
    params,
    revalidate: 1800,
    tags: ["seasons"],
  });
}

export async function getProductTypes(params) {
  return apiGet("/api/billz/v2/product-types", {
    params,
    revalidate: 1800,
    tags: ["product-types"],
  });
}
