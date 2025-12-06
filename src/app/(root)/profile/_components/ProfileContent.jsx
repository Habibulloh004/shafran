'use client';

import React, { /* useEffect, */ useMemo } from 'react';
import ProfileInfoSection from './ProfileInfoSection';
import OrdersSection from './OrdersSection';
// TODO: Restore address feature when branches & delivery are enabled
// import AddressesSection from './AddressesSection';
import BonusSection from './BonusSection';
// import { useUserProfileStore } from '@/store/userProfileStore';
// import { adaptServerAddress } from '@/store/addressStore';

// Content sections mapping
const CONTENT_SECTIONS = {
  profile: ProfileInfoSection,
  orders: OrdersSection,
  // bonus: BonusSection,
  // TODO: Restore address feature when branches & delivery are enabled
  // addresses: AddressesSection,
};

export default function ProfileContent({
  activeTab,
  profile,
  orders = [],
  /* addresses = [], */
  bonus = { balance: 0, transactions: [] },
}) {
  // TODO: Restore address feature when branches & delivery are enabled
  // const setProfile = useUserProfileStore((state) => state.setProfile);
  // const normalizedAddresses = useMemo(() => {
  //   const rawList =
  //     (addresses && addresses.length > 0
  //       ? addresses
  //       : profile?.addresses) || [];
  //
  //   return rawList
  //     .map((entry) => adaptServerAddress(entry))
  //     .filter(Boolean);
  // }, [addresses, profile?.addresses]);
  //
  // useEffect(() => {
  //   if (!profile && normalizedAddresses.length === 0) {
  //     setProfile(null);
  //     return;
  //   }
  //
  //   setProfile({
  //     ...(profile || {}),
  //     addresses: normalizedAddresses,
  //   });
  // }, [profile, normalizedAddresses, setProfile]);

  // Get the appropriate content component based on active tab
  const ContentComponent = useMemo(() => {
    return CONTENT_SECTIONS[activeTab] || null;
  }, [activeTab]);

  // If no valid tab is selected, return null
  if (!ContentComponent) {
    return null;
  }

  const propsByTab = {
    profile: { profile },
    orders: { orders },
    bonus,
    // --- ADDRESS BACKUP START ---
    // addresses: { addresses: normalizedAddresses, profile },
    // --- ADDRESS BACKUP END ---
  };

  return (
    <main className="flex-1 p-2 sm:p-4 md:p-6 min-w-0">
      <ContentComponent {...(propsByTab[activeTab] || {})} />
    </main>
  );
}
