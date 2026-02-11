'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { User, Package, /* MapPin, */ Gift, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SidebarItem from './SidebarItem';
import ExitModal from './ExitModal';
import { useAuthStore, clearAuthCookie } from '@/store/authStore';
import { useTranslation } from "@/i18n";

// Menu items configuration
const MENU_ITEMS = [
  { id: 'profile', labelKey: 'profile.myProfile', icon: User },
  { id: 'orders', labelKey: 'profile.orders', icon: Package },
  // { id: 'bonus', labelKey: 'profile.bonus', icon: Gift },
  // TODO: Restore address feature when branches & delivery are enabled
  // { id: 'addresses', labelKey: 'profile.addresses', icon: MapPin },
];

export default function ProfileSidebar({ activeTab, profile }) {
  const router = useRouter();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { t } = useTranslation();

  const profileName = useMemo(() => {
    if (!profile) return t("common.guest");
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    if (profile.phone_numbers?.length) {
      return profile.phone_numbers[0];
    }
    return t("common.guest");
  }, [profile, t]);

  // Handle navigation to different tabs
  const handleTabChange = useCallback((tabId) => {
    router.push(`/profile?tab=${tabId}`);
  }, [router]);

  // Handle exit button click
  const handleExit = useCallback(() => {
    setIsExitModalOpen(true);
  }, []);

  // Handle exit confirmation
  const confirmExit = useCallback(() => {
    clearAuth();
    clearAuthCookie();
    setIsExitModalOpen(false);
    router.push("/login");
  }, [clearAuth, router]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsExitModalOpen(false);
  }, []);

  return (
    <>
      <aside className="w-auto lg:w-64 md:p-4">
        <h1 className='px-3 py-2 max-md:hidden'>{t("common.hello")} {profileName || t("common.guest")}</h1>

        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={t(item.labelKey)}
              isActive={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
            />
          ))}

          <div className="pt-4 mt-4 border-t border-[#E8EBF1] dark:border-[#E8EBF14D]">
            <SidebarItem
              icon={LogOut}
              label={t("profile.exit")}
              onClick={handleExit}
              isExit={true}
            />
          </div>
        </nav>
      </aside>

      <ExitModal
        isOpen={isExitModalOpen}
        onClose={handleModalClose}
        onConfirm={confirmExit}
      />
    </>
  );
}
