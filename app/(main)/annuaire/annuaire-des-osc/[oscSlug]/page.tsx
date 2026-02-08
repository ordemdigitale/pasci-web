"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { MapPin, Mail, Phone, Globe, Users2, Building, Calendar, Facebook, Linkedin, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface IOSCDetail {
  id: number;
  name: string;
  logo?: string;
  coverImage?: string;
  description: string;
  domaine: string;
  region: string;
  ville: string;
  adresse?: string;
  email?: string;
  phone?: string;
  website?: string;
  createdAt?: string;
  president?: string;
  nombreMembres?: number;
  mission?: string;
  vision?: string;
  objectifs?: string[];
  realisations?: string[];
  facebook?: string;
  linkedin?: string;
}

// Mock data - À remplacer par un vrai fetch API
const mockOSCData: Record<string, IOSCDetail> = {
  "mplci": {
    id: 1,
    name: "Mouvement Pour Lutte contre l'injustice (MPLCI)",
    logo: "/images/page-annuaire-crasc/mplci.jpg",
    coverImage: "/images/page-annuaire-crasc/mplci.jpg",
    description: "Organisation engagée dans la promotion de la justice sociale et la défense des droits humains en Côte d'Ivoire.",
    domaine: "Droits Humains",
    region: "CRASC Sud",
    ville: "Abidjan",
    adresse: "Cocody, Boulevard Latrille",
    email: "contact@mplci.org",
    phone: "+225 07 00 00 00",
    website: "www.mplci.org",
    createdAt: "2015",
    president: "Kouassi N'Guessan",
    nombreMembres: 150,
    mission: "Promouvoir la justice sociale et défendre les droits fondamentaux des citoyens ivoiriens à travers des actions de plaidoyer, de sensibilisation et d'accompagnement juridique.",
    vision: "Une société ivoirienne juste et équitable où chaque citoyen jouit pleinement de ses droits.",
    objectifs: [
      "Sensibiliser les populations sur leurs droits fondamentaux",
      "Accompagner les victimes d'injustice dans leurs démarches juridiques",
      "Mener des actions de plaidoyer auprès des autorités",
      "Former les jeunes leaders aux questions de gouvernance et de justice sociale"
    ],
    realisations: [
      "Organisation de 50+ sessions de sensibilisation sur les droits humains",
      "Accompagnement juridique de plus de 200 personnes",
      "Formation de 100 jeunes leaders aux questions de gouvernance"
    ],
    facebook: "https://facebook.com/mplci",
    linkedin: "https://linkedin.com/company/mplci"
  },
  "fefab": {
    id: 2,
    name: "Fédération des femmes d'Anyama et de Brofodoumé (FEFAB)",
    logo: "/images/page-annuaire-crasc/fefab.jpg",
    coverImage: "/images/page-annuaire-crasc/fefab.jpg",
    description: "Fédération qui œuvre pour l'autonomisation des femmes et le développement communautaire.",
    domaine: "Genre et Développement",
    region: "CRASC Sud",
    ville: "Anyama",
    adresse: "Anyama, Quartier Résidentiel",
    email: "contact@fefab.org",
    phone: "+225 07 11 11 11",
    createdAt: "2012",
    president: "Adjoua Koné",
    nombreMembres: 250,
    mission: "Promouvoir l'autonomisation économique et sociale des femmes à travers des programmes de formation, de micro-crédit et d'entrepreneuriat.",
    vision: "Des communautés où les femmes sont économiquement autonomes et socialement épanouies.",
    objectifs: [
      "Former les femmes aux métiers porteurs",
      "Faciliter l'accès au financement pour les projets féminins",
      "Renforcer le leadership féminin dans les communautés",
      "Lutter contre les violences basées sur le genre"
    ],
    realisations: [
      "Formation de 500+ femmes en entrepreneuriat",
      "Octroi de micro-crédits à 300 femmes entrepreneures",
      "Création de 5 coopératives féminines"
    ]
  },
  "fondation-vie": {
    id: 3,
    name: "Fondation Vie",
    logo: "/images/page-annuaire-crasc/fondation-vie.jpg",
    coverImage: "/images/page-annuaire-crasc/fondation-vie.jpg",
    description: "Organisation dédiée à l'amélioration des conditions de vie des communautés vulnérables.",
    domaine: "Développement Communautaire",
    region: "CRASC Centre",
    ville: "Yamoussoukro",
    adresse: "Yamoussoukro, Boulevard de la République",
    email: "contact@fondationvie.org",
    phone: "+225 07 22 22 22",
    website: "www.fondationvie.org",
    createdAt: "2010",
    president: "Jean-Baptiste Konan",
    nombreMembres: 180,
    mission: "Améliorer durablement les conditions de vie des populations vulnérables à travers des projets de développement communautaire intégrés.",
    vision: "Des communautés autonomes et résilientes où chaque individu a accès aux services de base et aux opportunités de développement.",
    objectifs: [
      "Améliorer l'accès à l'eau potable et à l'assainissement",
      "Renforcer la sécurité alimentaire des ménages",
      "Promouvoir l'éducation et la santé communautaire",
      "Développer des activités génératrices de revenus"
    ],
    realisations: [
      "Construction de 10 forages d'eau potable dans les villages",
      "Distribution de kits alimentaires à 500 familles",
      "Alphabétisation de 200 adultes",
      "Création de 3 jardins maraîchers communautaires"
    ],
    facebook: "https://facebook.com/fondationvie",
    linkedin: "https://linkedin.com/company/fondationvie"
  }
};

export default function OSCDetailPage() {
  const params = useParams();
  const oscSlug = params.oscSlug as string;
  const [oscData, setOscData] = useState<IOSCDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement des données
    // Remplacer par un vrai appel API
    setLoading(true);
    setTimeout(() => {
      const data = mockOSCData[oscSlug];
      setOscData(data || null);
      setLoading(false);
    }, 500);
  }, [oscSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!oscData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users2 className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">OSC non trouvée</h2>
          <p className="text-gray-600 mb-6">Cette organisation n'existe pas ou a été supprimée.</p>
          <Link
            href="/annuaire/annuaire-des-osc"
            className="inline-block px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors"
          >
            Retour à l'annuaire
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 font-poppins">

      {/* Cover Image */}
      {oscData.coverImage && (
        <div className="relative h-64 md:h-80 overflow-hidden mb-8">
          <ImageWithFallback
            src={oscData.coverImage}
            alt={oscData.name}
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
            {oscData.logo && (
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                  <ImageWithFallback
                    src={oscData.logo}
                    alt={oscData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{oscData.name}</h1>
              <p className="text-gray-600 mb-4">{oscData.description}</p>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="w-4 h-4 text-[#E05017]" />
                  <span><span className="font-semibold">Domaine:</span> {oscData.domaine}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#E05017]" />
                  <span><span className="font-semibold">Localisation:</span> {oscData.ville}, {oscData.region}</span>
                </div>
                {oscData.createdAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-[#E05017]" />
                    <span><span className="font-semibold">Création:</span> {oscData.createdAt}</span>
                  </div>
                )}
                {oscData.nombreMembres && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users2 className="w-4 h-4 text-[#E05017]" />
                    <span><span className="font-semibold">Membres:</span> {oscData.nombreMembres}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* Mission */}
            {oscData.mission && (
              <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Mission</h2>
                <p className="text-gray-700">{oscData.mission}</p>
              </div>
            )}

            {/* Vision */}
           {/*  {oscData.vision && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Vision</h2>
                <p className="text-gray-700">{oscData.vision}</p>
              </div>
            )} */}

            {/* Objectifs */}
            {/* {oscData.objectifs && oscData.objectifs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Objectifs</h2>
                <ul className="space-y-3">
                  {oscData.objectifs.map((objectif, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#E05017] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{objectif}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* Réalisations */}
            {oscData.realisations && oscData.realisations.length > 0 && (
              <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Nos Réalisations</h2>
                <ul className="space-y-3">
                  {oscData.realisations.map((realisation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#E05017] text-xl">✓</span>
                      <span className="text-gray-700 pt-0.5">{realisation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">

            {/* Contact Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de Contact</h3>

              <div className="space-y-4">
                {oscData.adresse && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adresse</p>
                      <p className="text-sm text-gray-600">{oscData.adresse}</p>
                    </div>
                  </div>
                )}

                {oscData.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <a href={`mailto:${oscData.email}`} className="text-sm text-[#E05017] hover:underline">
                        {oscData.email}
                      </a>
                    </div>
                  </div>
                )}

                {oscData.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Téléphone</p>
                      <a href={`tel:${oscData.phone}`} className="text-sm text-[#E05017] hover:underline">
                        {oscData.phone}
                      </a>
                    </div>
                  </div>
                )}

                {oscData.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Site Web</p>
                      <a
                        href={`https://${oscData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#E05017] hover:underline"
                      >
                        {oscData.website}
                      </a>
                    </div>
                  </div>
                )}

                {oscData.president && (
                  <div className="flex items-start gap-3">
                    <Users2 className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Président(e)</p>
                      <p className="text-sm text-gray-600">{oscData.president}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {/* {(oscData.facebook || oscData.linkedin) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Suivez-nous</p>
                  <div className="flex gap-3">
                    {oscData.facebook && (
                      <a
                        href={oscData.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#E05017] hover:bg-[#c44315] rounded-full flex items-center justify-center transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {oscData.linkedin && (
                      <a
                        href={oscData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#E05017] hover:bg-[#c44315] rounded-full flex items-center justify-center transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              )} */}

              {/* Contact Button */}
              {/* <div className="mt-6">
                <Link
                  href={`/contact?osc=${oscData.name}`}
                  className="block w-full text-center px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold"
                >
                  Contacter l'OSC
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* Back to Directory */}
        <div className="mt-12 text-center">
          <Link
            href="/annuaire/annuaire-des-osc"
            className="inline-flex items-center gap-2 text-[#E05017] hover:underline font-semibold"
          >
            ← Retour à l'annuaire des OSC
          </Link>
        </div>
      </div>
    </section>
  );
}
