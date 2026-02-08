"use client";

import React, { use, useState, useEffect } from "react";
import { IPTF } from '@/types/api.types';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Building2,
  Calendar,
  Users,
  Target,
  ArrowRight,
  ExternalLink,
  FileText,
  Clock,
  NotepadText,
  Loader2
} from 'lucide-react';

// Mock data complet pour les PTF
const mockPTFDetails: Record<string, any> = {
  "banque-mondiale": {
    id: "1",
    name: "Banque Mondiale",
    slug: "banque-mondiale",
    description: "Institution financière internationale qui fournit des prêts et des dons aux gouvernements des pays en développement pour des projets de développement.",
    logo_url: "/images/partenaires/banque-mondiale.png",
    thumbnail_url: "/images/partenaires/banque-mondiale.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Mettre fin à l'extrême pauvreté et promouvoir une prospérité partagée de manière durable dans les pays en développement.",
    vision: "Un monde sans pauvreté où tous les êtres humains peuvent réaliser leur potentiel.",
    website: "www.worldbank.org",
    email: "contact@worldbank.org",
    phone: "+1 202 473 1000",
    address: "1818 H Street NW, Washington DC",
    pays: "International",
    date_creation: "1944",
    domaines: [
      "Réduction de la pauvreté",
      "Infrastructure et développement urbain",
      "Éducation et santé",
      "Agriculture et sécurité alimentaire",
      "Gouvernance et institutions"
    ],
    projets: [
      {
        id: "1",
        name: "Projet d'Infrastructure Urbaine",
        montant: "150 millions USD",
        periode: "2020-2025"
      },
      {
        id: "2",
        name: "Programme de Développement Rural",
        montant: "80 millions USD",
        periode: "2021-2024"
      },
      {
        id: "3",
        name: "Projet d'Amélioration de l'Éducation",
        montant: "100 millions USD",
        periode: "2022-2026"
      }
    ],
    appels_propositions: [
      {
        id: "1",
        titre: "Appel à propositions - Infrastructure routière durable",
        description: "Recherche d'organisations pour des projets d'infrastructure routière en zone rurale.",
        date_limite: "2026-03-15",
        budget: "50 millions USD"
      },
      {
        id: "2",
        titre: "Financement de projets éducatifs innovants",
        description: "Soutien aux initiatives visant à améliorer l'accès à l'éducation de qualité.",
        date_limite: "2026-04-30",
        budget: "25 millions USD"
      }
    ]
  },
  "union-europeenne": {
    id: "2",
    name: "Union Européenne",
    slug: "union-europeenne",
    description: "Principal partenaire de développement de la Côte d'Ivoire, soutenant la gouvernance, l'éducation et le développement économique.",
    logo_url: "/images/partenaires/union-europeenne.png",
    thumbnail_url: "/images/partenaires/union-europeenne.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Promouvoir la paix, les valeurs et le bien-être de ses peuples tout en soutenant le développement durable dans le monde.",
    vision: "Une Europe unie dans la diversité, solidaire et prospère, acteur clé du développement mondial.",
    website: "www.europa.eu",
    email: "delegation-ci@eeas.europa.eu",
    phone: "+225 27 22 49 20 00",
    address: "Abidjan, Plateau",
    pays: "Europe",
    date_creation: "1957",
    domaines: [
      "Gouvernance et État de droit",
      "Développement humain",
      "Commerce et intégration régionale",
      "Infrastructure et énergie",
      "Sécurité alimentaire"
    ],
    projets: [
      {
        id: "1",
        name: "Programme d'Appui à la Gouvernance",
        montant: "200 millions EUR",
        periode: "2021-2027"
      },
      {
        id: "2",
        name: "Projet Routes et Infrastructures",
        montant: "120 millions EUR",
        periode: "2020-2025"
      }
    ],
    appels_propositions: [
      {
        id: "1",
        titre: "Appel à propositions - Renforcement de la société civile",
        description: "Financement d'initiatives pour renforcer les capacités des OSC locales.",
        date_limite: "2026-02-28",
        budget: "30 millions EUR"
      }
    ]
  },
  "unicef": {
    id: "3",
    name: "UNICEF",
    slug: "unicef",
    description: "Fonds des Nations Unies pour l'enfance, œuvrant pour la protection des droits des enfants et l'amélioration de leurs conditions de vie.",
    logo_url: "/images/partenaires/unicef.png",
    thumbnail_url: "/images/partenaires/unicef.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Défendre les droits de chaque enfant, partout dans le monde, en particulier les plus défavorisés.",
    vision: "Un monde où les droits de chaque enfant sont respectés et où chaque enfant peut réaliser son plein potentiel.",
    website: "www.unicef.org",
    email: "abidjan@unicef.org",
    phone: "+225 27 22 40 31 20",
    address: "Abidjan, Cocody",
    pays: "International",
    date_creation: "1946",
    domaines: [
      "Santé et nutrition",
      "Éducation",
      "Protection de l'enfance",
      "Eau, hygiène et assainissement",
      "Inclusion sociale"
    ],
    projets: [
      {
        id: "1",
        name: "Programme Éducation pour Tous",
        montant: "50 millions USD",
        periode: "2020-2024"
      },
      {
        id: "2",
        name: "Projet Santé Maternelle et Infantile",
        montant: "35 millions USD",
        periode: "2021-2025"
      }
    ],
    appels_propositions: [
      {
        id: "1",
        titre: "Appel à propositions - Protection de l'enfance",
        description: "Recherche de partenaires pour renforcer les systèmes de protection des enfants vulnérables.",
        date_limite: "2026-05-15",
        budget: "15 millions USD"
      }
    ]
  },
  "usaid": {
    id: "4",
    name: "USAID",
    slug: "usaid",
    description: "Agence des États-Unis pour le développement international, promouvant la croissance économique, la santé et la démocratie.",
    logo_url: "/images/partenaires/usaid.png",
    thumbnail_url: "/images/partenaires/usaid.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Promouvoir et démontrer les valeurs démocratiques à l'étranger et faire progresser un monde libre, pacifique et prospère.",
    vision: "Un monde où tous les peuples peuvent réaliser leur potentiel dans des sociétés démocratiques et prospères.",
    website: "www.usaid.gov",
    email: "info@usaid.gov",
    phone: "+225 27 22 49 40 00",
    address: "Abidjan, Plateau",
    pays: "États-Unis",
    date_creation: "1961",
    domaines: [
      "Santé mondiale",
      "Démocratie et gouvernance",
      "Croissance économique",
      "Éducation",
      "Environnement"
    ],
    projets: [],
    appels_propositions: [
      {
        id: "1",
        titre: "Appel à propositions - Santé publique et VIH/SIDA",
        description: "Financement de programmes de prévention et de traitement du VIH/SIDA.",
        date_limite: "2026-04-10",
        budget: "40 millions USD"
      }
    ]
  },
  "afd": {
    id: "5",
    name: "AFD",
    slug: "afd",
    description: "Agence Française de Développement, accompagnant les projets de développement durable et de lutte contre la pauvreté.",
    logo_url: "/images/partenaires/afd.png",
    thumbnail_url: "/images/partenaires/afd.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Mettre en œuvre la politique de développement de la France et contribuer aux Objectifs de développement durable.",
    vision: "Un monde commun où le développement soit durable, solidaire et respectueux de la planète.",
    website: "www.afd.fr",
    email: "afdabidjan@afd.fr",
    phone: "+225 27 20 25 25 00",
    address: "Abidjan, Plateau",
    pays: "France",
    date_creation: "1941",
    domaines: [
      "Transition énergétique",
      "Biodiversité",
      "Éducation et formation",
      "Santé",
      "Développement urbain"
    ],
    projets: []
  },
  "giz": {
    id: "6",
    name: "GIZ",
    slug: "giz",
    description: "Coopération allemande pour le développement, soutenant les projets de formation professionnelle et de gouvernance.",
    logo_url: "/images/partenaires/giz.png",
    thumbnail_url: "/images/partenaires/giz.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Soutenir le gouvernement allemand dans la réalisation de ses objectifs en matière de coopération internationale pour le développement durable.",
    vision: "Un monde avec des perspectives d'avenir pour tous, où le développement durable est une réalité.",
    website: "www.giz.de",
    email: "giz-ci@giz.de",
    phone: "+225 27 22 40 29 29",
    address: "Abidjan, Cocody",
    pays: "Allemagne",
    date_creation: "2011",
    domaines: [
      "Formation professionnelle",
      "Gouvernance locale",
      "Environnement et climat",
      "Développement économique",
      "Énergie durable"
    ],
    projets: []
  },
  "koica": {
    id: "7",
    name: "KOICA",
    slug: "koica",
    description: "Agence coréenne de coopération internationale, investissant dans l'éducation, la santé et les infrastructures.",
    logo_url: "/images/partenaires/koica.png",
    thumbnail_url: "/images/partenaires/koica.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Contribuer au développement durable et à l'amélioration de la qualité de vie dans les pays en développement.",
    vision: "Un monde meilleur grâce à la coopération et au partage de l'expérience de développement de la Corée.",
    website: "www.koica.go.kr",
    email: "koica@koica.go.kr",
    phone: "+225 27 22 51 38 00",
    address: "Abidjan, Cocody",
    pays: "Corée du Sud",
    date_creation: "1991",
    domaines: [
      "Éducation",
      "Santé publique",
      "Technologies de l'information",
      "Développement rural",
      "Gouvernance publique"
    ],
    projets: []
  },
  "pnud": {
    id: "8",
    name: "PNUD",
    slug: "pnud",
    description: "Programme des Nations Unies pour le développement, appuyant la gouvernance démocratique et le développement durable.",
    logo_url: "/images/partenaires/pnud.png",
    thumbnail_url: "/images/partenaires/pnud.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Aider les pays à éliminer la pauvreté et à parvenir au développement durable en construisant leurs capacités nationales.",
    vision: "Un monde où chacun peut vivre dans la dignité et avoir la possibilité de réaliser son potentiel.",
    website: "www.undp.org",
    email: "registry.ci@undp.org",
    phone: "+225 27 20 29 96 00",
    address: "Abidjan, Plateau",
    pays: "International",
    date_creation: "1965",
    domaines: [
      "Gouvernance démocratique",
      "Réduction de la pauvreté",
      "Changement climatique",
      "Prévention des crises",
      "Énergie et environnement"
    ],
    projets: []
  },
  "jica": {
    id: "9",
    name: "JICA",
    slug: "jica",
    description: "Agence japonaise de coopération internationale, soutenant le développement des infrastructures et le renforcement des capacités.",
    logo_url: "/images/partenaires/jica.png",
    thumbnail_url: "/images/partenaires/jica.png",
    cover_url: "/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg",
    mission: "Contribuer à la promotion de la coopération internationale et à la croissance économique et au bien-être social des pays en développement.",
    vision: "Créer un monde inclusif, dynamique et pacifique grâce à la coopération pour le développement.",
    website: "www.jica.go.jp",
    email: "jicaci@jica.go.jp",
    phone: "+225 27 22 44 58 00",
    address: "Abidjan, Plateau",
    pays: "Japon",
    date_creation: "1974",
    domaines: [
      "Infrastructure de transport",
      "Eau et assainissement",
      "Agriculture",
      "Santé",
      "Éducation et formation technique"
    ],
    projets: []
  }
};

export default function PTFDetailPage({ params }: { params: Promise<{ ptfSlug: string }>; }) {
  const resolvedParams = use(params);
  const ptfSlug = resolvedParams.ptfSlug;
  const [ptfData, setPtfData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ptfSlug) return;

    const fetchPtf = async () => {
      try {
        setLoading(true);

        // Try to fetch from API
        const response = await fetch(`https://api.plateforme-osci.org/api/v1/ptf/${ptfSlug}`);
        if (response.ok) {
          const data = await response.json();
          setPtfData(data);
        } else {
          // Use mock data if API fails
          const mockData = mockPTFDetails[ptfSlug];
          if (mockData) {
            setPtfData(mockData);
          } else {
            setError("Partenaire non trouvé");
          }
        }
      } catch (err: any) {
        console.log("Erreur API, utilisation des données mock");
        const mockData = mockPTFDetails[ptfSlug];
        if (mockData) {
          setPtfData(mockData);
        } else {
          setError("Partenaire non trouvé");
        }
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
          <p className="text-gray-600 mb-6">Ce partenaire n'existe pas ou a été supprimé.</p>
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

  return (
    <section className="pb-10 font-poppins">

      {/* Cover Image */}
      {ptfData.cover_url && (
        <div className="relative h-64 md:h-80 overflow-hidden mb-8">
          <ImageWithFallback
            src={ptfData.cover_url}
            alt={ptfData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Logo and Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            {ptfData.thumbnail_url && (
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center p-4">
                  <ImageWithFallback
                    src={ptfData.thumbnail_url}
                    alt={ptfData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ptfData.name}</h1>
              <p className="text-gray-600 mb-4">{ptfData.description}</p>

{/*               <div className="grid md:grid-cols-2 gap-3 text-sm">
                {ptfData.pays && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-[#E05017]" />
                    <span><span className="font-semibold">Pays:</span> {ptfData.pays}</span>
                  </div>
                )}
                {ptfData.date_creation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-[#E05017]" />
                    <span><span className="font-semibold">Création:</span> {ptfData.date_creation}</span>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* Mission */}
            {ptfData.mission && (
              <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-[#E05017]" />
                  Mission
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ptfData.mission}</p>
              </div>
            )}

            {/* Vision */}
            {ptfData.vision && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Vision</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ptfData.vision}</p>
              </div>
            )}

            {/* Domaines d'intervention */}
            {((ptfData.domaines_list && ptfData.domaines_list.length > 0) || (ptfData.domaines && ptfData.domaines.length > 0)) && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Domaines d'intervention</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {(ptfData.domaines_list || ptfData.domaines).map((domaine: string, index: number) => (
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

            {/* Appels à propositions */}
            {ptfData.appels_propositions && ptfData.appels_propositions.length > 0 && (
              <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#E05017]" />
                  Appels à projets
                </h2>
                <div className="space-y-4">
                  {ptfData.appels_propositions.map((appel: any) => (
                    <div key={appel.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{appel.titre}</h3>
                      <p className="text-sm text-gray-700 mb-4">{appel.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                          {appel.budget && (
                            <span className="flex items-center gap-1 text-[#E05017] font-semibold">
                              <span>💰</span> {appel.budget}
                            </span>
                          )}
                          {appel.date_limite && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              Date limite: {new Date(appel.date_limite).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/contact?ptf=${ptfData.name}&appel=${appel.titre}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold text-sm whitespace-nowrap"
                        >
                          Postuler
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">

            {/* Contact Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h3>

              <div className="space-y-4">
                {ptfData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adresse</p>
                      <p className="text-sm text-gray-600">{ptfData.address}</p>
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
                        href={`${ptfData.website}`}
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
                {((ptfData.domaines_list && ptfData.domaines_list.length > 0) || (ptfData.domaines && ptfData.domaines.length > 0)) && (
                  <div className="flex items-start gap-3">
                    <NotepadText className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Domaines d'intervention</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(ptfData.domaines_list || ptfData.domaines).slice(0, 3).map((domaine: string, idx: number) => (
                          <span key={idx} className="text-xs bg-[#E05017]/10 text-[#E05017] px-2 py-1 rounded font-semibold">
                            {domaine}
                          </span>
                        ))}
                        {(ptfData.domaines_list || ptfData.domaines).length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{(ptfData.domaines_list || ptfData.domaines).length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              {/* <div className="mt-6">
                <Link
                  href={`/contact?ptf=${ptfData.name}`}
                  className="block w-full text-center px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold"
                >
                  Contacter le PTF
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* Back to Directory */}
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
