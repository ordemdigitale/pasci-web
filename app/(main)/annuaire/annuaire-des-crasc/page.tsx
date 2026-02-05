/* Page d'accueil ou Layout pour les régions CRASC */
"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { fetchAllCrasc } from "@/lib/fetch-crasc";
import { ICrasc, IKeyStats, SpotlightNews } from "@/types/api.types";
import { Users, Building2, Target, ArrowRight, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import DOMPurify from 'dompurify';
import { CrascMapSvg } from '@/components/ui/CrascMapSvg';
import { useRouter } from 'next/navigation';

interface IActivityCard {
  id: number;
  image: string;
  title: string;
  description: string;
  slug: string;
}

const activityCards: IActivityCard[] = [
  {
    id: 1,
    image: "/images/page-annuaire-crasc/mplci.jpg",
    title: "Mouvement Pour Lutte contre l'injustice (MPLCI)",
    description: "Organisation engagée dans la promotion de la justice sociale et la défense des droits humains en Côte d'Ivoire",
    slug: "mplci"
  },
  {
    id: 2,
    image: "/images/page-annuaire-crasc/fefab.jpg",
    title: "Fédération des femmes d'Anyama et de Brofodoumé (FEFAB)",
    description: "Fédération qui œuvre pour l'autonomisation des femmes et le développement communautaire",
    slug: "fefab"
  },
  {
    id: 3,
    image: "/images/page-annuaire-crasc/fondation-vie.jpg",
    title: "Fondation Vie",
    description: "Organisation dédiée à l'amélioration des conditions de vie des communautés vulnérables",
    slug: "fondation-vie"
  },
  {
    id: 4,
    image: "/images/page-annuaire-crasc/asso-femme-soutra.jpg",
    title: "Association des Femmes Soutra",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus",
    slug: "association-femmes-soutra"
  },
  {
    id: 5,
    image: "/images/page-annuaire-crasc/5.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus",
    slug: "osc-5"
  },
  {
    id: 6,
    image: "/images/page-annuaire-crasc/6.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus",
    slug: "osc-6"
  }
];

const recentlyAdded: IActivityCard[] = [
  {
    id: 1,
    image: "/images/page-annuaire-crasc/fefab.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus",
    slug: "recent-osc-1"
  },
  {
    id: 2,
    image: "/images/page-annuaire-crasc/rec-add-2.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus",
    slug: "recent-osc-2"
  },
  {
    id: 3,
    image: "/images/page-annuaire-crasc/rec-add-3.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus",
    slug: "recent-osc-3"
  }
];

const tabs = [
  { id: 0, label: 'Tous des CRASC' },
  { id: 1, label: 'CRASC Sud' },
  { id: 2, label: 'CRASC Centre' },
  { id: 3, label: 'CRASC Nord' },
  { id: 4, label: 'CRASC Ouest' },
  { id: 5, label: 'CRASC Est' }
];

const activities = [
  "L'Assemblée Générale",
  "Le Conseil d'Administration",
  "La Direction Exécutive",
  "Délégations Régionales",
  "Le Commissariat Aux Comptes"
];

export const domainesIntervention = [
  "Gouvernance",
  "Développement durable",
  "Développement local",
  "Bien-être social",
  "Cohésion social"
];

// Mock data actualités (même que dans SectionNews)
const mockNews: SpotlightNews[] = [
  {
    id: 1,
    title: "Lancement du nouveau programme de formation pour les OSC",
    slug: "nouveau-programme-formation-osc",
    content: "Le CRASC annonce le lancement d'un nouveau programme de formation destiné aux organisations de la société civile. Ce programme vise à renforcer les capacités en gestion de projets.",
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    crasc: {
      id: "1",
      name: "CRASC SUD",
      slug: "crasc-sud",
      osc_count: 150
    }
  },
  {
    id: 2,
    title: "Atelier de renforcement des capacités organisationnelles",
    slug: "atelier-renforcement-capacites",
    content: "Un atelier de trois jours pour améliorer les compétences organisationnelles des membres des OSC. Formation sur la gouvernance, la planification stratégique et la mobilisation de ressources.",
    thumbnail_url: "/images/actualites/atelier-capacites.jpg",
    crasc: {
      id: "2",
      name: "CRASC CENTRE",
      slug: "crasc-centre",
      osc_count: 120
    }
  },
  {
    id: 3,
    title: "Assemblée générale annuelle 2025",
    slug: "assemblee-generale-2025",
    content: "Convocation à l'assemblée générale ordinaire pour faire le bilan des activités de l'année écoulée et définir les orientations stratégiques pour 2025.",
    thumbnail_url: "/images/actualites/assemblee-generale.jpg",
    crasc: {
      id: "3",
      name: "CRASC NORD",
      slug: "crasc-nord",
      osc_count: 80
    }
  },
  {
    id: 4,
    title: "Forum régional sur le développement durable",
    slug: "forum-regional-developpement-durable",
    content: "Le CRASC organise un forum régional réunissant les acteurs du développement durable pour échanger sur les bonnes pratiques et renforcer les synergies d'action.",
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    crasc: {
      id: "4",
      name: "CRASC EST",
      slug: "crasc-est",
      osc_count: 95
    }
  },
  {
    id: 5,
    title: "Campagne de sensibilisation sur les droits humains",
    slug: "campagne-sensibilisation-droits-humains",
    content: "Lancement d'une vaste campagne de sensibilisation aux droits humains dans les communautés locales, avec l'appui des OSC membres du réseau CRASC.",
    thumbnail_url: "/images/actualites/atelier-capacites.jpg",
    crasc: {
      id: "5",
      name: "CRASC OUEST",
      slug: "crasc-ouest",
      osc_count: 110
    }
  }
];


export default function PageAnnuaireCrasc() {
  const [keyStats, setKeyStats] = useState<IKeyStats[] | null>([]);
  const [crascData, setCrascData] = useState<ICrasc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spotlightNewsData, setSpotlightNewsData] = useState<SpotlightNews[]>(mockNews);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch CRASC data on component mount
   useEffect(() => {
    const fetchCrascData = async () => {
      try {
        const crasc = await fetchAllCrasc();
        console.log("Page annuaire des CRASC: ", crasc);
        setCrascData(crasc);
      }
      catch (error) {
        console.error("Error fetching CRASC regions data: ", error);
      }
    }
    fetchCrascData();
  }, []);

  // fetch key stats data
  useEffect(() => {
    const fetchKeyStatsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/v1/key-stats");
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

  // fetch spotlight news data
  useEffect(() => {
    const fetchSpotlightNewsData = async () => {
      setNewsLoading(true);
      setNewsError(null);

      try {
        const response = await fetch("http://localhost:8000/api/v1/crasc/news-spotlight-crasc");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        if (result && result.length > 0) {
          setSpotlightNewsData(result);
        }
      } catch (err: any) {
        console.log("Erreur lors du chargement des actualités:", err);
        setNewsError(err.message);
        // On garde les données mock en cas d'erreur
      } finally {
        setNewsLoading(false);
      }
    };
    fetchSpotlightNewsData();
  }, []);

  const firstKeyStat = keyStats?.find(item => item.name === "osc");

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Annuaire des <span className="text-[#E05017]">CRASC</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos centres régionaux d'appui à la société civile et leurs organisations membres
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carte des CRASC en Côte d'Ivoire</h2>
            <p className="text-gray-600">Cliquez sur une région pour découvrir le CRASC correspondant</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Map Container */}
            <CrascMapSvg
              interactive={true}
              onRegionClick={(regionId, href) => {
                console.log(regionId)
                router.push(href)
              }}
            />

            {/* Legend */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Légende des zones</h3>
              
              <div className="space-y-3">
                {/* Crasc Sud */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded bg-blue-300 border-2 border-blue-400"></div>
                  <div>
                    <p className="font-bold text-blue-900">CRASC SUD</p>
                    <p className="text-xs text-blue-700">Abidjan, San-Pédro, Gagnoa</p>
                  </div>
                </div>
                {/* Crasc Centre */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded bg-green-300 border-2 border-green-400"></div>
                  <div>
                    <p className="font-bold text-green-900">CRASC CENTRE</p>
                    <p className="text-xs text-green-700">Yamoussoukro, Bouaké, Dimbokro</p>
                  </div>
                </div>
                {/* Crasc Nord */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded bg-orange-300 border-2 border-orange-400"></div>
                  <div>
                    <p className="font-bold text-orange-900">CRASC NORD</p>
                    <p className="text-xs text-orange-700">Korhogo, Ferkessédougou, Séguéla</p>
                  </div>
                </div>
                {/* Crasc Ouest */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded bg-cyan-300 border-2 border-cyan-400"></div>
                  <div>
                    <p className="font-bold text-cyan-900">CRASC OUEST</p>
                    <p className="text-xs text-cyan-700">Man, Daloa, Guiglo</p>
                  </div>
                </div>
                {/* Crasc Est */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded bg-rose-300 border-2 border-rose-400"></div>
                  <div>
                    <p className="font-bold text-rose-900">CRASC EST</p>
                    <p className="text-xs text-rose-700">Abengourou, Bondoukou</p>
                  </div>
                </div>

              </div>

              {/* {<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  💡 <span className="font-semibold">Astuce :</span> Survolez les régions sur la carte pour voir les détails
                </p>
              </div>} */}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section - Redesigned */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Organizations Count */}
          <div className="group relative bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="mb-3">
                <Users className="w-10 h-10 text-[#E05017] group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <h3 className="text-xs uppercase font-bold text-gray-600 group-hover:text-white/80 mb-2 transition-colors tracking-wider">
                OSC MEMBRES
              </h3>
              <div className="text-4xl font-extrabold text-[#E05017] group-hover:text-white transition-colors mb-1">
                {firstKeyStat?.number || "3201"}
              </div>
              <p className="text-xs text-gray-500 group-hover:text-white/70 transition-colors">
                Organisations actives
              </p>
            </div>
          </div>

          {/* CRASC Regions */}
          <div className="group relative bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="mb-3">
                <Building2 className="w-10 h-10 text-[#E05017] group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <h3 className="text-xs uppercase font-bold text-gray-600 group-hover:text-white/80 mb-2 transition-colors tracking-wider">
                NOS ZONES CRASC
              </h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {crascData.length > 0 ? (
                  <>
                    {crascData.map((crasc) => (
                      <div key={crasc.id} className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                        {/* <MapPin className="w-3 h-3 flex-shrink-0" /> */}
                        <span className="truncate">{crasc.name}</span>
                      </div>
                    ))}
                    {/* Ajouter des éléments supplémentaires pour atteindre 10 */}
                    {Array.from({ length: Math.max(0, 10 - crascData.length) }).map((_, index) => (
                      <div key={`placeholder-${index}`} className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">CRASC {index + crascData.length + 1}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                      
                      <span>CRASC Sud</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                      
                      <span>CRASC Centre</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                      
                      <span>CRASC Nord</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                      
                      <span>CRASC Ouest</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                      
                      <span>CRASC Est</span>
                    </div>
                    
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Domaines d'intervention */}
          <div className="group relative bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="mb-3">
                <Target className="w-10 h-10 text-[#E05017] group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <h3 className="text-xs uppercase font-bold text-gray-600 group-hover:text-white/80 mb-2 transition-colors tracking-wider">
                DOMAINES D'INTERVENTION
              </h3>
              <div className="space-y-1.5">
                {domainesIntervention.slice(0, 5).map((domaine, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-semibold text-[#E05017] group-hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E05017] group-hover:bg-white"></div>
                    <span>{domaine}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section OSC membres - Redesigned */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">OSC membres</h2>
{/*             <p className="text-gray-600">Découvrez les organisations qui font partie de notre réseau</p> */}
          </div>
        </div>

        {/* OSC Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activityCards.slice(0, 3).map((osc) => (
            <Link
              key={osc.id}
              href={`/annuaire/annuaire-des-osc/${osc.slug}`}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                <ImageWithFallback
                  src={osc.image}
                  alt={osc.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#E05017] transition-colors">
                  {osc.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {osc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Voir Plus Button */}
        <div className="text-center">
          <Link
            href="/annuaire/annuaire-des-osc"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Voir plus d'OSC
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Section actualités - Redesigned */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Nos actualités</h2>
{/*             <p className="text-gray-600">Restez informé des dernières nouvelles du réseau</p> */}
          </div>
          <Link
            href="/actualites"
            className="text-[#E05017] hover:text-[#d04010] font-semibold flex items-center gap-2 transition-colors"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State */}
        {newsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05017] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des actualités...</p>
          </div>
        )}

        {/* Error State */}
        {newsError && !newsLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ Impossible de charger les actualités depuis le serveur. Affichage des données de démonstration.
            </p>
          </div>
        )}

        {/* News Grid */}
        {!newsLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlightNewsData?.map((news) => (
              <div
                key={news.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
              >
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={news.thumbnail_url}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 pb-16">
                  <p className="text-sm text-gray-800 mb-2">{news.crasc?.name}</p>
                  <h3 className="text-gray-900 mb-3 font-bold">{news.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content ?? '') }}></p>
                </div>
                <Link
                  href={`/actualites/${news.slug}`}
                  className="absolute bottom-0 left-0 right-0 p-4 text-[#2a591d] underline text-sm transition-colors inline-flex items-center group"
                >
                  Lire l'article
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* No Data State */}
        {!newsLoading && spotlightNewsData?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune actualité disponible pour le moment.</p>
          </div>
        )}
      </div>

    </section>
  )
}
