"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";
import { deleteBannerAction, fetchBannersAction } from "./actions";

const FALLBACK_IMAGE = "/background/creed.webp";
const backendUrl = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8082"
).replace(/\/+$/, "");

function getBannerImage(banner) {
  const path = banner.image_uz || banner.image_ru || banner.image_en;
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${backendUrl}${normalizedPath}`;
}

export default function BannersPage() {
  const { t } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      const result = await fetchBannersAction();
      if (!result.success) {
        throw new Error(result.error || "Fetch banners failed");
      }
      setBanners(result.data || []);
    } catch (error) {
      console.error(t("admin.dataLoadError"), error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;

    try {
      const result = await deleteBannerAction(selectedBanner.id);

      if (result.success) {
        toast.success(t("admin.bannerDeleted"));
        await fetchBanners();
      } else {
        console.error(t("admin.bannerDeleteError"), result.error);
        toast.error(t("admin.bannerDeleteError") + " " + result.error);
      }
    } catch (error) {
      console.error(t("admin.dataLoadError"), error);
      toast.error(t("errors.networkError"));
    } finally {
      setIsDeleteOpen(false);
      setSelectedBanner(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t("admin.banners")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("admin.manageBanners")}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/banners/new">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("admin.newBanner")}
          </Link>
        </Button>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("admin.noBanners")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("admin.noBannersAdded")}
          </p>
          <Button asChild>
            <Link href="/admin/banners/new">
              {t("admin.addFirstBanner")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-card border border-border rounded-xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] bg-muted">
                <Image
                  src={getBannerImage(banner)}
                  alt={banner.title || "Banner"}
                  fill
                  className="object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/admin/banners/${banner.id}/edit`}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(banner)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-foreground truncate">
                  {banner.title || t("admin.unnamedBanner")}
                </h3>
                {banner.url && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {banner.url}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deleteBanner")}</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedBanner?.title || "Bu banner"}&quot; {t("admin.deleteBannerConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
