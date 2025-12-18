"use client";

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { Url } from "next/dist/shared/lib/router/router";
import { Search, Menu, X, User, UserCircle, LogOut, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'

const NavLinks = [
  { href: "/", key: 1, text: "Accueil" },
  { href: "/services", key: 2, text: "Services" },
  { href: "/formations", key: 3, text: "Formations" },
  { href: "#", key: 4, text: "Ressources", hasDropdown: true },
  { href: "#", key: 5, text: "Espace collaboratif", hasDropdown: true },
  { href: "/a-propos", key: 6, text: "À propos" },
  { href: "/contact", key: 7, text: "Contact" },
];

const ressourcesSubmenu = {
    submenu1: {
      title: 'Documentation',
      href: "/ressources/documentation",
      items: [
        { name: 'North Region', href: '#north' },
        { name: 'South Region', href: '#south' },
        { name: 'East Region', href: '#east' },
        { name: 'West Region', href: '#west' },
      ]
    },
    submenu2: {
      title: 'Fiche Informative',
      href: "/ressources/fiches-informatives",
      items: [
        { name: 'Community Centers', href: '#centers' },
        { name: 'Training Facilities', href: '#training' },
        { name: 'Support Services', href: '#support' },
        { name: 'Resources', href: '#resources' },
      ]
    }
  };

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

  

// Mock user data - replace with actual user data
const user = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: '/images/avatar.jpg', // Empty string will show fallback. Actually shows error.
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlacesOpen, setIsPlacesOpen] = useState(false);
  const [isRessourcesSubmenuOpen, setIsRessourcesSubmenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: Url) => pathname === path;

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
                  if (link.text === "Ressources") {
                    submenuContent = (
                      <DropdownMenuContent className="w-48">
                        <DropdownMenuSub>
                          <Link href={ressourcesSubmenu.submenu1.href} className='block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm'>
                            <span>{ressourcesSubmenu.submenu1.title}</span>
                          </Link>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <Link href={ressourcesSubmenu.submenu2.href} className='block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm'>
                            <span>{ressourcesSubmenu.submenu2.title}</span>
                          </Link>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    );
                  } else if (link.text === "Espace collaboratif") {
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
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent w-48"
                />
              </div>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="cursor-pointer border-2 border-transparent hover:border-[#ff8c42] transition-colors">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-[#ff8c42] text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                      onClick={() => setIsRessourcesSubmenuOpen(!isRessourcesSubmenuOpen)}
                      className="text-gray-700 hover:text-gray-900 text-sm tracking-wide transition-colors flex items-center gap-1 w-full"
                    >
                      {link.text}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isRessourcesSubmenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isRessourcesSubmenuOpen && (
                      <div className="ml-4">
                        <div>
                          <Link href={ressourcesSubmenu.submenu1.href}>
                            <span className="text-sm text-gray-900">{ressourcesSubmenu.submenu1.title}</span>
                          </Link>
                          
                        </div>
                        <div className="pt-2">
                          <Link href={ressourcesSubmenu.submenu2.href}>
                            <span className="text-sm text-gray-900">{ressourcesSubmenu.submenu2.title}</span>
                          </Link>
                          
                        </div>
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
                <div className="flex items-center space-x-4 pt-2">
                  {/* Mobile User Avatar */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar className="cursor-pointer border-2 border-transparent hover:border-[#ff8c42] transition-colors">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-[#ff8c42] text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}