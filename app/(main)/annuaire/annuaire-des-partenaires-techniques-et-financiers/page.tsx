"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/lib/imageWithFallback'
import { IPTF } from '@/types/api.types';
import Link from 'next/link';
import { Loader2, Building2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PageAnnuairePTF() {
  const [ptfData, setPtfData] = useState<IPTF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/ptf`);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const result = await response.json();
        setPtfData(result);
      } catch (err: any) {
        setError("Impossible de charger les PTF.");
        console.error("Erreur chargement PTF:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <section className="py-12 bg-white font-poppins">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h1 className="text-[#2a591d] font-extrabold text-2xl md:text-4xl text-center">
          Annuaire des Partenaires Techniques<br />et Financiers (PTF)
        </h1>
      </div>

      {/* Section Introduction */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-[#E05017] font-bold text-2xl md:text-3xl mb-6">
                Ensemble, nous pouvons renforcer l'impact
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Notre communauté est dédiée à la promotion de l'innovation et à la collaboration à travers des projets transformateurs. Nous croyons au pouvoir du partage des connaissances et des ressources pour résoudre des défis complexes.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">Notre Mission</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Nous nous engageons à créer des solutions durables et accessibles qui ont un impact positif sur le monde. En favorisant un environnement inclusif, nous permettons aux acteurs de tous horizons de s'épanouir et de façonner un avenir meilleur pour tous.
              </p>
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg"
                alt="Collaboration et partenariat"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PTF Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 text-sm">⚠️ {error}</p>
          </div>
        )}

        {!error && ptfData.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun partenaire disponible pour le moment.</p>
          </div>
        )}

        {ptfData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ptfData.map((ptf) => (
              <Link
                key={ptf.id}
                href={`/annuaire/annuaire-des-partenaires-techniques-et-financiers/${ptf.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#2a591d]/30 transition-all duration-300">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-8 border-b-2 border-gray-200 group-hover:bg-gray-100 transition-colors">
                    {ptf.thumbnail_url ? (
                      <ImageWithFallback
                        src={ptf.thumbnail_url}
                        alt={ptf.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-16 h-16 text-gray-300" />
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#2a591d] transition-colors">
                      {ptf.name}
                    </h3>
                    {ptf.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {ptf.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
