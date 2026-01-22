"use client";

import { use, useState, useEffect } from "react";
import { offreProjet, IOffreProjet } from "@/localdata/offreProjetData";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Users,
  CheckCircle,
  Calendar,
  Share2,
  Link as LinkIcon,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Award,
  FileText
} from "lucide-react";

export default function PageDetailOffreProjet({
  params,
}: {
  params: Promise<{ projetSlug: string }>;
}) {
  const resolvedParams = use(params);
  const projetSlug = resolvedParams.projetSlug;
  const [projet, setProjet] = useState<IOffreProjet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trouver le projet par slug
    const foundProjet = offreProjet.find((p) => p.slug === projetSlug);
    setProjet(foundProjet || null);
    setLoading(false);
  }, [projetSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05017] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!projet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins">
        <div className="text-center">
          <Target className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Projet non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            Ce projet n'existe pas ou a été retiré.
          </p>
          <Link
            href="/offre-projets"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      {/* Header avec image de couverture */}
      <div className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src={projet.image || "/images/placeholder.jpg"}
          alt={projet.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/offre-projets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-900 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Link>
        </div>

        {/* Titre sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#2a591d] text-white text-sm font-bold px-3 py-1 rounded-full">
                {projet.domaine}
              </span>
              <span className="bg-[#E05017] text-white text-sm font-bold px-3 py-1 rounded-full">
                {projet.statut}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {projet.nom}
            </h1>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Informations rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
            <Building2 className="w-8 h-8 text-[#E05017] mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">OSC Porteuse</p>
            <p className="font-bold text-sm">{projet.osc}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
            <MapPin className="w-8 h-8 text-[#E05017] mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Zone</p>
            <p className="font-bold text-sm">{projet.zone}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
            <Clock className="w-8 h-8 text-[#E05017] mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Durée</p>
            <p className="font-bold text-sm">{projet.durée}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
            <DollarSign className="w-8 h-8 text-[#E05017] mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Budget</p>
            <p className="font-bold text-sm">{projet.budget}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Objectif */}
            <section className="bg-gradient-to-br from-[#2a591d] to-[#1f4416] rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Objectif du projet</h2>
              </div>
              <p className="text-white/90 text-lg leading-relaxed">
                {projet.objectif}
              </p>
            </section>

            {/* Description */}
            {projet.description && (
              <section className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-[#E05017]" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Description
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {projet.description}
                </p>
              </section>
            )}

            {/* Contexte */}
            {projet.contexte && (
              <section className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-[#E05017]" />
                  <h2 className="text-2xl font-bold text-gray-900">Contexte</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{projet.contexte}</p>
              </section>
            )}

            {/* Bénéficiaires */}
            {projet.beneficiaires && (
              <section className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-[#E05017]" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Bénéficiaires
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {projet.beneficiaires}
                </p>
              </section>
            )}

            {/* Résultats attendus */}
            {projet.resultats_attendus && projet.resultats_attendus.length > 0 && (
              <section className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-[#E05017]" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Résultats attendus
                  </h2>
                </div>
                <ul className="space-y-3">
                  {projet.resultats_attendus.map((resultat, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2a591d] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{resultat}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Partenaires */}
            {projet.partenaires && projet.partenaires.length > 0 && (
              <section className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[#E05017]" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Partenaires actuels
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projet.partenaires.map((partenaire, index) => (
                    <span
                      key={index}
                      className="bg-[#E05017]/10 text-[#E05017] px-4 py-2 rounded-lg font-semibold text-sm"
                    >
                      {partenaire}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations complémentaires */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Informations complémentaires
              </h3>

              <div className="space-y-4">
                {projet.date_publication && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date de publication
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(projet.date_publication)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      OSC Porteuse
                    </p>
                    <p className="text-sm text-gray-600">{projet.osc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Zone d'intervention
                    </p>
                    <p className="text-sm text-gray-600">{projet.zone}</p>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
                  <Share2 className="w-5 h-5" />
                  Partager le projet
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#E05017] text-[#E05017] rounded-lg hover:bg-[#E05017]/5 transition-colors font-bold">
                  <FileText className="w-5 h-5" />
                  Télécharger le dossier
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-[#2a591d] to-[#1f4416] rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Intéressé par ce projet ?</h3>
              <p className="text-white/90 text-sm mb-4">
                Contactez l'OSC porteuse pour plus d'informations ou pour explorer des opportunités de partenariat.
              </p>
              <Link
                href={`/contact?projet=${projet.nom}&osc=${projet.osc}`}
                className="block w-full text-center px-4 py-3 bg-white text-[#2a591d] rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                Contacter l'OSC
              </Link>
            </div>
          </div>
        </div>

        {/* Projets similaires */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Projets similaires
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offreProjet
              .filter(
                (p) =>
                  p.id !== projet.id &&
                  (p.domaine === projet.domaine || p.zone === projet.zone)
              )
              .slice(0, 3)
              .map((projetSimilaire) => (
                <Link
                  key={projetSimilaire.id}
                  href={`/offre-projets/${projetSimilaire.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      <ImageWithFallback
                        src={projetSimilaire.image || "/images/placeholder.jpg"}
                        alt={projetSimilaire.nom}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-bold text-[#2a591d] bg-[#2a591d]/10 px-2 py-1 rounded">
                        {projetSimilaire.domaine}
                      </span>
                      <h3 className="font-bold text-base mt-2 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                        {projetSimilaire.nom}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {projetSimilaire.zone}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
