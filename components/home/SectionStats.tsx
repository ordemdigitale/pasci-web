"use client";

import { useState, useEffect } from "react";
import { Globe, MapPin, Users, Package, Landmark, LucideIcon, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from "@/components/ui/button"
import CustomBarChart from '../CustomBartChat';
import { IKeyStats } from "@/types/api.types";

const ICON_MAP: Record<string, LucideIcon> = {
  "osc": Users,
  "crasc": Landmark,
  "régions": MapPin,
  "projets": Package,
};

// Couleurs spécifiques pour chaque indicateur
const COLOR_MAP: Record<string, { bg: string; icon: string; border: string; gradient: string }> = {
  "osc": {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-600"
  },
  "crasc": {
    bg: "bg-[#E05017]/10",
    icon: "text-[#E05017]",
    border: "border-[#E05017]/30",
    gradient: "from-[#E05017] to-[#d04010]"
  },
  "régions": {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200",
    gradient: "from-green-500 to-green-600"
  },
  "projets": {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200",
    gradient: "from-purple-500 to-purple-600"
  },
};

export default function Stats() {
  const [keyStats, setKeyStats] = useState<IKeyStats[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch key stats data
  useEffect(() => {
    const fetchKeyStatsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/key-stats`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        setKeyStats(result);
        console.log("Key Stats ", keyStats);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKeyStatsData();
  }, []);

  // Data for "Répartition des OSC par zone CRASC" donut chart.
  // UTILISER BAR CHART
  const zoneData = [
    { name: 'CRASC NORD', value: 28, color: '#2F80F9' },
    { name: 'CRASC EST', value: 20, color: '#4CAE4F' },
    { name: 'CRASC CENTRE', value: 15, color: '#E57171' },
    { name: 'CRASC SUD', value: 21, color: '#FFB200' },
    { name: 'CRASC OUEST', value: 16, color: '#92BCFC' },
 //   { name: 'Gagnoa', value: 6, color: '#9B59B6' },
 //   { name: 'San-Pédro', value: 7, color: '#1ABC9C' },
 //   { name: 'Abengourou', value: 5, color: '#2ECC71' },
  ];

  // Data for "Types de communautés" bar chart
  const communityTypesData = [
    { name: 'Association', value: 9000 },
    { name: 'ONG', value: 4500 },
    { name: 'Fondation', value: 1800 },
    { name: 'Organisation cultuelle', value: 1200 },
  ];

  // Data for "Catégories d'organisations" donut chart
  // UTILISER BAR CHART
  const categoryData = [
    { name: 'Organisation Dirigée par les Jeunes', value: 43, color: '#4A90E2', u1: 'ODJ' },
    { name: 'Organisation Dirigée par les Femmes', value: 36, color: '#27AE60', u1: 'ODF' },
    { name: "Organisation Dirigée par Personnes en Situation de Handicap", value: 21, color: '#E74C3C', u1: 'OPSH' },
  ];
  // Define a list of colors for the bars
  const colors = ['#2F80F9', '#4CAE4F', '#E74C3C', '#FFB200', '#92BCFC'];

  // Mock data de fallback si l'API ne répond pas
  const mockStats: IKeyStats[] = [
    { id: "1", name: "osc", number: "850+" },
    { id: "2", name: "crasc", number: "5" },
    { id: "3", name: "régions", number: "33" },
    { id: "4", name: "projets", number: "120+" }
  ];

  // Utiliser les données de l'API si disponibles, sinon utiliser les données mock
  const displayStats = keyStats && keyStats.length > 0 ? keyStats : mockStats;

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-extrabold text-4xl mb-3">Chiffres clés</h2>
          <p className="text-gray-600 text-lg">Notre impact en quelques chiffres</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 animate-pulse">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                  <div className="w-24 h-12 bg-gray-200 rounded"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {displayStats.map((item) => {
              const IconComponent = ICON_MAP[item.name] || Package;
              const colors = COLOR_MAP[item.name] || COLOR_MAP["projets"];

              return (
                <div
                  key={item.id}
                  className={`group relative bg-white rounded-2xl p-8 border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    {/* Icon container with background */}
                    <div className={`${colors.bg} group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300`}>
                      <IconComponent
                        className={`${colors.icon} group-hover:text-white transition-colors duration-300`}
                        size={32}
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Number */}
                    <p className="text-5xl font-extrabold text-gray-900 group-hover:text-white transition-colors duration-300 tracking-tight">
                      {item.number}
                    </p>

                    {/* Label */}
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                      {item.name}
                    </p>

                    {/* Decorative element */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-300"></div>
                  </div>

                  {/* Trend indicator (optionnel - peut être ajouté plus tard) */}
                  {/* <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TrendingUp className="text-white w-5 h-5" />
                  </div> */}
                </div>
              );
            })}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Les statistiques en temps réel ne sont pas disponibles. Affichage des données de référence.
            </p>
          </div>
        )}

        {/* Top Row - 3 Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> */}
          
          {/* Visitors Card */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Visiteurs en temps réel</p>
                <p className="text-green-600 text-4xl">2,456</p>
                <p className="text-xs text-gray-500 mt-1">Actuellement en ligne</p>
              </div>
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
          </div> */}

          {/* Répartition des OSC par zone CRASC */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow font-poppins">
            <p className="text-sm font-semibold mb-4">Répartition des OSC par zone CRASC</p>            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zoneData}>
                <XAxis 
                  dataKey="name"
                  tick={ false }
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} className='cursor-pointer' fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="flex flex-wrap gap-2 text-xs justify-center">
              {zoneData.map((zone, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: zone.color }}
                  ></div>
                  <span className="text-gray-600">{zone.name}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Types de OSC  */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow font-poppins">
            <p className="text-sm font-semibold mb-4">Types d&apos;organisations de la société civile</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={communityTypesData}>
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#4A90E2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div> */}

          {/* Catégories de OSC */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow font-poppins">
            <p className="text-sm font-semibold mb-4">Catégories d'organisations</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis
                  tick={false}
                  height={10}
                />
                <YAxis tick={{ fontSize: 11 }}/>
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} className='cursor-pointer' fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 text-xs">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-4" style={{ backgroundColor: category.color }}></div>
                  <span className="text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div> */}
        {/* </div> */}

        {/* Bottom Row - 2 Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
          {/* Community Types Bar Chart */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-600 mb-4">Types de communautés</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={communityTypesData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#4A90E2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div> */}

          {/* Organization Categories Donut Chart */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-600 mb-4">Catégories d'organisations</p>
            <div className="flex justify-center items-center mb-4" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ value, u1 }) => `${u1} ${value}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div> */}

        {/* </div> */}
      </div>
    </section>
  );
}
