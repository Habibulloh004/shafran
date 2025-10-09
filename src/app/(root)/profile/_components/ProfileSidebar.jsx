'use client';

import React, { useState, useCallback } from 'react';
import { User, Package, MapPin, Gift, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SidebarItem from './SidebarItem';
import ExitModal from './ExitModal';

// Menu items configuration
const MENU_ITEMS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'bonus', label: 'Bonus', icon: Gift },
];

export default function ProfileSidebar({ activeTab }) {
  const router = useRouter();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

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
    console.log('User logged out');
    setIsExitModalOpen(false);
    // Add your logout logic here
    // Example: router.push('/login')
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsExitModalOpen(false);
  }, []);

  return (
    <>
      <aside className="w-auto lg:w-64 md:p-4">
        <h1 className='px-3 py-2 max-md:hidden'>Привет Азиз</h1>
        
        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
            />
          ))}

          <div className="pt-4 mt-4 border-t border-[#E8EBF1] dark:border-[#E8EBF14D]">
            <SidebarItem
              icon={LogOut}
              label="Exit"
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