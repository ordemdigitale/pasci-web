/* app/admin/les-crasc/[crascSlug]/page.tsx: Page detail d'une Région CRASC */
"use client";

import React, { use, useState, useEffect } from "react";

import { getCrascBySlug } from "@/lib/fetch-crasc";
import { notFound } from "next/navigation";
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { ICrascDetail } from "@/types/api.types";
import Link from "next/link";


export default function AdminCrascPage({ params }: { params: Promise<{ crascSlug: string }>; }) {
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !crascSlug) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-600">
        {error || "CRASC non trouvé."}
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{crascData?.name}</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          ← Retour à la page de gestion des CRASC
        </Link>
      </div>

      {/* Section statistiques */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nombre de OSCs */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-2">Nombre d&apos;OSC du {crascData?.name} :</h3>
            <div className="text-5xl font-bold">{crascData?.osc_count}</div>
          </div>
          {/* Liste des régions qui composent le CRASC */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4 uppercase">les régions du {crascData?.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {crascData?.regions?.map((region) => (
                <div key={region.id} className="text-sm text-[#2a591d] font-bold">
                  {region.name}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* OSCs Card Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {crascData?.oscs?.length === 0 ? (
            <p className="font-semibold text-4xl text-center pb-8">Aucune OSC trouvée.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {crascData?.oscs?.map((osc: any) => (
                <div key={osc.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      alt={osc.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-center font-bold">{osc.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {osc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </section>
  )
}
