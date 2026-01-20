"use client";

import React, {use, useState, useEffect} from "react";
import { getPtfBySlug } from "@/lib/fetch-ptf";
import { IPTF } from '@/types/api.types';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from "next/link";

export default function PTFDetailPage({ params }: { params: Promise<{ ptfSlug: string }>; }) {
  const resolvedParams = use(params);
  const ptfSlug = resolvedParams.ptfSlug;
  const [ptfData, setPtfData] = useState<IPTF | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ptfSlug) return;
    let isCurrent = true;

    async function fetchPtf() {
      try {
        setLoading(true);
        const data = await getPtfBySlug(ptfSlug);
        if (isCurrent) setPtfData(data);
      } catch (err: any) {
        if (!isCurrent) setError(err.message || "Impossible de charger le PTF.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchPtf();

    return () => {
      isCurrent = false;
    };
  }, [ptfSlug]);

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

  if (error || !ptfData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-poppins">
        <p className="text-gray-600 text-4xl font-bold">{error || "Partenaire Technique et Financier non trouvé."}</p>
        <br />
        <Link href="/annuaire/annuaire-des-partenaires-techniques-et-financiers" className="text-sm hover:underline text-blue-600">
          Retour à l'annuaire des PTF.
        </Link>
      </div>
    );
  }

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      <div className="max-w-5xl mx-auto border border-gray-200 rounded-lg shadow-md flex flex-row items-center gap-8 p-4">
        <div className="p-2 border border-gray-300 rounded-lg">
          <ImageWithFallback
            src={ptfData.thumbnail_url}
            alt="image"
            className="w-full h-[100px] object-cover rounded-lg"
            
          />
        </div>

        <div>
          <p className="text-4xl font-bold">{ptfData.name}</p>
        </div>

      </div>

      {/* Projets disponible */}
      <div className="py-8 max-w-5xl mx-auto">
        <p className="font-bold text-3xl pb-[50px]">Projets disponibles</p>

        {ptfData.projets?.length == 0 ? (
          <p>Pas de projets</p>
        ) : (
          <p>
            <ul>
            {ptfData.projets?.map((projet) => (
              <li key={projet.id}>{projet.name}</li>
            ))}
              </ul>
          </p>
        )}
      </div>

    </section>
  )
}
