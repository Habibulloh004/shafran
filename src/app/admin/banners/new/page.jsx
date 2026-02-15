"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BannerForm from "@/components/admin/BannerForm";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";

export default function NewBannerPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      toast.success(t("admin.bannerAdded"));
      router.refresh();
      setTimeout(() => router.push("/admin/banners"), 1500);
    } catch (error) {
      console.error(t("admin.bannerAddError"), error);
      toast.error(t("admin.bannerAddError") + " " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/banners">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("common.back")}
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t("admin.newBanner")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("admin.addNewBannerDesc")}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <BannerForm
          banner={null}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/banners")}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
