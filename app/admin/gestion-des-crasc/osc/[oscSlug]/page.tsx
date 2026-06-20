"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, Globe, Tag, Trash2,
  Edit, AlertTriangle, Newspaper, Users, Wallet, Calendar, FileText,
  BarChart2, CheckCircle, XCircle, UserPlus, KeyRound, UserX,
} from "lucide-react";
import { getToken } from "@/lib/auth";

interface IOscDetail {
  id: number; name: string; slug: string;
  description: string | null; thumbnail_url: string; thumbnail_path: string;
  type?: { id: number; name: string; slug: string };
  crasc?: { id: number; name: string; slug: string };
  ville: string | null; email: string | null; phone: string | null;
  address: string | null; latitude: number | null; longitude: number | null;
  news_items?: Array<unknown>;
  // Champs complémentaires
  website?: string | null; reseaux_sociaux?: string | null;
  date_creation?: string | null; numero_recepisse?: string | null;
  type_document_formalisation?: string | null;
  document_formalisation_url?: string | null;
  plan_action_document_url?: string | null;
  rapports_annuels_document_url?: string | null;
  adhesion_crasc_document_url?: string | null;
  existence_siege?: boolean | null;
  manuel_procedures?: boolean | null;
  plan_action?: boolean | null;
  rapports_annuels?: boolean | null;
  niveau_couverture?: string | null; zone_couverture?: string | null;
  categorie?: string | null;
  domaine_prioritaire?: string | null; domaine_prioritaire_2?: string | null;
  domaine_prioritaire_3?: string | null; domaine_prioritaire_4?: string | null;
  domaine_prioritaire_5?: string | null;
  nb_membres?: number | null; nb_femmes_membres?: number | null;
  nb_membres_jeunes?: number | null; nb_membres_be?: number | null;
  nb_personnes_engagees?: number | null; nb_beneficiaires?: number | null;
  nb_activites?: number | null; budget_annuel?: number | null;
  type_financement?: string | null; etat_cotisations?: string | null;
  montant_cotisation?: number | null; sexe_president?: string | null;
  mode_designation_president?: string | null; duree_mandat_be?: string | null;
  nom_president?: string | null;
  adhesion_crasc?: boolean | null; adhesion_crasc_statut?: string | null; niveau_regroupement?: string | null; reseau_appartenance?: string | null;
  secteurs_activites?: string | null; populations_cibles?: string | null;
  savoir_faire?: string | null; difficultes?: string | null;
  recommandations?: string | null;
  financement_cotisation?: boolean | null; financement_dons?: boolean | null;
  financement_legs?: boolean | null; financement_collectivites?: boolean | null;
  financement_fonds_propres?: boolean | null; financement_ong_intl?: boolean | null;
  financement_multilateral?: boolean | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FORMALISATION_OPTIONS = [
  { value: "statuts_reglement", label: "Statut et règlement intérieur" },
  { value: "recepisse_depot", label: "Récépissé de dépôt" },
  { value: "recepisse_declaration", label: "Récépissé de déclaration" },
  { value: "agrement_decret", label: "Agrément / décret" },
  { value: "journal_officiel", label: "Déclaration Journal Officiel de la République de Côte d'Ivoire" },
];

const formalisationLabel = (value?: string | null) =>
  FORMALISATION_OPTIONS.find((option) => option.value === value)?.label || value || null;

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="py-2 border-b border-gray-100 last:border-0 flex gap-2">
      <span className="text-xs font-semibold text-gray-500 w-44 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

function BoolBadge({ value }: { value: boolean | null | undefined }) {
  if (value === null || value === undefined) return <span className="text-gray-400 text-sm">—</span>;
  return value
    ? <span className="inline-flex items-center gap-1 text-green-700 text-sm"><CheckCircle className="w-4 h-4" />Oui</span>
    : <span className="inline-flex items-center gap-1 text-red-600 text-sm"><XCircle className="w-4 h-4" />Non</span>;
}

function CrascAdhesionBadge({ statut, fallback }: { statut?: string | null; fallback?: boolean | null }) {
  if (statut === "oui") return <span className="inline-flex items-center gap-1 text-green-700 text-sm"><CheckCircle className="w-4 h-4" />Oui</span>;
  if (statut === "non") return <span className="inline-flex items-center gap-1 text-red-600 text-sm"><XCircle className="w-4 h-4" />Non</span>;
  if (statut === "en_cours") return <span className="inline-flex items-center gap-1 text-orange-600 text-sm">En cours</span>;
  return <BoolBadge value={fallback} />;
}

function Stat({ label, value }: { label: string; value: number | null | undefined }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-xl font-bold text-[#2a591d]">{value.toLocaleString("fr-FR")}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function OscDetailPage() {
  const router = useRouter();
  const params = useParams();
  const oscSlug = params.oscSlug as string;

  const [loading, setLoading] = useState(true);
  const [osc, setOsc] = useState<IOscDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Gestion du compte utilisateur OSC
  const [oscUser, setOscUser] = useState<{ id: string; email: string; username: string | null; first_name: string | null; last_name: string | null; is_active: boolean } | null | undefined>(undefined);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ email: "", username: "", password: "", first_name: "", last_name: "" });
  const [userFormError, setUserFormError] = useState<string | null>(null);
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [removingUser, setRemovingUser] = useState(false);

  useEffect(() => {
    const fetchOsc = async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status === 404 ? "OSC non trouvée" : `Erreur ${res.status}`);
        setOsc(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    if (oscSlug) fetchOsc();
  }, [oscSlug]);

  useEffect(() => {
    const fetchOscUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}/user`, {
          headers: { Authorization: `Bearer ${getToken()}` },
          cache: "no-store",
        });
        if (res.status === 404 || res.status === 401) { setOscUser(null); return; }
        if (res.ok) { const data = await res.json(); setOscUser(data); }
        else { setOscUser(null); }
      } catch { setOscUser(null); }
    };
    if (oscSlug) fetchOscUser();
  }, [oscSlug]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);
    setUserFormLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (!res.ok) { setUserFormError(data.detail || "Erreur lors de la création"); return; }
      setOscUser(data);
      setShowUserForm(false);
      setUserForm({ email: "", username: "", password: "", first_name: "", last_name: "" });
    } catch { setUserFormError("Erreur réseau"); }
    finally { setUserFormLoading(false); }
  };

  const handleRemoveUser = async () => {
    if (!confirm("Supprimer le compte utilisateur de cette OSC ?")) return;
    setRemovingUser(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}/user`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setOscUser(null);
      else { const d = await res.json(); setError(d.detail || "Erreur lors de la suppression"); }
    } catch { setError("Erreur réseau"); }
    finally { setRemovingUser(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer cette OSC ? Cette action est irréversible.")) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) { router.push("/admin/gestion-des-crasc/osc"); router.refresh(); }
      else { const d = await res.json(); setError(d.detail || "Erreur lors de la suppression"); }
    } catch { setError("Erreur réseau lors de la suppression"); }
    finally { setDeleting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins">
      <div className="animate-pulse text-gray-400">Chargement...</div>
    </div>
  );

  if (error && !osc) return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-poppins">
      <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-5 h-5 text-red-600" /><p className="text-red-800">{error}</p></div>
        <Link href="/admin/gestion-des-crasc/osc" className="text-blue-600 hover:underline text-sm">← Retour à la liste</Link>
      </div>
    </div>
  );

  if (!osc) return null;

  const domaines = [osc.domaine_prioritaire, osc.domaine_prioritaire_2, osc.domaine_prioritaire_3, osc.domaine_prioritaire_4, osc.domaine_prioritaire_5].filter(Boolean);
  const sources = [
    osc.financement_cotisation && "Cotisations",
    osc.financement_dons && "Dons",
    osc.financement_legs && "Legs",
    osc.financement_collectivites && "Collectivités",
    osc.financement_fonds_propres && "Fonds propres",
    osc.financement_ong_intl && "ONG internationale",
    osc.financement_multilateral && "Multilatéral",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-poppins">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/gestion-des-crasc/osc"
          className="inline-flex items-center gap-2 text-sm text-[#2a591d] hover:text-[#1f4315] mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" />Retour à la liste des OSC
        </Link>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/20 border-2 border-white/30 flex-shrink-0">
              <ImageWithFallback src={osc.thumbnail_url || "/images/default-osc-logo.png"} alt={osc.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{osc.name}</h1>
              {osc.description && <p className="text-white/80 text-sm leading-relaxed">{osc.description}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {osc.type && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1"><Tag className="w-3 h-3" />{osc.type.name}</span>}
                {osc.crasc && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1"><Building2 className="w-3 h-3" />{osc.crasc.name}</span>}
                {osc.ville && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" />{osc.ville}</span>}
                {osc.categorie && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">{osc.categorie}</span>}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Statistiques chiffrées */}
        {(osc.nb_membres || osc.nb_femmes_membres || osc.nb_membres_jeunes || osc.nb_membres_be || osc.nb_personnes_engagees || osc.nb_beneficiaires || osc.nb_activites || osc.budget_annuel) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#2a591d]" />Statistiques
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Membres" value={osc.nb_membres} />
              <Stat label="Femmes membres" value={osc.nb_femmes_membres} />
              <Stat label="Membres jeunes" value={osc.nb_membres_jeunes} />
              <Stat label="Membres BE" value={osc.nb_membres_be} />
              <Stat label="Personnes engagées" value={osc.nb_personnes_engagees} />
              <Stat label="Bénéficiaires" value={osc.nb_beneficiaires} />
              <Stat label="Activités" value={osc.nb_activites} />
              {osc.budget_annuel && (
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-[#2a591d]">{osc.budget_annuel.toLocaleString("fr-FR")} F</p>
                  <p className="text-xs text-gray-500 mt-0.5">Budget annuel</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />Contact
            </h2>
            <InfoRow label="Email" value={osc.email ? <a href={`mailto:${osc.email}`} className="text-blue-600 hover:underline">{osc.email}</a> : null} />
            <InfoRow label="Téléphone" value={osc.phone ? <a href={`tel:${osc.phone}`} className="text-blue-600 hover:underline">{osc.phone}</a> : null} />
            <InfoRow label="Ville" value={osc.ville} />
            <InfoRow label="Adresse" value={osc.address} />
            <InfoRow label="Site web" value={osc.website ? <a href={osc.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{osc.website}</a> : null} />
            <InfoRow label="Réseaux sociaux" value={osc.reseaux_sociaux} />
            {(osc.latitude || osc.longitude) && (
              <InfoRow label="Coordonnées GPS" value={<span className="font-mono text-xs">{osc.latitude}, {osc.longitude}</span>} />
            )}
          </div>

          {/* Identité juridique */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />Identité juridique
            </h2>
            <InfoRow label="Date de création" value={osc.date_creation} />
            <InfoRow label="Type de document de formalisation" value={formalisationLabel(osc.type_document_formalisation)} />
            <InfoRow
              label="Justificatif de formalisation"
              value={osc.document_formalisation_url ? (
                <a href={osc.document_formalisation_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  Voir le fichier
                </a>
              ) : null}
            />
            <InfoRow label="Catégorie" value={osc.categorie} />
            <InfoRow label="Niveau de couverture" value={osc.niveau_couverture} />
            <InfoRow label="Zone de couverture" value={osc.zone_couverture} />
            <InfoRow label="Existence d’un siège" value={<BoolBadge value={osc.existence_siege} />} />
            <InfoRow label="Manuel de procédures" value={<BoolBadge value={osc.manuel_procedures} />} />
            <InfoRow label="Plan d’action" value={<BoolBadge value={osc.plan_action} />} />
            <InfoRow
              label="Preuve plan d’action"
              value={osc.plan_action_document_url ? (
                <a href={osc.plan_action_document_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  Voir le fichier
                </a>
              ) : null}
            />
            <InfoRow label="Rapports annuels" value={<BoolBadge value={osc.rapports_annuels} />} />
            <InfoRow
              label="Preuve rapports annuels"
              value={osc.rapports_annuels_document_url ? (
                <a href={osc.rapports_annuels_document_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  Voir le fichier
                </a>
              ) : null}
            />
            <InfoRow label="Adhésion CRASC" value={<CrascAdhesionBadge statut={osc.adhesion_crasc_statut} fallback={osc.adhesion_crasc} />} />
            <InfoRow
              label="Preuve adhésion CRASC"
              value={osc.adhesion_crasc_document_url ? (
                <a href={osc.adhesion_crasc_document_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  Voir le fichier
                </a>
              ) : null}
            />
            <InfoRow label="Niveau de regroupement" value={osc.niveau_regroupement} />
            <InfoRow label="Réseau d'appartenance" value={osc.reseau_appartenance} />
          </div>

          {/* Gouvernance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />Gouvernance
            </h2>
            <InfoRow label="Nom du président" value={osc.nom_president} />
            <InfoRow label="Sexe du président" value={osc.sexe_president} />
            <InfoRow label="Mode de désignation" value={osc.mode_designation_president} />
            <InfoRow label="Durée mandat BE" value={osc.duree_mandat_be} />
          </div>

          {/* Financement */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-600" />Financement
            </h2>
            <InfoRow label="Type de financement" value={osc.type_financement} />
            <InfoRow label="État des cotisations" value={osc.etat_cotisations} />
            <InfoRow label="Montant cotisation" value={osc.montant_cotisation ? `${osc.montant_cotisation.toLocaleString("fr-FR")} F` : null} />
            {sources.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-500 mb-1">Sources de financement</p>
                <div className="flex flex-wrap gap-1">
                  {sources.map(s => <span key={s as string} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Domaines & activités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {domaines.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />Domaines prioritaires
              </h2>
              <ol className="list-decimal list-inside space-y-1">
                {domaines.map((d, i) => <li key={i} className="text-sm text-gray-800">{d}</li>)}
              </ol>
            </div>
          )}

          {osc.secteurs_activites && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Secteurs d&apos;activités</h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">{osc.secteurs_activites}</p>
            </div>
          )}

          {osc.populations_cibles && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Populations cibles</h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">{osc.populations_cibles}</p>
            </div>
          )}

          {osc.savoir_faire && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Savoir-faire</h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">{osc.savoir_faire}</p>
            </div>
          )}

          {osc.difficultes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Difficultés rencontrées</h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">{osc.difficultes}</p>
            </div>
          )}

          {osc.recommandations && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recommandations</h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">{osc.recommandations}</p>
            </div>
          )}
        </div>

        {/* Actualités */}
        {osc.news_items && osc.news_items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">{osc.news_items.length} actualité(s) publiée(s)</h2>
            </div>
          </div>
        )}

        {/* Compte utilisateur OSC */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#2a591d]" />Compte utilisateur
          </h2>

          {oscUser === undefined && (
            <p className="text-sm text-gray-400">Chargement...</p>
          )}

          {oscUser === null && !showUserForm && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Aucun compte utilisateur rattaché à cette OSC.</p>
              <button onClick={() => {
                // Pré-remplir avec les données de l'OSC
                const nameParts = (osc?.nom_president || osc?.name || "").split(" ");
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";
                const slug = osc?.slug || "";
                setUserForm({
                  email: osc?.email || "",
                  username: slug,
                  password: "",
                  first_name: firstName,
                  last_name: lastName,
                });
                setShowUserForm(true);
              }}
                className="flex items-center gap-2 px-4 py-2 bg-[#2a591d] text-white rounded-lg hover:bg-[#1f4315] text-sm font-semibold">
                <UserPlus className="w-4 h-4" />Créer un compte
              </button>
            </div>
          )}

          {oscUser && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{oscUser.first_name} {oscUser.last_name}</p>
                <p className="text-sm text-gray-500">{oscUser.email}</p>
                {oscUser.username && <p className="text-xs text-gray-400">@{oscUser.username}</p>}
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${oscUser.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {oscUser.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              <button onClick={handleRemoveUser} disabled={removingUser}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-semibold disabled:opacity-50">
                <UserX className="w-4 h-4" />{removingUser ? "Suppression..." : "Supprimer le compte"}
              </button>
            </div>
          )}

          {showUserForm && (
            <form onSubmit={handleCreateUser} className="space-y-3 mt-2">
              {userFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{userFormError}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom</label>
                  <input type="text" value={userForm.first_name} onChange={e => setUserForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                  <input type="text" value={userForm.last_name} onChange={e => setUserForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <input type="email" required value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom d&apos;utilisateur</label>
                  <input type="text" value={userForm.username} onChange={e => setUserForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mot de passe *</label>
                  <input type="password" required minLength={8} value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d]" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={userFormLoading}
                  className="flex items-center gap-2 px-5 py-2 bg-[#2a591d] text-white rounded-lg hover:bg-[#1f4315] text-sm font-semibold disabled:opacity-50">
                  <UserPlus className="w-4 h-4" />{userFormLoading ? "Création..." : "Créer le compte"}
                </button>
                <button type="button" onClick={() => { setShowUserForm(false); setUserFormError(null); }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href={`/admin/gestion-des-crasc/osc/${osc.slug}/modifier`}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
            <Edit className="w-5 h-5" />Modifier cette OSC
          </Link>
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            <Trash2 className="w-5 h-5" />{deleting ? "Suppression..." : "Supprimer cette OSC"}
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800 text-sm">La suppression d&apos;une OSC est irréversible. Toutes les données associées seront affectées.</p>
        </div>
      </div>
    </div>
  );
}
