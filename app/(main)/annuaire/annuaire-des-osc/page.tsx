"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Users2, Building } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from 'next/link';

interface IOSC {
  id: number;
  name: string;
  logo?: string;
  description: string;
  domaine: string;
  region: string;
  ville: string;
  email?: string;
  phone?: string;
  slug: string;
}

// Mock data - À remplacer par un vrai fetch API
const mockOSCs: IOSC[] = [
  {
    id: 1,
    name: "Mouvement Pour Lutte contre l'injustice (MPLCI)",
    logo: "/images/page-annuaire-crasc/mplci.jpg",
    description: "Organisation engagée dans la promotion de la justice sociale et la défense des droits humains en Côte d'Ivoire.",
    domaine: "Droits Humains",
    region: "CRASC Sud",
    ville: "Abidjan",
    email: "contact@mplci.org",
    phone: "+225 07 00 00 00",
    slug: "mplci"
  },
  {
    id: 2,
    name: "Fédération des femmes d'Anyama et de Brofodoumé (FEFAB)",
    logo: "/images/page-annuaire-crasc/fefab.jpg",
    description: "Fédération qui œuvre pour l'autonomisation des femmes et le développement communautaire.",
    domaine: "Genre et Développement",
    region: "CRASC Sud",
    ville: "Anyama",
    email: "contact@fefab.org",
    phone: "+225 07 11 11 11",
    slug: "fefab"
  },
  {
    id: 3,
    name: "Fondation Vie",
    logo: "/images/page-annuaire-crasc/fondation-vie.jpg",
    description: "Fondation dédiée à l'amélioration des conditions de vie des populations vulnérables.",
    domaine: "Santé et Bien-être",
    region: "CRASC Centre",
    ville: "Bouaké",
    email: "info@fondationvie.org",
    phone: "+225 07 22 22 22",
    slug: "fondation-vie"
  },
  {
    id: 4,
    name: "Association des Femmes Soutra",
    logo: "/images/page-annuaire-crasc/asso-femme-soutra.jpg",
    description: "Association qui promeut l'entrepreneuriat féminin et l'éducation des jeunes filles.",
    domaine: "Éducation et Entrepreneuriat",
    region: "CRASC Ouest",
    ville: "Daloa",
    email: "contact@femmessoutra.org",
    phone: "+225 07 33 33 33",
    slug: "femmes-soutra"
  }
];

const domaines = [
  "Tous les domaines",
  "Droits Humains",
  "Genre et Développement",
  "Santé et Bien-être",
  "Éducation et Entrepreneuriat",
  "Agriculture",
  "Environnement",
  "Jeunesse"
];

const regions = [
  "Toutes les régions",
  "CRASC Sud",
  "CRASC Centre",
  "CRASC Nord",
  "CRASC Ouest",
  "CRASC Est"
];

export default function AnnuaireOSCPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('Tous les domaines');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [oscData, setOscData] = useState<IOSC[]>(mockOSCs);
  const [filteredOSCs, setFilteredOSCs] = useState<IOSC[]>(mockOSCs);

  // Filter OSCs based on search and filters
  useEffect(() => {
    let filtered = oscData;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(osc =>
        osc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        osc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        osc.ville.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Domaine filter
    if (selectedDomaine !== 'Tous les domaines') {
      filtered = filtered.filter(osc => osc.domaine === selectedDomaine);
    }

    // Region filter
    if (selectedRegion !== 'Toutes les régions') {
      filtered = filtered.filter(osc => osc.region === selectedRegion);
    }

    setFilteredOSCs(filtered);
  }, [searchQuery, selectedDomaine, selectedRegion, oscData]);

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg p-8 mb-10">
        <div className="pb-6">
          <h2 className="text-[#2a591d] font-bold text-3xl pb-2">Annuaire des OSC</h2>
          <p className="mb-3">
            Découvrez les Organisations de la Société Civile (OSC) membres des CRASC à travers toute la Côte d'Ivoire.
            Cet annuaire vous permet d'identifier des partenaires potentiels pour vos projets et initiatives.
          </p>
          <p className="mb-3">
            Utilisez les filtres ci-dessous pour rechercher des OSC par domaine d'intervention, région ou nom.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300 text-center">
            <div className="text-4xl text-[#2a591d] font-bold mb-2">{oscData.length}</div>
            <div className="text-sm text-gray-600 font-semibold">OSC ENREGISTRÉES</div>
          </div>
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300 text-center">
            <div className="text-4xl text-[#2a591d] font-bold mb-2">{domaines.length - 1}</div>
            <div className="text-sm text-gray-600 font-semibold">DOMAINES D'INTERVENTION</div>
          </div>
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300 text-center">
            <div className="text-4xl text-[#2a591d] font-bold mb-2">5</div>
            <div className="text-sm text-gray-600 font-semibold">RÉGIONS COUVERTES</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une OSC par nom, domaine ou ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Domaine d'intervention
              </label>
              <select
                value={selectedDomaine}
                onChange={(e) => setSelectedDomaine(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              >
                {domaines.map((domaine) => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Région CRASC
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* OSC List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl">
            {filteredOSCs.length} OSC{filteredOSCs.length > 1 ? 's' : ''} trouvée{filteredOSCs.length > 1 ? 's' : ''}
          </h2>
        </div>

        {filteredOSCs.length === 0 ? (
          <div className="text-center py-16">
            <Users2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-gray-500 mb-2">Aucune OSC trouvée</p>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOSCs.map((osc) => (
              <Link key={osc.id} href={`/annuaire/annuaire-des-osc/${osc.slug}`}>
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer group">
                  <div className="flex gap-4 p-5">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <ImageWithFallback
                          src={osc.logo || "/images/default-osc-logo.png"}
                          alt={osc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E05017] transition-colors line-clamp-2">
                        {osc.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {osc.description}
                      </p>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="w-4 h-4 flex-shrink-0" />
                          <span className="font-semibold text-[#2a591d]">{osc.domaine}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{osc.ville}, {osc.region}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-4">
                    <div className="text-[#E05017] text-sm font-semibold group-hover:underline">
                      Voir les détails →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
        <div className="bg-[#E05017] rounded-lg py-12 px-8 text-center text-white">
          <h3 className="font-bold text-3xl mb-4">Votre OSC n'est pas listée ?</h3>
          <p className="max-w-2xl mx-auto mb-6">
            Rejoignez le réseau des CRASC pour bénéficier d'un accompagnement personnalisé et apparaître dans cet annuaire.
          </p>
          <Link
            href="/rejoindre"
            className="inline-block px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#E05017] rounded-lg transition-colors font-semibold"
          >
            Rejoignez-nous
          </Link>
        </div>
      </div>

    </section>
  );
}
