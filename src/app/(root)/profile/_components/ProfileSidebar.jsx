'use client';

import React, { useState } from 'react';
import { User, Package, MapPin, Gift, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';
import ExitModal from './ExitModal';
import { useRouter } from 'next/navigation';

export default function ProfileSidebar({activeTab}) {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'bonus', label: 'Bonus', icon: Gift },
  ];

  const handleExit = () => {
    setIsExitModalOpen(true);
  };

  const confirmExit = () => {
    // Add your logout logic here
    console.log('User logged out');
    setIsExitModalOpen(false);
    // Example: router.push('/login')
    // or signOut() from next-auth
  };

  const router = useRouter()

  return (
    <>
      <aside className="w-auto lg:w-64 md:p-4">
        <h1 className='px-3 py-2 max-md:hidden'>Привет Азиз</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => router.push(`/profile?tab=${item.id}`)}
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
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={confirmExit}
      />
    </>
  );
}
