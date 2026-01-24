/* app/(main)/annuaire/annuaire-des-crasc/[crascSlug]/page.tsx: Page detail d'une Région CRASC */
"use client";

import React, { use, useState, useEffect } from "react";
import { getCrascBySlug  } from "@/lib/fetch-crasc";
import Link from "next/link";
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { ICrascDetail, INews } from "@/types/api.types";
import { domainesIntervention } from "../page";
import { 
  Building2, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Calendar,
  ExternalLink,
  Loader2,
  Target
} from 'lucide-react';


export default function CrascRegionPage({ params }: { params: Promise<{ crascSlug: string }>; }) {
  const resolvedParams = use(params);
  const crascSlug = resolvedParams.crascSlug;
  const [crascData, setCrascData] = useState<ICrascDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!crascSlug) return;
    let isCurrent = true;

    async function fetchCrasc() {
      try {
        setLoading(true);
        const data = await getCrascBySlug(crascSlug);
        if (isCurrent) setCrascData(data);
      } catch (err: any) {
        if (isCurrent) setError(err.message || "Impossible de charger les données du CRASC.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchCrasc();

    return () => {
      isCurrent = false;
    };
  }, [crascSlug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des détails du CRASC...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !crascData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Erreur</h2>
            <p className="text-red-700 mb-6">{error || 'CRASC non trouvé'}</p>
            <Link
              href="/annuaire/annuaire-des-crasc"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white font-semibold rounded-lg hover:bg-[#d04010] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'annuaire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#E05017] to-[#d04010] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/annuaire/annuaire-des-crasc"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'annuaire
          </Link>
          
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                {crascData.name}
              </h1>
              {crascData.osc_count !== undefined && (
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {crascData.osc_count} OSC{crascData.osc_count > 1 ? 's' : ''} membre{crascData.osc_count > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Régions Card */}
              {crascData.regions && crascData.regions.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Régions Couvertes</h3>
                  </div>
                  <div className="space-y-2">
                    {crascData.regions.map((region) => (
                      <div
                        key={region.id}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {region.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Domaines Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Domaines d'Intervention</h3>
                </div>
                <div className="space-y-2">
                  {domainesIntervention.slice(0, 5).map((domaine, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      {domaine}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OSC Members Section */}
            {crascData.oscs && crascData.oscs.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      OSC Membres
                    </h2>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {crascData.oscs.length} organisation{crascData.oscs.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {crascData.oscs.map((osc) => (
                    <div
                      key={osc.id}
                      className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-[#E05017] hover:shadow-md transition-all"
                    >
                      <div className="aspect-video overflow-hidden bg-gray-200">
                        <ImageWithFallback
                          alt={osc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-[#E05017] transition-colors mb-2 line-clamp-1">
                          {osc.name}
                        </h3>
                        {osc.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {osc.description}
                          </p>
                        )}
                        {osc.type && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {osc.type.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {crascData.oscs?.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center shadow-sm">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucune OSC ajoutée pour le moment.</p>
              </div>
            )}

            {/* News Section */}
            {crascData.news && crascData.news.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Actualités Récentes
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {crascData.news.slice(0, 4).map((news: INews) => (
                    <Link
                      key={news.id}
                      href={`/actualites/${news.slug}`}
                      className="group block bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-[#E05017] hover:shadow-md transition-all"
                    >
                      {news.thumbnail_url && (
                        <div className="aspect-video overflow-hidden bg-gray-200">
                          <ImageWithFallback
                            src={news.thumbnail_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-[#E05017] transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h3>
                        {news.created_at && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(news.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {crascData.news.length > 4 && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/actualites"
                      className="inline-flex items-center gap-2 text-[#E05017] hover:text-[#d04010] font-semibold transition-colors"
                    >
                      Voir toutes les actualités
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {(!crascData.news || crascData.news.length === 0) && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center shadow-sm">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucune actualité ajoutée pour le moment.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Statistiques
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">OSC Membres</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {crascData.osc_count || crascData.oscs?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Régions</span>
                  <span className="text-2xl font-bold text-green-600">
                    {crascData.regions?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Actualités</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {crascData.news?.length || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/contact"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  Contacter le CRASC
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
