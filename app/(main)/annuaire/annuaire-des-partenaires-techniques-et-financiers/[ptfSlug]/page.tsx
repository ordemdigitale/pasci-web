"use client";

import React, { use, useState, useEffect } from "react";
import { IPTF } from '@/types/api.types';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from "next/link";
import {
  MapPin, Mail, Phone, Globe, Building2, Target,
  ArrowRight, ExternalLink, FileText, NotepadText, Loader2
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PTFDetailPage({ params }: { params: Promise<{ ptfSlug: string }> }) {
  const resolvedParams = use(params);
  const ptfSlug = resolvedParams.ptfSlug;

  const [ptfData, setPtfData] = useState<IPTF | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ptfSlug) return;
    const fetchPtf = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/ptf/${ptfSlug}`);
        if (!response.ok) throw new Error(response.status === 404 ? "Partenaire non trouvé" : `Erreur ${response.status}`);
        setPtfData(await response.json());
      } catch (err: any) {
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchPtf();
  }, [ptfSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !ptfData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center">
          <Building2 className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">PTF non trouvé</h2>
          <p className="text-gray-600 mb-6">{error || "Ce partenaire n'existe pas ou a été supprimé."}</p>
          <Link
            href="/annuaire/annuaire-des-partenaires-techniques-et-financiers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Retour à l'annuaire
          </Link>
        </div>
      </div>
    );
  }

  const domaines = ptfData.domaines_list || [];

  return (
    <section className="pb-10 font-poppins">

      {/* Cover Image (si disponible) */}
      {ptfData.cover_url && (
        <div className="relative h-64 md:h-80 overflow-hidden mb-8">
          <ImageWithFallback
            src={ptfData.cover_url}
            alt={ptfData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Si pas de cover, un bandeau dégradé */}
      {!ptfData.cover_url && (
        <div className="h-40 bg-gradient-to-r from-[#E05017] to-[#c44315]" />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header card — flotte sur le bandeau */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center p-4">
                {ptfData.thumbnail_url ? (
                  <ImageWithFallback
                    src={ptfData.thumbnail_url}
                    alt={ptfData.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-gray-300" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ptfData.name}</h1>
              {ptfData.description && (
                <p className="text-gray-600">{ptfData.description}</p>
              )}
              {(ptfData.pays || ptfData.date_creation) && (
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  {ptfData.pays && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#E05017]" />{ptfData.pays}
                    </span>
                  )}
                  {ptfData.date_creation && (
                    <span>Fondé en {ptfData.date_creation}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-8">

            {ptfData.mission && (
              <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-[#E05017]" />Mission
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ptfData.mission}</p>
              </div>
            )}

            {ptfData.vision && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Vision</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ptfData.vision}</p>
              </div>
            )}

            {domaines.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Domaines d'intervention</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {domaines.map((domaine, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#E05017] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{domaine}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ptfData.projets && ptfData.projets.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#E05017]" />
                  Projets ({ptfData.projets.length})
                </h2>
                <ul className="space-y-2">
                  {ptfData.projets.map((p) => (
                    <li key={p.id} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-[#E05017] rounded-full flex-shrink-0" />
                      {p.name || `Projet #${p.id}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Colonne contact */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-4">
                {ptfData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adresse</p>
                      <p className="text-sm text-gray-600">{ptfData.address}{ptfData.pays && `, ${ptfData.pays}`}</p>
                    </div>
                  </div>
                )}
                {ptfData.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <a href={`mailto:${ptfData.email}`} className="text-sm text-[#E05017] hover:underline break-all">
                        {ptfData.email}
                      </a>
                    </div>
                  </div>
                )}
                {ptfData.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Téléphone</p>
                      <a href={`tel:${ptfData.phone}`} className="text-sm text-[#E05017] hover:underline">
                        {ptfData.phone}
                      </a>
                    </div>
                  </div>
                )}
                {ptfData.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Site Web</p>
                      <a
                        href={ptfData.website.startsWith('http') ? ptfData.website : `https://${ptfData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#E05017] hover:underline inline-flex items-center gap-1"
                      >
                        {ptfData.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
                {domaines.length > 0 && (
                  <div className="flex items-start gap-3">
                    <NotepadText className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Domaines</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {domaines.slice(0, 3).map((d, i) => (
                          <span key={i} className="text-xs bg-[#E05017]/10 text-[#E05017] px-2 py-1 rounded font-semibold">
                            {d}
                          </span>
                        ))}
                        {domaines.length > 3 && (
                          <span className="text-xs text-gray-500">+{domaines.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/annuaire/annuaire-des-partenaires-techniques-et-financiers"
            className="inline-flex items-center gap-2 text-[#E05017] hover:underline font-semibold"
          >
            ← Retour à l'annuaire des PTF
          </Link>
        </div>
      </div>
    </section>
  );
}
