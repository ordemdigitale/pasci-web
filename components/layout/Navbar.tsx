"use client";

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from "next/navigation";
import { Url } from "next/dist/shared/lib/router/router";
import { Search, Menu, X, UserCircle, LogOut, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
} from '../ui/dropdown-menu'
import { getStoredUser, authService } from '@/lib/auth'
import { IUser } from '@/types/api.types'

const NavLinks = [
  { href: "/", key: 1, text: "Accueil" },
  { href: "/services", key: 2, text: "Services" },
  { href: "/formations", key: 3, text: "Formations" },
  { href: "/ressources", key: 4, text: "Ressources" },
  { href: "#", key: 5, text: "Espace collaboratif", hasDropdown: true },
  { href: "/a-propos", key: 6, text: "À propos" },
  { href: "/contact", key: 7, text: "Contact", hasDropdown: true },
];

  const espaceCollabSubmenu = {
    submenu1: {
      title: 'Pôle de concertation',
      href: "/espace-collaboratif/pole-concertation",
    },
    submenu2: {
      title: 'Offres d\'emploi',
      href: "/espace-collaboratif/offres-emploi",
    }
  };

  const contactSubmenu = [
    { title: 'Contact', href: '/contact' },
    { title: 'Faire un don', href: '/faire-un-don' },
    { title: 'Être volontaire', href: '/etre-volontaire' },
    { title: 'Numéros utiles', href: '/numeros-utiles' },
  ];

  

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEspaceCollabSubmenuOpen, setIsEspaceCollabSubmenuOpen] = useState(false);
  const [isContactSubmenuOpen, setIsContactSubmenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [annonces, setAnnonces] = useState<{ id: number; texte: string }[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: Url) => pathname === path;

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, [pathname]);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API_BASE}/api/v1/annonces?active_only=true`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (Array.isArray(data) && data.length > 0) setAnnonces(data); })
      .catch(() => {});
  }, []);

  function handleLogout() {
    authService.logout();
    setCurrentUser(null);
    router.push('/');
  }

  const displayName = currentUser
    ? (currentUser.username || `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email)
    : '';
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header>
      <nav className="py-4 border-b border-gray-200 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image src="/images/logo.png" alt="logo" width={90} height={96} />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NavLinks.map((link) => {
                if (link.hasDropdown) {
                  let submenuContent = null;
                  if (link.text === "Espace collaboratif") {
                    submenuContent = (
                      <DropdownMenuContent className="w-48">
                        <DropdownMenuSub>
                          <Link href={espaceCollabSubmenu.submenu1.href} className='block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm'>
                            <span>{espaceCollabSubmenu.submenu1.title}</span>
                          </Link>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <Link href={espaceCollabSubmenu.submenu2.href} className='block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm'>
                            <span>{espaceCollabSubmenu.submenu2.title}</span>
                          </Link>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    );
                  }
                  if (link.text === "Contact") {
                    submenuContent = (
                      <DropdownMenuContent className="w-44">
                        {contactSubmenu.map((item) => (
                          <DropdownMenuSub key={item.href}>
                            <Link href={item.href} className='block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm'>
                              {item.title}
                            </Link>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuContent>
                    );
                  }
                  return (
                    <DropdownMenu key={link.text}>
                      <DropdownMenuTrigger className="text-gray-700 hover:text-gray-900 text-sm tracking-wide transition-colors flex items-center gap-1 focus:outline-none">
                        {link.text}
                        <ChevronDown className='w-4 h-4'/>
                      </DropdownMenuTrigger>
                      {submenuContent}
                    </DropdownMenu>
                  );
                } else {
                  return (
                    <a
                      key={link.text}
                      href={link.href}
                      className={`${isActive(link.href) ? "text-[#E05017] border-[#E05017]" : "text-gray-700 hover:text-[#E05017] border-transparent hover:border-[#E05017]"} text-sm tracking-wide transition-colors border-b-2 pb-1`}
                    >
                      {link.text}
                    </a>
                  );
                }
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="cursor-pointer border-2 border-transparent hover:border-[#E05017] transition-colors">
                      <AvatarImage src={currentUser.avatar || ''} alt={displayName} />
                      <AvatarFallback className="bg-[#E05017] text-white text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{displayName}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profil" className="flex items-center cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Mon profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login" className='px-4 py-2 border border-transparent hover:border hover:border-[#E05017] rounded-3xl bg-[#E05017] hover:bg-transparent text-white hover:text-[#E05017] flex items-center gap-2'>
                  <UserCircle className="w-4 h-4" />
                  Connexion
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent w-full"
                  />
                </div>

                {/* Mobile Navigation Links */}
                {NavLinks.map((link) => (
                  link.hasDropdown ? (
                    <div key={link.text}>
                      <button
                        onClick={() => {
                          if (link.text === "Espace collaboratif") setIsEspaceCollabSubmenuOpen(!isEspaceCollabSubmenuOpen);
                          if (link.text === "Contact") setIsContactSubmenuOpen(!isContactSubmenuOpen);
                        }}
                        className="text-gray-700 hover:text-gray-900 text-sm tracking-wide transition-colors flex items-center gap-1 w-full"
                      >
                        {link.text}
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          (link.text === "Espace collaboratif" && isEspaceCollabSubmenuOpen) ||
                          (link.text === "Contact" && isContactSubmenuOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {link.text === "Espace collaboratif" && isEspaceCollabSubmenuOpen && (
                        <div className="ml-4 mt-2 space-y-2">
                          <Link href={espaceCollabSubmenu.submenu1.href} className="block text-sm text-gray-700">
                            {espaceCollabSubmenu.submenu1.title}
                          </Link>
                          <Link href={espaceCollabSubmenu.submenu2.href} className="block text-sm text-gray-700">
                            {espaceCollabSubmenu.submenu2.title}
                          </Link>
                        </div>
                      )}
                      {link.text === "Contact" && isContactSubmenuOpen && (
                        <div className="ml-4 mt-2 space-y-2">
                          {contactSubmenu.map((item) => (
                            <Link key={item.href} href={item.href} className="block text-sm text-gray-700">
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      key={link.text}
                      href={link.href}
                      className="text-gray-700 hover:text-gray-900 text-sm tracking-wide transition-colors"
                    >
                      {link.text}
                    </a>
                  )
                ))}

                {/* Mobile Actions */}
                <div className="pt-2 border-t border-gray-100">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-800">{displayName}</div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                      <Link href="/profil" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#E05017]">
                        <UserCircle className="w-4 h-4" /> Mon profil
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800">
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-3xl text-sm w-fit">
                      <UserCircle className="w-4 h-4" /> Connexion
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Ticker / Bande défilante */}
      {(() => {
        const baseItems = annonces.length > 0
          ? annonces.map((a) => a.texte)
          : [
              "Bienvenue sur la Plateforme PASCI — Portail d'Appui à la Société Civile en Côte d'Ivoire",
              "✦ Consulter les dernières formations disponibles dans votre région",
              "✦ Rejoindre le Pôle de concertation des OSC membres des CRASC",
              "✦ Nouvelles offres d'emploi disponibles — Consulter l'espace collaboratif",
            ];
        const repeat = Math.max(1, Math.ceil(8 / baseItems.length));
        const tickerItems = Array(repeat).fill(baseItems).flat();
        // ~8 caractères par pixel à 14px, 80px/s → durée proportionnelle au texte total
        const totalChars = tickerItems.reduce((s, t) => s + t.length + 20, 0); // +20 pour le padding
        const duration = Math.max(20, Math.round(totalChars * 0.12)); // ~0.12s par caractère
        return (
          <div className="bg-[#052838] text-white py-2 overflow-hidden font-poppins flex items-center">
            <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 shrink-0 z-10 mr-3 self-stretch flex items-center">
              ANNONCES
            </span>
            <div className="overflow-hidden flex-1">
              <div
                className="flex whitespace-nowrap"
                style={{ animation: `ticker ${duration}s linear infinite`, width: "max-content" }}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex whitespace-nowrap">
                    {tickerItems.map((texte, i) => (
                      <span key={i} className="text-sm text-gray-200 px-10">{texte}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </header>
  )
}