"use client";

import { useState, useEffect } from "react";
import { Users, Package, Landmark, MapPin, Briefcase, Eye } from "lucide-react";
import { IOffreProjet } from "@/types/api.types";
import VisiteCounter from "../layout/VisiteCounter";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  bg: string;
  iconColor: string;
  border: string;
  gradient: string;
}

export default function Stats() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [projets, setProjets] = useState<IOffreProjet[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projets from API
  useEffect(() => {
    const loadProjets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/offre-projets`);
        if (response.ok) {
          const data = await response.json();
          setProjets(data);
        } else {
          console.error("Erreur lors du chargement des projets:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjets();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/stats/dashboard`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        setStats([
          {
            label: "CRASC",
            value: data.crasc?.total ?? 0,
            icon: Landmark,
            bg: "bg-[#E05017]/10",
            iconColor: "text-[#E05017]",
            border: "border-[#E05017]/30",
            gradient: "from-[#E05017] to-[#d04010]",
          },
          {
            label: "Régions et districts",
            value: data.regions?.total ?? 0,
            icon: MapPin,
            bg: "bg-green-50",
            iconColor: "text-green-600",
            border: "border-green-200",
            gradient: "from-green-500 to-green-600",
          },
          {
            label: "OSC",
            value: data.osc?.total ?? 0,
            icon: Users,
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
            border: "border-blue-200",
            gradient: "from-blue-500 to-blue-600",
          },
/*           {
            label: "Offres de projets",
            value: data.jobs?.active ?? 0,
            icon: Briefcase,
            bg: "bg-purple-50",
            iconColor: "text-purple-600",
            border: "border-purple-200",
            gradient: "from-purple-500 to-purple-600",
          }, */
        ]);
      } catch {
        // Silently fail — no fallback numbers shown
        setStats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-extrabold text-3xl mb-3">Chiffres clés</h2>
          <p className="text-gray-600 text-lg">Notre impact en quelques chiffres</p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Stats cards */}
        {!loading && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl p-8 border-2 ${item.border} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className={`${item.bg} group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300`}>
                      <Icon className={`${item.iconColor} group-hover:text-white transition-colors duration-300`} size={32} strokeWidth={2.5} />
                    </div>
                    <p className="text-5xl font-extrabold text-gray-900 group-hover:text-white transition-colors duration-300 tracking-tight">
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-center">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
            <div
              className={`group relative bg-white rounded-2xl p-8 border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className={`bg-purple-50 group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300`}>
                  <Briefcase className={`text-purple-600 group-hover:text-white transition-colors duration-300`} size={32} strokeWidth={2.5} />
                </div>
                <p className="text-5xl font-extrabold text-gray-900 group-hover:text-white transition-colors duration-300 tracking-tight">
                  {projets.length}
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-center">
                  Offres de projets
                </p>
              </div>
            </div>
            <div
              className={`group relative bg-white rounded-2xl p-8 border-2 border-red-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className={`bg-red-50 group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300`}>
                  <Eye className={`text-red-600 group-hover:text-white transition-colors duration-300`} size={32} strokeWidth={2.5} />
                </div>
                <p className="text-5xl font-extrabold text-gray-900 group-hover:text-white transition-colors duration-300 tracking-tight">
                  <VisiteCounter />
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-center">
                  Nombre de visites
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
