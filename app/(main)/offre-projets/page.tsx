"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import {
  CircleCheckBig,
  Handshake,
  DollarSign,
  Search,
  MapPin,
  Clock,
  Building2,
  Target,
  Calendar,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { IOffreProjet } from '@/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/* Categories data */
const domaines = [
  "Environnement",
  "Éducation",
  "Santé",
  "Culture & Économie",
  "Agriculture",
  "Développement communautaire"
];

const zones = [
  "Abidjan",
  "Bouaké",
  "Yamoussoukro",
  "Korhogo",
  "San-Pédro",
  "Daloa"
];

export default function PageOffreProjet() {
  const [projets, setProjets] = useState<IOffreProjet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  // Load projets from API
  useEffect(() => {
    const loadProjets = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/offre-projets/active`);
        if (response.ok) {
          const data = await response.json();
          setProjets(data);
        } else {
          console.error("Erreur lors du chargement des projets:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjets();
  }, []);

  // Filtrer les projets
  const filteredProjets = projets.filter((projet) => {
    const matchSearch = projet.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       projet.osc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomaine = !selectedDomaine || projet.domaine === selectedDomaine;
    const matchZone = !selectedZone || projet.zone === selectedZone;

    return matchSearch && matchDomaine && matchZone;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E05017]/20 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E05017]/20 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-extrabold text-4xl md:text-5xl leading-tight mb-4">
                Offres de Projets
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                La PdoC vous permet d'accéder facilement aux actualités relatives aux appels à projets et à de nombreuses opportunités de financement.
                <ul className="ml-12">
                  <li>&#x2714; « Des appels à projets, en un clic ! »</li>
                </ul>
              </p>
            </div>

            <div className="hidden lg:block">
              <ImageWithFallback
                src="/images/process-formalisation-page.png"
                alt="Offres de projets"
                className="w-full h-64 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Search bar */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un projet ou une OSC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              />
            </div>

            {/* Domaine filter */}
            {/*<div>
              <select
                value={selectedDomaine}
                onChange={(e) => setSelectedDomaine(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              >
                <option value="">Tous les domaines</option>
                {domaines.map((domaine) => (
                  <option key={domaine} value={domaine}>
                    {domaine}
                  </option>
                ))}
              </select>
            </div>*/}

            {/* Zone filter */}
            {/*<div>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              >
                <option value="">Toutes les zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>*/}
          </div>

          {/* Results count */}
          {/*{(searchQuery || selectedDomaine || selectedZone) && (
            {/*<div className="mt-4 text-sm text-gray-600">
              <span className="font-bold text-[#E05017]">{filteredProjets.length}</span> projet{filteredProjets.length > 1 ? 's' : ''} trouvé{filteredProjets.length > 1 ? 's' : ''}
            </div>
          )}*/}
        </div>
      </div>

      {/* Projets Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="font-bold text-2xl text-gray-900 mb-6">
          Projets disponibles
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mb-4" />
            <p className="text-gray-500 font-semibold">Chargement des projets...</p>
          </div>
        ) : filteredProjets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
            <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjets.map((projet) => (
              <Link
                key={projet.id}
                href={`/offre-projets/${projet.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#E05017]/30 overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={projet.image_url || '/images/placeholder.jpg'}
                      alt={projet.nom}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {projet.statut}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-[#E05017] bg-[#E05017]/10 px-2 py-1 rounded">
                        {projet.domaine}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                      {projet.nom}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#E05017]" />
                        <span className="truncate">{projet.osc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#E05017]" />
                        <span>{projet.zone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#E05017]" />
                        <span>{projet.durée}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#E05017]" />
                        <span className="font-semibold">{projet.budget}</span>
                      </div>
                    </div>

                    {/* Badge PTF */}
                    {projet.ptf && (
                      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-orange-50 border border-orange-100 rounded-lg">
                        {projet.ptf.thumbnail_url ? (
                          <img src={projet.ptf.thumbnail_url} alt={projet.ptf.name} className="w-6 h-6 object-contain rounded" />
                        ) : (
                          <Handshake className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-[#E05017] truncate">{projet.ptf.name}</span>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-2 text-[#E05017] font-semibold text-sm group-hover:gap-3 transition-all">
                        Voir les détails
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pourquoi être membre du CRASC ? */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h2 className="font-extrabold text-3xl md:text-4xl text-center text-gray-900 mb-4">
            Pourquoi être membre du CRASC ?
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto">
            <b>Rejoignez la plateforme des OSC</b> et profitez de nombreux avantages :
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <p>
                <b>Des mécanismes d'accompagnement pratiques</b> pour vos projets grâce à la plateforme <b>PdoC</b>
              </p>
            </div>

            <div className="text-center space-y-4">
              <p>
                <b>Des formations utiles</b> : apprendre à communiquer, gérer un projet, travailler en équipe, prévenir les conflits...
              </p>
            </div>

            <div className="text-center space-y-4">
              <p>
                <b>Un réseau solide</b> : rencontrer d'autres organisations, échanger des idées, créer des partenariats.
              </p>
            </div>

            <div className="text-center space-y-4">
              <p>
                <b>Plus de visibilité</b> : faire connaître vos actions auprès des partenaires et des institutions.
              </p>
            </div>

            <div className="text-center space-y-4">
              <p>
                <b>Comment les OSC ont un rôle actif</b> : participer aux décisions locales et aux initiatives citoyennes.
              </p>
            </div>
            <div className="text-center space-y-4">
              <p>
                <b>Un appui officiel</b> : être reconnu et soutenu dans vos démarches administratives.
              </p>
            </div>
          </div>

          <p className="text-center mb-12 max-w-2xl mx-auto mt-6">
            En devenant membre, votre organisation gagne en <b>force, en compétences et en reconnaissance</b> pour mieux agir dans la communauté.
          </p>

        </div>
      </div>
    </section>
  );
}
