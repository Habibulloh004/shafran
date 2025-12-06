import { apiDelete, apiGet, apiPost, apiPut } from "./client";
 
export async function getProfile(token) {
  return apiGet("/api/profile", {
    token,
    cache: "no-store",
  });
}

export async function updateProfile(token, payload) {
  return apiPut("/api/profile", {
    token,
    body: payload,
  });
}

export async function getProfileOrders(token, params) {
  return apiGet("/api/profile/orders", {
    token,
    params,
    cache: "no-store",
  });
}

export async function getProfileAddresses(token) {
  return apiGet("/api/profile/addresses", {
    token,
    cache: "no-store",
  });
}

export async function createProfileAddress(token, payload) {
  return apiPost("/api/profile/addresses", {
    token,
    body: payload,
  });
}

export async function deleteProfileAddress(token, addressId) {
  return apiDelete(`/api/profile/addresses/${addressId}`, {
    token,
  });
}

export async function getBonusTransactions(token, params) {
  return apiGet("/api/profile/bonus", {
    token,
    params,
    cache: "no-store",
  });
}
