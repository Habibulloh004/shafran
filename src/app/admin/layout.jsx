"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { useTranslation } from "@/i18n";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const { t } = useTranslation();

  // Sahifa nomlari
  const pageTitles = {
    "/admin": t("admin.dashboard"),
    "/admin/banners": t("admin.banners"),
    "/admin/banners/new": t("admin.newBanner"),
    "/admin/users": t("admin.users"),
    "/admin/orders": t("admin.orders"),
    "/admin/footer": t("admin.footerSettings"),
    "/admin/settings": t("admin.settings"),
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Login sahifasida bo'lsa, tekshirmaslik
    if (pathname === "/admin/login") return;

    // Agar login qilinmagan bo'lsa, login sahifasiga yo'naltirish
    if (mounted && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, pathname, router, mounted]);

  // Login sahifasi uchun layout kerak emas
  if (pathname === "/admin/login") {
    return children;
  }

  // Yuklanish holatida
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Agar login qilinmagan bo'lsa
  if (!isAuthenticated) {
    return null;
  }

  const pageTitle =
    pageTitles[pathname] ||
    (pathname.endsWith("/edit") && pathname.includes("/banners/")
      ? t("admin.editBanner")
      : t("admin.adminPanel"));

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={pageTitle}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
