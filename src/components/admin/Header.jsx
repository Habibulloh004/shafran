"use client";

import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { useTranslation } from "@/i18n";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function Header({ onMenuClick, title }) {
  const router = useRouter();
  const { t } = useTranslation();
  const logout = useAdminStore((state) => state.logout);
  const admin = useAdminStore((state) => state.admin);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-accent text-foreground"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title */}
        <h1 className="text-lg font-semibold text-foreground">
          {title || t("admin.dashboard")}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Language switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Theme toggle */}
        <ModeToggle />

        {/* Admin info */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span>{admin?.username || "Admin"}</span>
        </div>

        {/* Logout button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">{t("common.logout")}</span>
        </Button>
      </div>
    </header>
  );
}
