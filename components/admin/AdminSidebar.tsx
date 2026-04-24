"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  Settings,
  X,
  BookOpen,
  MessageSquare,
  Megaphone,
  ClipboardList,
  Heart,
  Phone,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  dropdown?: boolean;
  submenus?: { label: string; href: string }[];
}

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Tableau de bord",
      href: "/admin",
    },
    { icon: <Users size={20} />, label: "Utilisateurs", href: "/admin/utilisateurs" },
    {
      icon: <Map size={20} />,
      label: "Gestion des CRASC",
      href: "/admin/gestion-des-crasc",
    },
    {
      icon: <FileText size={20} />,
      label: "Organisations",
      dropdown: true,
      submenus: [
        { label: "PTF", href: "/admin/ptf" },
        { label: "OSC", href: "/admin/gestion-des-crasc/osc" },
      ],
    },
    {
      icon: <BookOpen size={20} />,
      label: "Contenu",
      dropdown: true,
      submenus: [
        { label: "Formations", href: "/admin/formations" },
        { label: "Offres de Projets", href: "/admin/projets" },
        { label: "Offres d'emploi", href: "/admin/emplois" },
        { label: "Actualités", href: "/admin/actualites" },
      { label: "Bande défilante", href: "/admin/annonces" },
      { label: "Slider accueil", href: "/admin/hero-slides" },
      ],
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Forum",
      dropdown: true,
      submenus: [
        { label: "Pôles de concertation", href: "/admin/forum/poles" },
      ],
    },
    {
      icon: <FileText size={20} />,
      label: "Ressources",
      href: "/admin/ressources",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Demandes d'adhésion",
      href: "/admin/demandes-adhesion",
    },
    { icon: <Heart size={20} />, label: "Dons", href: "/admin/dons" },
    { icon: <Users size={20} />, label: "Volontaires", href: "/admin/volontaires" },
    { icon: <Phone size={20} />, label: "Numéros utiles", href: "/admin/numeros-utiles" },
    {
      icon: <Settings size={20} />,
      label: "Paramètres",
      href: "/admin/settings",
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-4xl text-[#2a591d] font-extrabold font-karla">
            PASCI
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {navItems.map((item) => {
          const isDropdownOpen = openDropdowns.includes(item.label);
          const isActive = item.href && isActiveLink(item.href);

          if (item.dropdown && item.submenus) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    setOpenDropdowns((prev) =>
                      prev.includes(item.label)
                        ? prev.filter((label) => label !== item.label)
                        : [...prev, item.label]
                    );
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                  <svg
                    className={`ml-auto transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenus.map((submenu) => {
                      const isSubmenuActive = isActiveLink(submenu.href);
                      return (
                        <Link
                          key={submenu.label}
                          href={submenu.href}
                          className={`block px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                            isSubmenuActive
                              ? "text-green-700 bg-green-50 font-semibold"
                              : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {submenu.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href || "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700 hover:bg-green-100 hover:text-green-700"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
