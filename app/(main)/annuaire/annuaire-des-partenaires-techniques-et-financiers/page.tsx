"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/lib/imageWithFallback'
import { IPTF } from '@/types/api.types';
import Link from 'next/link';

// Mock data de fallback
const mockPTFData: IPTF[] = [
  {
    id: 1,
    name: "Banque Mondiale",
    slug: "banque-mondiale",
    description: "Institution financière internationale qui fournit des prêts et des dons aux gouvernements des pays en développement pour des projets de développement.",
    thumbnail_url: "/images/partenaires/banque-mondiale.png"
  },
  {
    id: 2,
    name: "Union Européenne",
    slug: "union-europeenne",
    description: "Principal partenaire de développement de la Côte d'Ivoire, soutenant la gouvernance, l'éducation et le développement économique.",
    thumbnail_url: "/images/partenaires/union-europeenne.png"
  },
  {
    id: 3,
    name: "UNICEF",
    slug: "unicef",
    description: "Fonds des Nations Unies pour l'enfance, œuvrant pour la protection des droits des enfants et l'amélioration de leurs conditions de vie.",
    thumbnail_url: "/images/partenaires/unicef.png"
  },
  {
    id: 4,
    name: "USAID",
    slug: "usaid",
    description: "Agence des États-Unis pour le développement international, promouvant la croissance économique, la santé et la démocratie.",
    thumbnail_url: "/images/partenaires/usaid.png"
  },
  {
    id: 5,
    name: "AFD",
    slug: "afd",
    description: "Agence Française de Développement, accompagnant les projets de développement durable et de lutte contre la pauvreté.",
    thumbnail_url: "/images/partenaires/afd.png"
  },
  {
    id: 6,
    name: "GIZ",
    slug: "giz",
    description: "Coopération allemande pour le développement, soutenant les projets de formation professionnelle et de gouvernance.",
    thumbnail_url: "/images/partenaires/giz.png"
  },
  {
    id: 7,
    name: "KOICA",
    slug: "koica",
    description: "Agence coréenne de coopération internationale, investissant dans l'éducation, la santé et les infrastructures.",
    thumbnail_url: "/images/partenaires/koica.png"
  },
  {
    id: 8,
    name: "PNUD",
    slug: "pnud",
    description: "Programme des Nations Unies pour le développement, appuyant la gouvernance démocratique et le développement durable.",
    thumbnail_url: "/images/partenaires/pnud.png"
  },
  {
    id: 9,
    name: "JICA",
    slug: "jica",
    description: "Agence japonaise de coopération internationale, soutenant le développement des infrastructures et le renforcement des capacités.",
    thumbnail_url: "/images/partenaires/jica.png"
  }
];

export default function PageAnnuairePTF() {
  const [ptfData, setPtfData] = useState<IPTF[]>(mockPTFData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/ptf');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result && result.length > 0) {
          setPtfData(result);
        }
      } catch (error: any) {
        console.log("Erreur lors du chargement des PTF:", error);
        setError(error.message || "Impossible de charger les PTF.");
        // On garde les données mock en cas d'erreur
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2a591d] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white font-poppins">

      {/* Hero Section - Titre principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h1 className="text-[#2a591d] font-extrabold text-4xl md:text-5xl text-center">
          Annuaire des Partenaires Techniques<br />et Financiers (PTF)
        </h1>
      </div>

      {/* Section Introduction avec image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left content - Text */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[#E05017] font-bold text-3xl md:text-4xl mb-6">
                Ensemble, nous pouvons renforcer l'impact
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Notre communauté open source est dédiée à la promotion de l'innovation et à la collaboration à travers des projets transformateurs. Nous croyons au pouvoir du partage des connaissances et des ressources pour résoudre des défis complexes.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">Notre Mission</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Nous nous engageons à créer des solutions durables et accessibles qui ont un impact positif sur le monde. En favorisant un environnement inclusif, nous permettons aux développeurs et aux contributeurs de tous horizons de s'épanouir, en créant des outils et des technologies qui façonnent un avenir meilleur pour tous.
              </p>
            </div>
          </div>

          {/* Right content - Image */}
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

      {/* Section PTF Cards - 3 colonnes comme dans l'image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-sm">
              ⚠️ Impossible de charger les PTF depuis le serveur. Affichage des données de démonstration.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ptfData.map((ptf) => (
            <Link
              key={ptf.id}
              href={`/annuaire/annuaire-des-partenaires-techniques-et-financiers/${ptf.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#2a591d]/30 transition-all duration-300">

                {/* Logo/Image container - Taille carrée pour les logos */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-8 border-b-2 border-gray-200 group-hover:bg-gray-100 transition-colors">
                  <ImageWithFallback
                    src={ptf.thumbnail_url || ''}
                    alt={ptf.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#2a591d] transition-colors">
                    {ptf.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {ptf.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state si pas de PTF */}
        {ptfData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun partenaire disponible pour le moment.</p>
          </div>
        )}
      </div>

    </section>
  );
}
