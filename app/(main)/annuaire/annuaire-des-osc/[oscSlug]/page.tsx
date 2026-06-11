/* app/(main)/annuaire/annuaire-des-osc/[oscSlug]/page.tsx */
"use client";

import { use, useState, useEffect } from 'react';
import { getOscBySlug } from "@/lib/fetch-crasc";
import { IOscDetail } from "@/types/api.types";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import {
  MapPin, Mail, Phone, Globe, Users2, Building, Calendar,
  Loader2, UserCircle, Briefcase, Target, Star, ChevronRight,
  Hash, Flag, BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import OscEvaluationBadge from '@/components/osc/OscEvaluationBadge';

function fmt(n?: number | null) {
  if (n == null) return null;
  return n.toLocaleString('fr-FR');
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-gray-600">{value}</p>
      </div>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span className="inline-block px-3 py-1 bg-[#2a591d]/10 text-[#2a591d] rounded-full text-xs font-medium">
      {text}
    </span>
  );
}

export default function OSCDetailPage({ params }: { params: Promise<{ oscSlug: string }> }) {
  const resolvedParams = use(params);
  const oscSlug = resolvedParams.oscSlug;
  const [oscData, setOscData] = useState<IOscDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!oscSlug) return;
    let isCurrent = true;
    getOscBySlug(oscSlug)
      .then((data) => { if (isCurrent) setOscData(data); })
      .catch(() => { if (isCurrent) setOscData(null); })
      .finally(() => { if (isCurrent) setLoading(false); });
    return () => { isCurrent = false; };
  }, [oscSlug]);

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

  if (!oscData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center">
          <Users2 className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">OSC non trouvée</h2>
          <p className="text-gray-600 mb-6">Cette organisation n'existe pas ou a été supprimée.</p>
          <Link href="/annuaire/annuaire-des-osc" className="inline-block px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors">
            Retour à l'annuaire
          </Link>
        </div>
      </div>
    );
  }

  /* Domaines prioritaires — depuis les pôles many-to-many */
  const domaines = oscData.poles && oscData.poles.length > 0
    ? oscData.poles.map(p => p.name)
    : [oscData.domaine_prioritaire, oscData.domaine_prioritaire_2, oscData.domaine_prioritaire_3, oscData.domaine_prioritaire_4].filter(Boolean) as string[];

  /* Sources de financement actives */
  const financements: string[] = [];
  if (oscData.financement_cotisation) financements.push("Cotisations");
  if (oscData.financement_dons) financements.push("Dons");
  if (oscData.financement_legs) financements.push("Legs");
  if (oscData.financement_collectivites) financements.push("Collectivités");
  if (oscData.financement_fonds_propres) financements.push("Fonds propres");
  if (oscData.financement_ong_intl) financements.push("ONG internationales");
  if (oscData.financement_multilateral) financements.push("Fonds multilatéraux");

  /** Initiales de l'OSC (max 2 mots) */
  const initiales = oscData.name
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <section className="pb-12 font-poppins">

      {/* Bannière : image réelle ou bannière de couleur */}
      {oscData.thumbnail_url ? (
        <div className="relative h-56 md:h-72 overflow-hidden">
          <ImageWithFallback src={oscData.thumbnail_url} alt={oscData.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div className="relative h-40 md:h-52 bg-gradient-to-br from-[#052838] to-[#0a4060] flex items-end">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #E05017 0%, transparent 60%), radial-gradient(circle at 80% 20%, #2a591d 0%, transparent 50%)" }}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Avatar : image ou initiales */}
            <div className="flex-shrink-0">
              {oscData.thumbnail_url ? (
                <div className="w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-md">
                  <ImageWithFallback src={oscData.thumbnail_url} alt={oscData.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-xl border-4 border-white shadow-md bg-[#052838] flex items-center justify-center">
                  <span className="text-white text-3xl font-extrabold tracking-wide">{initiales}</span>
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div className="flex-1">
              <div className="mb-3">
                <OscEvaluationBadge
                  score={oscData.score_autoevaluation}
                  color={oscData.couleur_autoevaluation}
                  hex={oscData.couleur_autoevaluation_hex}
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{oscData.name}</h1>
              {oscData.categorie && (
                <span className="inline-block px-3 py-0.5 bg-[#E05017]/10 text-[#E05017] rounded-md text-xs font-semibold mb-3">
                  {oscData.categorie}
                </span>
              )}
              {oscData.description && (
                <p className="text-gray-600 text-sm mb-4 max-w-2xl">{oscData.description}</p>
              )}

              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {domaines.length > 0 && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <Building className="w-4 h-4 text-[#E05017] mt-0.5 flex-shrink-0" />
                    <span><span className="font-semibold">Domaine :</span> {domaines[0]}{domaines.length > 1 ? ` (+${domaines.length - 1})` : ""}</span>
                  </div>
                )}
                {(oscData.ville || oscData.crasc?.name) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                    <span><span className="font-semibold">Localisation :</span> {[oscData.ville, oscData.crasc?.name].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {oscData.date_creation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                    <span><span className="font-semibold">Création :</span> {oscData.date_creation}</span>
                  </div>
                )}
                {oscData.nb_membres != null && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users2 className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                    <span><span className="font-semibold">Membres :</span> {fmt(oscData.nb_membres)}</span>
                  </div>
                )}
                {oscData.niveau_couverture && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Flag className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                    <span><span className="font-semibold">Couverture :</span> {oscData.niveau_couverture}</span>
                  </div>
                )}
                {oscData.numero_recepisse && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                    <span><span className="font-semibold">N° récépissé :</span> {oscData.numero_recepisse}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Colonne gauche */}
          <div className="md:col-span-2 space-y-6">

            {/* Statistiques clés */}
            {(oscData.nb_membres != null || oscData.nb_femmes_membres != null || oscData.nb_membres_jeunes != null || oscData.nb_beneficiaires != null || oscData.nb_activites != null || oscData.nb_personnes_engagees != null) && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Chiffres clés</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {oscData.nb_membres != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#E05017]">{fmt(oscData.nb_membres)}</p>
                      <p className="text-xs text-gray-500 mt-1">Membres</p>
                    </div>
                  )}
                  {oscData.nb_femmes_membres != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#2a591d]">{fmt(oscData.nb_femmes_membres)}</p>
                      <p className="text-xs text-gray-500 mt-1">Femmes membres</p>
                    </div>
                  )}
                  {oscData.nb_membres_jeunes != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#052838]">{fmt(oscData.nb_membres_jeunes)}</p>
                      <p className="text-xs text-gray-500 mt-1">Membres jeunes</p>
                    </div>
                  )}
                  {oscData.nb_beneficiaires != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#E05017]">{fmt(oscData.nb_beneficiaires)}</p>
                      <p className="text-xs text-gray-500 mt-1">Bénéficiaires</p>
                    </div>
                  )}
                  {oscData.nb_activites != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#2a591d]">{fmt(oscData.nb_activites)}</p>
                      <p className="text-xs text-gray-500 mt-1">Activités réalisées</p>
                    </div>
                  )}
                  {oscData.nb_personnes_engagees != null && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#052838]">{fmt(oscData.nb_personnes_engagees)}</p>
                      <p className="text-xs text-gray-500 mt-1">Personnes engagées</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Domaines prioritaires */}
            {domaines.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Domaines prioritaires</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {domaines.map((d, i) => <Tag key={i} text={d} />)}
                </div>
              </div>
            )}

            {/* Secteurs d'activités */}
            {oscData.secteurs_activites && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Secteurs d&apos;activités</h2>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{oscData.secteurs_activites}</p>
              </div>
            )}

            {/* Populations cibles */}
            {oscData.populations_cibles && (
              <div className="bg-[#f0f9ff] border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users2 className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Populations cibles</h2>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{oscData.populations_cibles}</p>
              </div>
            )}

            {/* Savoir-faire */}
            {oscData.savoir_faire && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Savoir-faire &amp; expertise</h2>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{oscData.savoir_faire}</p>
              </div>
            )}

            {/* Zone de couverture */}
            {oscData.zone_couverture && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Zone de couverture</h2>
                </div>
                <p className="text-sm text-gray-700">{oscData.zone_couverture}</p>
              </div>
            )}

            {/* Financement */}
            {(financements.length > 0 || oscData.budget_annuel != null || oscData.type_financement) && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#E05017]" />
                  <h2 className="text-lg font-bold text-gray-900">Financement</h2>
                </div>
                {oscData.budget_annuel != null && (
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-semibold">Budget annuel :</span> {fmt(oscData.budget_annuel)} F CFA
                  </p>
                )}
                {financements.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Sources de financement :</p>
                    <div className="flex flex-wrap gap-2">
                      {financements.map((f, i) => <Tag key={i} text={f} />)}
                    </div>
                  </div>
                )}
                {oscData.type_financement && (
                  <p className="text-sm text-gray-600 mt-2">{oscData.type_financement}</p>
                )}
              </div>
            )}
          </div>

          {/* Colonne droite — Contact & Gouvernance */}
          <div className="space-y-6">

            {/* Contact */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-4">

                {/* Président */}
                {oscData.nom_president && (
                  <div className="flex items-start gap-3">
                    <UserCircle className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Président(e)</p>
                      <p className="text-sm text-gray-600">{oscData.nom_president}</p>
                      {oscData.mode_designation_president && (
                        <p className="text-xs text-gray-400 mt-0.5">{oscData.mode_designation_president}</p>
                      )}
                    </div>
                  </div>
                )}

                {oscData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adresse</p>
                      <p className="text-sm text-gray-600">{oscData.address}</p>
                    </div>
                  </div>
                )}

                {oscData.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <a href={`mailto:${oscData.email}`} className="text-sm text-[#E05017] hover:underline break-all">
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
                        href={oscData.website.startsWith("http") ? oscData.website : `https://${oscData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#E05017] hover:underline break-all"
                      >
                        {oscData.website}
                      </a>
                    </div>
                  </div>
                )}

                {oscData.reseaux_sociaux && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#E05017] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Réseaux sociaux</p>
                      <p className="text-sm text-gray-600 break-all">{oscData.reseaux_sociaux}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Gouvernance complémentaire */}
              {(oscData.duree_mandat_be || oscData.nb_membres_be != null || oscData.etat_cotisations) && (
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                  <h4 className="text-sm font-bold text-gray-700">Gouvernance</h4>
                  <InfoRow label="Durée du mandat BE" value={oscData.duree_mandat_be} />
                  {oscData.nb_membres_be != null && (
                    <InfoRow label="Membres du bureau exécutif" value={String(oscData.nb_membres_be)} />
                  )}
                  <InfoRow label="État des cotisations" value={oscData.etat_cotisations} />
                  {oscData.reseau_appartenance && (
                    <InfoRow label="Réseau d'appartenance" value={oscData.reseau_appartenance} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Retour */}
        <div className="mt-12 text-center">
          <Link href="/annuaire/annuaire-des-osc" className="inline-flex items-center gap-2 text-[#E05017] hover:underline font-semibold text-sm">
            <ChevronRight className="w-4 h-4 rotate-180" /> Retour à l'annuaire des OSC
          </Link>
        </div>
      </div>
    </section>
  );
}
