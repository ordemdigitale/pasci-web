"use client";

import { useState, useEffect } from "react";
import { Globe, MapPin, Users, Package, Landmark, LucideIcon } from "lucide-react";
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
        const response = await fetch(`http://localhost:8000/api/v1/key-stats`);
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

  return (
    <section className="py-10 bg-white font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-gray-900 font-bold text-3xl">Chiffres clés</h2>
          {/* <Button 
            variant="outline" 
            className="border border-[#E05017] text-[#E05017] hover:bg-[#E05017] hover:text-white rounded-lg px-6"
          >
            Voir plus
          </Button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Stat card */}
          {keyStats?.map((item) => {
            const IconComponent = ICON_MAP[item.name] || MapPin;

            return (
              <div key={item.id} className="bg-white rounded-lg p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-between gap-2">
                  <div className="text-[#de3b40]">
                    <IconComponent size={26} />
                  </div>
                  <p className="text-4xl font-bold">{item.number}</p>
                  <p className="text-gray-600 text-md uppercase">{item.name}</p>
                </div>
              </div>
            );
          })}
        </div>

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
