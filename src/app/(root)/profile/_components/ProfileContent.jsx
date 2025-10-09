'use client';

import React, { useMemo } from 'react';
import ProfileInfoSection from './ProfileInfoSection';
import OrdersSection from './OrdersSection';
import AddressesSection from './AddressesSection';
import BonusSection from './BonusSection';

// Content sections mapping
const CONTENT_SECTIONS = {
  profile: ProfileInfoSection,
  orders: OrdersSection,
  addresses: AddressesSection,
  bonus: BonusSection,
};

export default function ProfileContent({ activeTab }) {
  // Get the appropriate content component based on active tab
  const ContentComponent = useMemo(() => {
    return CONTENT_SECTIONS[activeTab] || null;
  }, [activeTab]);

  // If no valid tab is selected, return null
  if (!ContentComponent) {
    return null;
  }

  return (
    <main className="flex-1 p-2 sm:p-4 md:p-6 min-w-0">
      <ContentComponent />
    </main>
  );
}