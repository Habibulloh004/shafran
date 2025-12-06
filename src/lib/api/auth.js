
import { apiGet, apiPost } from "./client";

const CLIENT_IDENTIFIER_KEYS = ["phone_number", "phone", "client_id", "middle_name"];

const isClientShape = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return CLIENT_IDENTIFIER_KEYS.some((key) => key in value);
};

export function extractClientFromResponse(payload) {
  if (!payload) {
    return null;
  }

  const visited = new WeakSet();

  const traverse = (node) => {
    if (!node || typeof node !== "object") {
      return null;
    }

    if (visited.has(node)) {
      return null;
    }

    visited.add(node);

    if (Array.isArray(node)) {
      for (const item of node) {
        const foundInItem = traverse(item);
        if (foundInItem) {
          return foundInItem;
        }
      }

      return null;
    }

    if (isClientShape(node)) {
      return node;
    }

    for (const value of Object.values(node)) {
      const foundInChild = traverse(value);
      if (foundInChild) {
        return foundInChild;
      }
    }

    return null;
  };

  if (Array.isArray(payload)) {
    return traverse(payload);
  }

  if (isClientShape(payload)) {
    return payload;
  }

  return traverse(payload);
}

export async function registerUser(payload) {
  return apiPost("/api/auth/register", {
    body: payload,
  });
}

export async function loginUser(payload) {
  return apiPost("/api/auth/login", {
    body: payload,
  });
}

export async function verifySmsCode(payload) {
  return apiPost("/api/auth/verify", {
    body: payload,
  });
}

export async function getClientByPhone(phoneNumber) {
  if (!phoneNumber) return null;

  const response = await apiGet("/api/billz/v1/client", {
    params: { phone_number: phoneNumber },
    cache: "no-store",
  });

  return extractClientFromResponse(response);
}
