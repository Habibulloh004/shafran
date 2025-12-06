import { apiGet } from "./client";

export async function getBanners() {
  return apiGet("/api/banner", {
    revalidate: 1800,
    tags: ["banners"],
  });
}

export async function getPickupBranches() {
  return apiGet("/api/pickup-branches", {
    revalidate: 1800,
    tags: ["pickup-branches"],
  });
}

export async function getPaymentProviders() {
  return apiGet("/api/payment-providers", {
    revalidate: 1800,
    tags: ["payment-providers"],
  });
}
