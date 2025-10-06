'use client';

import React from 'react';
import { useProfileStore } from '@/store/profileStore';

export default function ProfileContent({activeTab}) {

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information and preferences.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Profile content goes here</p>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View and track your order history.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Orders list goes here</p>
              </div>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Addresses</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your delivery addresses.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Addresses list goes here</p>
              </div>
            </div>
          </div>
        );
      case 'bonus':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bonus</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View your bonus points and rewards.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bonus information goes here</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6">
      {renderContent()}
    </main>
  );
}
