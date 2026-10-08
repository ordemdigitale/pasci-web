"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { API_ENDPOINTS } from "@/lib/api-config";
import { IPoleConcertation } from "@/types/api.types";
import { Search, MessageSquare, Layers, Users, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { libelleRegion } from "@/lib/osc-referentiels";
import { fetchWithAuth } from "@/lib/auth";
import { TexteFormate, useContenusSite } from "@/lib/contenus-site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getPoleImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath;
  return `${API_BASE}/static/${imagePath}`;
}

function parseJsonList(raw?: string | null): string[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string" && item.trim()) : [];
  } catch {
    return [];
  }
}

export default function PagePoleConcertation() {
  const { user } = useAuth();
  const [poles, setPoles] = useState<IPoleConcertation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [myPoleIds, setMyPoleIds] = useState<number[] | null>(null);
  // Textes et illustration modifiables dans l'admin (Textes et illustrations)
  const contenu = useContenusSite();

  const isOscUser = !!user?.osc_id;

  useEffect(() => {
    fetch(API_ENDPOINTS.forum.poles)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setPoles(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isOscUser) return;
    fetchWithAuth(`${API_BASE}/api/v1/crasc/osc/me`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Array.isArray(data.poles)) {
          setMyPoleIds(data.poles.map((p: { id: number }) => p.id));
        } else {
          setMyPoleIds([]);
        }
      })
      .catch(() => setMyPoleIds([]));
  }, [isOscUser]);

  const filtered = poles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      {/* Hero */}
      <div className="text-gray-600 max-w-5xl mx-auto sm:px-6 lg:px-6 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] ">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[#2a591d] font-bold text-4xl">Pôles de concertation</h2>
            <TexteFormate
              className="max-w-xl mt-6"
              texte={contenu("poles_intro")}
              variables={{ nb_poles: loading ? "plusieurs" : poles.length }}
            />
          </div>
          <div>
            <ImageWithFallback
              src={contenu("poles_illustration")}
              alt="Pôles de concertation"
              className="w-full h-[280px] object-cover rounded-lg"
            />
          </div>
          
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-4">Charte des pôles de concertation</h3>
          <TexteFormate texte={contenu("poles_charte")} />
        </div>
        
      </div>


      {/* Search */}
      <div className="p-6 mb-1">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un pôle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Poles Grid */}
      <div className="py-10 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-gray-900 font-bold text-3xl mb-8">PÔLES DE CONCERTATION</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pole) => {
                const objectifsList = parseJsonList(pole.objectifs);
                const regions = parseJsonList(pole.regions_influence);

                return (
                  <div
                    key={pole.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
                  >
                    {(pole.image_url || getPoleImageUrl(pole.image_path)) ? (
                      <ImageWithFallback
                        src={(pole.image_url || getPoleImageUrl(pole.image_path))!}
                        alt={pole.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-[#2a591d] to-[#E05017] flex items-center justify-center">
                        <Layers className="w-12 h-12 text-white opacity-60" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-2">{pole.name}</h3>

                      {objectifsList.length > 0 && (
                        <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mb-4">
                          {objectifsList.slice(0, 2).map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-auto mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {pole.nb_osc_membres ?? 0} OSC
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {pole.sujets_count} sujet{pole.sujets_count !== 1 ? "s" : ""}
                        </span>
                        {regions.length > 0 && (
                          <span
                            className="flex items-center gap-1"
                            title="Région qui compte le plus d'OSC membres, puis nombre d'autres régions"
                          >
                            <MapPin className="w-4 h-4" />
                            {/* L'API classe les régions de la plus représentée à la moins représentée */}
                            {libelleRegion(regions[0])}
                            {pole.regions_effectifs?.[0]?.nb ? ` (${pole.regions_effectifs[0].nb})` : ""}
                            {regions.length > 1 ? ` +${regions.length - 1}` : ""}
                          </span>
                        )}
                      </div>

                      {(() => {
                        const isAllowed = !isOscUser || myPoleIds === null || myPoleIds.includes(pole.id);
                        if (isAllowed) {
                          return (
                            <Link
                              href={`/espace-collaboratif/pole-concertation/${pole.slug}`}
                              className="w-full text-center px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] transition-colors"
                            >
                              Accéder au forum
                            </Link>
                          );
                        }
                        return (
                          <span
                            title="Ce pôle ne correspond pas à vos domaines prioritaires"
                            className="w-full text-center px-6 py-2 bg-gray-200 text-gray-400 rounded-full text-sm font-semibold cursor-not-allowed select-none"
                          >
                            Accéder au forum
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">Aucun pôle trouvé.</p>
          )}
        </div>
      </div>
    </section>
  );
}
