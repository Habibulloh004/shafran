"use client";

import { useTranslation } from "@/i18n";

export default function RelatedProductsTitle({ fallback }) {
  const { t } = useTranslation();
  return <>{fallback || t("common.similarProducts")}</>;
}
