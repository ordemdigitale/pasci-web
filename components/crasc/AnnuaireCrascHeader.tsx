"use client"

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AnnuaireCrascHeader() {
  const pathname = usePathname();
  const router = useRouter();
  // default active tab based on pathname
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    switch (pathname) {
      case '/annuaire/annuaire-des-crasc/crasc-nord':
        setActiveTab(1);
        break;
      case '/annuaire/annuaire-des-crasc/crasc-sud':
        setActiveTab(2);
        break;
      case '/annuaire/annuaire-des-crasc/crasc-centre':
        setActiveTab(3);
        break;
      case '/annuaire/annuaire-des-crasc/crasc-ouest':
        setActiveTab(4);
        break;
      case '/annuaire/annuaire-des-crasc/crasc-est':
        setActiveTab(5);
        break;
    }
  }, [pathname])

  const handleTabClick = (tabId: number, tabHref: string) => {
    setActiveTab(tabId);
    router.push(tabHref);
  }
  const menuItems = [
    { id: 0, label: 'Tous les CRASC' },
    { id: 1, label: 'CRASC Nord', href: '/annuaire/annuaire-des-crasc/crasc-nord' },
    { id: 2, label: 'CRASC Sud', href: '/annuaire/annuaire-des-crasc/crasc-sud' },
    { id: 3, label: 'CRASC Centre', href: '/annuaire/annuaire-des-crasc/crasc-centre' },
    { id: 4, label: 'CRASC Ouest', href: '/annuaire/annuaire-des-crasc/crasc-ouest' },
    { id: 5, label: 'CRASC Est', href: '/annuaire/annuaire-des-crasc/crasc-est' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-[#2a591d] font-bold text-4xl text-center pb-[50px]">Annuaire des CRASC</p>
      {/* Tabs for navigation between CRASC regions */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {menuItems.map((menuItem) => (
          <button
            key={menuItem.id}
            onClick={() => handleTabClick(menuItem.id, menuItem.href || "/annuaire/annuaire-des-crasc")}
            className={`px-4 py-2 text-sm transition-colors cursor-pointer ${
              activeTab === menuItem.id
                ? 'border-b-2 border-b-[#E05017] text-[#E05017] font-semibold'
                : 'text-gray-700 hover:text-[#E05017]'
            }`}
          >
            {menuItem.label}
          </button>
        ))}
      </div>
    </div>
  )
}
