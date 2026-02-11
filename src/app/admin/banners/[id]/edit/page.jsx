"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BannerForm from "@/components/admin/BannerForm";
import { getData } from "../../../../../../actions/get";
import { putData } from "../../../../../../actions/post";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";

export default function EditBannerPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id;

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getData({
          endpoint: "/api/banner/",
          tag: "banners",
          revalidate: 0,
        });
        const banners = data?.data || data || [];
        const found = banners.find((b) => b.id === bannerId);
        if (found) {
          setBanner(found);
        } else {
          toast.error(t("admin.bannerNotFound"));
        }
      } catch (error) {
        console.error(t("admin.bannerLoadError"), error);
        toast.error(t("admin.bannerLoadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, [bannerId]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const result = await putData({
        endpoint: `/api/banner/${bannerId}`,
        data: formData,
        revalidateTags: ["banners"],
        revalidatePaths: ["/", "/admin/banners"],
      });

      if (result.success) {
        toast.success(t("admin.bannerUpdated"));
        setTimeout(() => router.push("/admin/banners"), 1500);
      } else {
        toast.error(t("admin.bannerUpdateError") + " " + result.error);
      }
    } catch (error) {
      console.error(t("admin.bannerUpdateError"), error);
      toast.error(t("errors.networkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!banner && !loading) {
    return (
      <div className="space-y-6">
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
        </div>
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("admin.bannerNotFound")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("admin.bannerNotFoundDesc")}
          </p>
          <Button asChild>
            <Link href="/admin/banners">{t("admin.returnToBannerList")}</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            {t("admin.editBanner")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {banner?.title || "Banner"}{t("admin.changeBanner")}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <BannerForm
          banner={banner}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/banners")}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
