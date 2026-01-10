'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Users, 
  Settings, 
  User, 
  Menu, 
  X,
  Bell,
  TrendingUp,
  BookOpen,
  MapPin
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  dropdown?: boolean;
  submenus?: { label: string; href: string }[];
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Tableau de bord");
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const router = useRouter();

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Tableau de bord", active: true, href: "" },
    { icon: <Map size={20} />, label: 'Gestion des CRASC', href: "/admin/gestion-des-crasc" },
    {
      icon: <FileText size={20} />,
      label: 'Documents',
      dropdown: true,
      submenus: [
        { label: 'Documentation', href: '/ressources/documentation' },
        { label: "Offres d'emploi", href: '/admin/espace-collaboratif/offres-emploi' },
      ],
    },
    //{ icon: <GraduationCap size={20} />, label: 'Quisque faucibus' },
    //{ icon: <Calendar size={20} />, label: 'Sem placerat' },
    //{ icon: <Users size={20} />, label: 'Adipiscing' },
    //{ icon: <User size={20} />, label: 'Pulvinar' },
    //{ icon: <Settings size={20} />, label: 'Settings' },
  ];

  const stats = [
    { label: 'Nombre de CRASC', value: '5', icon: <Map size={24} />, trend: '+12%' },
    { label: 'Nombre de OSC', value: '3176', icon: <GraduationCap size={24} />, trend: '+3' },
    //{ label: 'CRASC Zones', value: '5', icon: <MapPin size={24} />, trend: 'Complete' },
    { label: "Offres d'emploi postées", value: '7', icon: <BookOpen size={24} />, trend: '+24' },
  ];

  const recentActivities = [
    { title: 'CRASC Nord mis à jour', time: '2 hours ago', type: 'program' },
    { title: 'ONG Femmes Soutra crée', time: '5 hours ago', type: 'update' },
  ];

  return (
    <div className="flex h-screen bg-cyan-50/50 font-poppins">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-4xl text-[#2a591d] font-extrabold font-karla">PASCI</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            if (item.dropdown && item.submenus) {
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setDocumentsDropdownOpen((open) => !open)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      activeItem === item.label
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <svg className={`ml-auto transition-transform ${documentsDropdownOpen ? 'rotate-180' : ''}`} width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {documentsDropdownOpen && (
                    <div className="ml-8 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg absolute left-0 w-48 z-10">
                      {item.submenus.map((submenu) => (
                        <Link
                          key={submenu.label}
                          href={submenu.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded-lg cursor-pointer"
                          onClick={() => {
                            setActiveItem(item.label);
                            setSidebarOpen(false);
                            setDocumentsDropdownOpen(false);
                          }}
                        >
                          {submenu.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveItem(item.label);
                  router.push(item.href || "");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeItem === item.label
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>

          <h1 className="font-semibold text-xl text-gray-800">Tableau de bord</h1>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#2a591d] rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-[#2a591d] rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
{/*           <div className="mb-8">
            <h2 className="text-gray-800 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Here's what's happening with your CRASC community today.</p>
          </div> */}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg text-[#2a591d]">
                    {stat.icon}
                  </div>
{/*                   <span className="text-green-600 text-sm flex items-center gap-1">
                    <TrendingUp size={16} />
                    {stat.trend}
                  </span> */}
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Additional Section */}
          <div className="my-6 bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-gray-800 mb-4">Aperçu des CRASC</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[{name:"CRASC Sud", count: "1160"}, {name: 'CRASC Ouest', count: "877"}, {name: 'CRASC Nord', count: "394"}, {name: 'CRASC Est', count: "188"}, {name: 'CRASC Centre', count: "557"}].map((region) => (
                <div key={region.name} className="p-4 border border-gray-200 rounded-lg hover:border-[#2a591d] cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-800">{region.name}</p>
                  </div>
                  <p className="text-gray-600 text-sm">Nombre de OSC: {region.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activités récentes */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-gray-800 mb-4">Activités récentes</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-[#2a591d] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.title}</p>
                      <p className="text-gray-500 text-sm">par administrateur</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-gray-800 mb-4">Actions rapides</h3>
              <div className="flex flex-col space-y-3 items-center text-center">
                <Link href="/admin/gestion-des-crasc/osc/ajouter-osc" className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Ajouter une OSC
                </Link>
                <Link href="#" className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Poster une offre d'emploi
                </Link>
                {/* <Link href="" className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Lorem ipsum
                </Link>
                <Link href="" className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Dolor sit amet
                </Link> */}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
