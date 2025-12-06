'use server';

import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { revalidatePath } from "next/cache";
import { createProfileAddress, updateProfile } from "@/lib/api/profile";

const parseSessionToken = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE)?.value;
  if (!raw) return null;

  try {
    const payload = JSON.parse(decodeURIComponent(raw));
    return payload?.token || null;
  } catch (error) {
    return null;
  }
};

export async function syncAddressWithBillz(address) {
  const token = await parseSessionToken();
  if (!token) {
    return { success: false, error: "AUTH_REQUIRED" };
  }

  try {
    await createProfileAddress(token, {
      label: address.label,
      full_address: address.fullAddress,
      latitude: address.latitude,
      longitude: address.longitude,
      is_default: Boolean(address.isDefault),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to sync address with Billz", error);
    const message =
      error?.details?.error?.message ||
      error?.message ||
      "Не удалось синхронизировать адрес.";
    return { success: false, error: message };
  }
}

export async function updateProfileDetails(formData) {
  const token = await parseSessionToken();
  if (!token) {
    return { success: false, error: "AUTH_REQUIRED" };
  }

  const payload = {
    first_name: formData?.first_name?.trim() || "",
    last_name: formData?.last_name?.trim() || "",
    display_name: formData?.display_name?.trim() || "",
    email: formData?.email?.trim() || "",
    phone_number: formData?.phone_number?.trim() || "",
  };

  try {
    await updateProfile(token, payload);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile", error);
    const message =
      error?.details?.error?.message ||
      error?.message ||
      "Не удалось сохранить изменения профиля.";
    return { success: false, error: message };
  }
}
