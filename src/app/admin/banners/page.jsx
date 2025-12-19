"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import BannerForm from "@/components/admin/BannerForm";
import { getData } from "../../../../actions/get";
import { postData, putData, deleteData } from "../../../../actions/post";

const FALLBACK_IMAGE = "/background/creed.webp";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bannerlarni yuklash - Server Action orqali
  const fetchBanners = async () => {
    try {
      const data = await getData({
        endpoint: "/api/banner/",
        tag: "banners",
        revalidate: 0
      });
      console.log("Bannerlar yuklandi:", data);
      setBanners(data?.data || data || []);
    } catch (error) {
      console.error("Bannerlarni yuklashda xatolik:", error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Yangi banner qo'shish
  const handleCreate = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  // Bannerni tahrirlash
  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  // Bannerni o'chirish uchun dialog ochish
  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  // Banner formani saqlash
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      if (selectedBanner) {
        // Tahrirlash - Server Action orqali
        const result = await putData({
          endpoint: `/api/banner/${selectedBanner.id}`,
          data: formData,
          revalidateTags: ["banners"],
          revalidatePaths: ["/", "/admin/banners"],
        });

        if (result.success) {
          console.log("Banner yangilandi:", result.data);
          await fetchBanners();
        } else {
          console.error("Banner yangilashda xatolik:", result.error);
          alert("Banner yangilashda xatolik yuz berdi: " + result.error);
        }
      } else {
        // Yangi qo'shish - Server Action orqali
        const result = await postData({
          endpoint: "/api/banner/",
          data: formData,
          revalidateTags: ["banners"],
          revalidatePaths: ["/", "/admin/banners"],
        });

        if (result.success) {
          console.log("Yangi banner qo'shildi:", result.data);
          await fetchBanners();
        } else {
          console.error("Banner qo'shishda xatolik:", result.error);
          alert("Banner qo'shishda xatolik yuz berdi: " + result.error);
        }
      }

      setIsFormOpen(false);
      setSelectedBanner(null);
    } catch (error) {
      console.error("Bannerni saqlashda xatolik:", error);
      alert("Tarmoq xatoligi yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bannerni o'chirish
  const handleDelete = async () => {
    if (!selectedBanner) return;

    try {
      const result = await deleteData({
        endpoint: `/api/banner/${selectedBanner.id}`,
        revalidateTags: ["banners"],
        revalidatePaths: ["/", "/admin/banners"],
      });

      if (result.success) {
        console.log("Banner o'chirildi");
        await fetchBanners();
      } else {
        console.error("Banner o'chirishda xatolik:", result.error);
        alert("Banner o'chirishda xatolik yuz berdi: " + result.error);
      }
    } catch (error) {
      console.error("Bannerni o'chirishda xatolik:", error);
      alert("Tarmoq xatoligi yuz berdi");
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
          <h2 className="text-xl font-semibold text-foreground">Bannerlar</h2>
          <p className="text-sm text-muted-foreground">
            Bosh sahifadagi carousel bannerlarni boshqaring
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi banner
        </Button>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Banner yo'q</h3>
          <p className="text-muted-foreground mb-4">
            Hali hech qanday banner qo'shilmagan
          </p>
          <Button onClick={handleCreate}>
            Birinchi bannerni qo'shish
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
                  src={banner.image_light || banner.image_dark || FALLBACK_IMAGE}
                  alt={banner.title || "Banner"}
                  fill
                  className="object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(banner)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(banner)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-foreground truncate">
                  {banner.title || "Nomsiz banner"}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? "Bannerni tahrirlash" : "Yangi banner"}
            </DialogTitle>
          </DialogHeader>
          <BannerForm
            banner={selectedBanner}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bannerni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedBanner?.title || "Bu banner"}" ni o'chirishni xohlaysizmi?
              Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
