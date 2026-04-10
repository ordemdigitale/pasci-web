"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { API_ENDPOINTS } from "@/lib/api-config";
import { IPoleConcertation } from "@/types/api.types";
import { Search, MessageSquare } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getPoleImageUrl(imagePath?: string | null): string {
  if (!imagePath) return "/images/placeholder.jpg";
  if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath;
  return `${API_BASE}/static/${imagePath}`;
}

export default function PagePoleConcertation() {
  const [poles, setPoles] = useState<IPoleConcertation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = poles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      {/* Hero */}
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-[#2a591d] font-bold text-4xl">Pôles de concertation</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Au nombre de 11, les pôles de concertation sont des espaces de discussion, de libres échanges
            et de valorisation des domaines prioritaires des OSC. Réservés uniquement aux OSC inscrits
            sur la plateforme, les partages et les discussions s&apos;opèrent dans une dynamique de
            respect mutuel et d&apos;intérêt commun.
          </p>
        </div>
        <div>
          <ImageWithFallback
            src="/images/b81daf7f-c015-4a68-942f-ce602fdf5542.jpg"
            alt="Pôles de concertation"
            className="w-full h-[280px] object-cover rounded-lg"
          />
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
                const objectifsList: string[] = (() => {
                  try {
                    return pole.objectifs ? JSON.parse(pole.objectifs) : [];
                  } catch {
                    return [];
                  }
                })();

                return (
                  <div
                    key={pole.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
                  >
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white mb-3 bg-[#E05017] self-start">
                        {pole.category}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 mb-2">{pole.name}</h3>

                      {objectifsList.length > 0 && (
                        <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mb-4">
                          {objectifsList.slice(0, 2).map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto mb-4">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {pole.sujets_count} sujet{pole.sujets_count !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <Link
                        href={`/espace-collaboratif/pole-concertation/${pole.slug}`}
                        className="w-full text-center px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] transition-colors"
                      >
                        Accéder au forum
                      </Link>
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
