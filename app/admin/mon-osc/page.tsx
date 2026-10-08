"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/auth";
import { IOscDetail } from "@/types/api.types";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import OscEvaluationBadge from "@/components/osc/OscEvaluationBadge";
import OscBaremeDetail from "@/components/osc/OscBaremeDetail";
import {
  Edit3, Mail, Phone, MapPin, Globe, Users,
  Wallet, Target, BookOpen, Loader2, AlertCircle, ExternalLink,
  FileText, Award, Gauge, CalendarClock, Download, CheckCircle2, Clock,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FORMALISATION_OPTIONS = [
  { value: "statuts_reglement", label: "Statut et règlement intérieur" },
  { value: "recepisse_depot", label: "Récépissé de dépôt" },
  { value: "recepisse_declaration", label: "Récépissé de déclaration" },
  { value: "agrement_decret", label: "Agrément / décret" },
  { value: "journal_officiel", label: "Déclaration Journal Officiel de la République de Côte d'Ivoire" },
];

const formalisationLabel = (value?: string | null) =>
  FORMALISATION_OPTIONS.find((option) => option.value === value)?.label || value || null;

const formatDate = (valeur?: string | null) => {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime())
    ? valeur
    : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

/**
 * Complétude du profil : part des informations clés réellement renseignées.
 * Elle indique à l'OSC ce qu'il lui reste à remplir, là où le score de
 * notation ne juge que les cinq critères du barème.
 */
const CHAMPS_PROFIL: { cle: keyof IOscDetail; label: string }[] = [
  { cle: "description", label: "Description" },
  { cle: "email", label: "Email" },
  { cle: "contact_osc", label: "Contact de l'OSC" },
  { cle: "contact_president", label: "Contact du/de la président(e)" },
  { cle: "region_nom", label: "Région" },
  { cle: "sous_prefecture", label: "Sous-préfecture" },
  { cle: "address", label: "Adresse" },
  { cle: "date_creation", label: "Date de création" },
  { cle: "numero_recepisse", label: "N° de récépissé" },
  { cle: "nom_president", label: "Nom du/de la président(e)" },
  { cle: "nb_membres", label: "Nombre de membres" },
  { cle: "domaine_prioritaire", label: "Domaine prioritaire" },
  { cle: "axe", label: "Axe d'intervention" },
  { cle: "savoir_faire", label: "Savoir-faire" },
  { cle: "populations_cibles", label: "Populations cibles" },
  { cle: "thumbnail_url", label: "Logo" },
];

function Stat({ label, value, color }: { label: string; value?: string | number | null; color: string }) {
  return (
    <div className={`p-4 rounded-xl ${color}`}>
      <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}

export default function MonOscPage() {
  const { user } = useAuth();
  const [osc, setOsc] = useState<IOscDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.osc_id) {
      const timeout = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timeout);
    }
    fetchWithAuth(`${API_BASE}/api/v1/crasc/osc/me`)
      .then(r => {
        if (!r.ok) throw new Error("Impossible de charger les données de votre OSC.");
        return r.json();
      })
      .then(setOsc)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-10 h-10 animate-spin text-[#2A591D]" />
      </div>
    );
  }

  if (!user?.osc_id || error || !osc) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center font-poppins">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune OSC associée</h2>
        <p className="text-gray-500">{error || "Votre compte n'est pas encore rattaché à une OSC."}</p>
      </div>
    );
  }

  const localisation = [osc.region_nom, osc.sous_prefecture, osc.ville].filter(Boolean).join(" · ");
  const champsRenseignes = CHAMPS_PROFIL.filter((champ) => {
    const valeur = osc[champ.cle];
    return valeur !== null && valeur !== undefined && String(valeur).trim() !== "";
  });
  const champsManquants = CHAMPS_PROFIL.filter((champ) => !champsRenseignes.includes(champ));
  const completude = Math.round((champsRenseignes.length / CHAMPS_PROFIL.length) * 100);
  const justificatifs = [
    { label: "Document de formalisation", url: osc.document_formalisation_url },
    { label: "Plan d'action", url: osc.plan_action_document_url },
    { label: "Rapports annuels", url: osc.rapports_annuels_document_url },
    { label: "Adhésion au CRASC", url: osc.adhesion_crasc_document_url },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-poppins space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/20 flex-shrink-0">
            <ImageWithFallback
              src={osc.thumbnail_url}
              alt={osc.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-3 rounded-full bg-white inline-flex">
              <OscEvaluationBadge score={osc.score_autoevaluation} color={osc.couleur_autoevaluation} hex={osc.couleur_autoevaluation_hex} />
            </div>
            <h1 className="text-3xl font-extrabold mb-1">
              {osc.name}
              {osc.sigle && <span className="ml-2 text-lg font-semibold text-white/70">({osc.sigle})</span>}
            </h1>
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
              {osc.crasc && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {osc.crasc.name}
                </span>
              )}
              {localisation && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {localisation}</span>}
              {osc.type?.name && <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {osc.type.name}</span>}
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${
                osc.statut_publication === "publie" ? "bg-white/20 text-white" : "bg-amber-400/90 text-amber-950"
              }`}>
                {osc.statut_publication === "publie"
                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> Publiée dans l&apos;annuaire</>
                  : <><Clock className="w-3.5 h-3.5" /> En attente de validation</>}
              </span>
              {formatDate(osc.updated_at) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-semibold text-white/90">
                  <CalendarClock className="w-3.5 h-3.5" /> Mise à jour le {formatDate(osc.updated_at)}
                </span>
              )}
            </div>
            {osc.description && (
              <p className="text-white/90 text-sm line-clamp-2">{osc.description}</p>
            )}
          </div>
          <Link
            href="/admin/mon-osc/modifier"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2A591D] font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Modifier le profil
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complétude du profil : ce qui reste à renseigner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#2A591D]" /> Complétude du profil
              </h2>
              <span className="text-2xl font-extrabold tabular-nums text-[#2A591D]">{completude}%</span>
            </div>
            <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#2A591D] transition-all"
                style={{ width: `${completude}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {champsRenseignes.length} information{champsRenseignes.length > 1 ? "s" : ""} sur{" "}
              {CHAMPS_PROFIL.length} renseignée{champsRenseignes.length > 1 ? "s" : ""}.
            </p>
            {champsManquants.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">À compléter</p>
                <div className="flex flex-wrap gap-1.5">
                  {champsManquants.map((champ) => (
                    <span key={String(champ.cle)} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {champ.label}
                    </span>
                  ))}
                </div>
                <Link
                  href="/admin/mon-osc/modifier"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2A591D] hover:underline"
                >
                  <Edit3 className="w-4 h-4" /> Compléter mon profil
                </Link>
              </div>
            )}
          </div>

          {/* Détail du barème sur 20 points */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" /> Barème de notation sur 20 points
            </h2>
            <OscBaremeDetail osc={osc} />
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2A591D]" /> Membres &amp; activités
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Membres total" value={osc.nb_membres} color="bg-blue-50" />
              <Stat label="Femmes membres" value={osc.nb_femmes_membres} color="bg-pink-50" />
              <Stat label="Membres jeunes" value={osc.nb_membres_jeunes} color="bg-yellow-50" />
              <Stat label="Personnes engagées" value={osc.nb_personnes_engagees} color="bg-green-50" />
              <Stat label="Bénéficiaires" value={osc.nb_beneficiaires} color="bg-purple-50" />
              <Stat label="Activités réalisées" value={osc.nb_activites} color="bg-orange-50" />
            </div>
          </div>

          {/* Domaines / Pôles */}
          {((osc.poles && osc.poles.length > 0) || osc.secteurs_activites || osc.axe || osc.specialites) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" /> Domaines &amp; secteurs
              </h2>
              <div className="space-y-3">
                {osc.poles && osc.poles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {osc.poles.map(p => (
                      <span key={p.id} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                        {p.name}
                      </span>
                    ))}
                  </div>
                )}
                {osc.secteurs_activites && (
                  <p className="text-sm text-gray-700 mt-2">{osc.secteurs_activites}</p>
                )}
                <Info label="Axe d'intervention" value={osc.axe} />
                <Info label="Spécialités" value={osc.specialites} />
              </div>
            </div>
          )}

          {/* Gouvernance */}
          {osc.nom_president && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" /> Gouvernance
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Info label="Président(e)" value={osc.nom_president} />
                <Info label="Sexe" value={osc.sexe_president} />
                <Info label="Mode de désignation" value={osc.mode_designation_president} />
                <Info label="Durée du mandat BE" value={osc.duree_mandat_be} />
              </div>
            </div>
          )}

          {/* Financement */}
          {(osc.budget_annuel || osc.type_financement) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-700" /> Financement
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Info label="Budget annuel" value={osc.budget_annuel ? `${osc.budget_annuel.toLocaleString('fr-FR')} F CFA` : null} />
                <Info label="Type de financement" value={osc.type_financement} />
                <Info label="État des cotisations" value={osc.etat_cotisations} />
                <Info label="Montant cotisation" value={osc.montant_cotisation ? `${osc.montant_cotisation.toLocaleString('fr-FR')} F CFA` : null} />
              </div>
            </div>
          )}

          {/* Savoir-faire */}
          {(osc.savoir_faire || osc.populations_cibles) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Savoir-faire &amp; populations
              </h2>
              <div className="space-y-4">
                <Info label="Savoir-faire / expertise" value={osc.savoir_faire} />
                <Info label="Populations cibles" value={osc.populations_cibles} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2A591D]" /> Contact
            </h3>
            <div className="space-y-3">
              {osc.email && (
                <a href={`mailto:${osc.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Mail className="w-4 h-4" /> {osc.email}
                </a>
              )}
              {([
                { label: "Téléphone", valeur: osc.phone },
                { label: "Contact de l'OSC", valeur: osc.contact_osc },
                { label: "Contact du/de la président(e)", valeur: osc.contact_president },
                { label: "Contact 1", valeur: osc.contact_1 },
                { label: "Contact 2", valeur: osc.contact_2 },
              ] as const).map(({ label, valeur }) => valeur ? (
                <p key={label} className="flex items-start gap-2 text-sm text-gray-700">
                  <Phone className="mt-0.5 w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span>
                    <span className="block text-xs text-gray-400">{label}</span>
                    <a href={`tel:${valeur}`} className="hover:underline">{valeur}</a>
                  </span>
                </p>
              ) : null)}
              {localisation && (
                <p className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="mt-0.5 w-4 h-4 flex-shrink-0 text-gray-400" /> {localisation}
                </p>
              )}
              {osc.address && (
                <p className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="mt-0.5 w-4 h-4 flex-shrink-0 text-gray-400" /> {osc.address}
                </p>
              )}
              {osc.website && (
                <a href={osc.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Globe className="w-4 h-4" /> Site web
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Identité */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Identité juridique
            </h3>
            <div className="space-y-3">
              <Info label="Date de création" value={osc.date_creation} />
              <Info label="Type de document de formalisation" value={formalisationLabel(osc.type_document_formalisation)} />
              <Info label="Catégorie" value={osc.categorie} />
              <Info label="Niveau de couverture" value={osc.niveau_couverture} />
              <Info label="Zone de couverture" value={osc.zone_couverture} />
              <Info label="Niveau de regroupement" value={osc.niveau_regroupement} />
              <Info label="Réseau d'appartenance" value={osc.reseau_appartenance} />
            </div>
          </div>

          {/* Justificatifs : ce qui est effectivement déposé */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-700" /> Justificatifs déposés
            </h3>
            <div className="space-y-2">
              {justificatifs.map(({ label, url }) => (
                <div key={label} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-gray-700">{label}</span>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 hover:underline"
                    >
                      <Download className="h-3 w-3" /> Déposé
                    </a>
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
                      Manquant
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lien public */}
          <Link
            href={`/annuaire/annuaire-des-osc/${osc.slug}`}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-[#2A591D] text-[#2A591D] font-semibold rounded-xl hover:bg-[#2A591D] hover:text-white transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Voir le profil public
          </Link>
        </div>
      </div>
    </div>
  );
}
