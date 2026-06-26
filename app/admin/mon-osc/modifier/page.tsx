"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { fetchWithAuth, getToken } from "@/lib/auth";
import { fetchAllOscType } from "@/lib/fetch-crasc";
import {
  FORMALISATION_FILE_ACCEPT,
  FORMALISATION_FILE_MAX_SIZE,
  isFormalisationFileAccepted,
} from "@/lib/formalisation-file";
import { DOMAINE_PRIORITAIRE_OPTIONS } from "@/lib/osc-domaines";
import { IOscType } from "@/types/api.types";
import Image from "next/image";
import {
  ArrowLeft, Building2, FileText, Upload, X, Check, Loader2,
  AlertCircle, ChevronDown, Image as ImageIcon, Save,
  Phone, Users, Wallet, Tag,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const supportingDocumentSchema = z.instanceof(File).optional()
  .refine(f => !f || f.size <= FORMALISATION_FILE_MAX_SIZE, { message: "Max 10MB" })
  .refine(isFormalisationFileAccepted, { message: "PDF, Word ou image uniquement" });

const oscSchema = z.object({
  name: z.string().min(4, "Minimum 4 caractères").optional(),
  sigle: z.string().optional(),
  description: z.string().max(500, "Maximum 500 caractères").optional(),
  type_id: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  region_nom: z.string().optional(),
  departement: z.string().optional(),
  sous_prefecture: z.string().optional(),
  ville: z.string().optional(),
  origine_organisation: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  website: z.string().optional(),
  reseaux_sociaux: z.string().optional(),
  date_creation: z.string().optional(),
  numero_recepisse: z.string().optional(),
  niveau_couverture: z.string().optional(),
  zone_couverture: z.string().optional(),
  categorie: z.string().optional(),
  domaine_prioritaire: z.string().optional(),
  domaine_prioritaire_2: z.string().optional(),
  domaine_prioritaire_3: z.string().optional(),
  domaine_prioritaire_4: z.string().optional(),
  domaine_prioritaire_5: z.string().optional(),
  nb_membres: z.string().optional(),
  nb_femmes_membres: z.string().optional(),
  nb_hommes_membres: z.string().optional(),
  nb_membres_jeunes: z.string().optional(),
  nb_membres_handicap: z.string().optional(),
  nb_membres_be: z.string().optional(),
  nombre_mandats_be: z.string().optional(),
  nb_personnes_engagees: z.string().optional(),
  nb_cdi: z.string().optional(),
  nb_cdd: z.string().optional(),
  nb_beneficiaires: z.string().optional(),
  nb_femmes_beneficiaires: z.string().optional(),
  nb_jeunes_beneficiaires: z.string().optional(),
  nb_beneficiaires_handicap: z.string().optional(),
  nb_activites: z.string().optional(),
  date_derniere_activite: z.string().optional(),
  budget_annuel: z.string().optional(),
  type_financement: z.string().optional(),
  etat_cotisations: z.string().optional(),
  montant_cotisation: z.string().optional(),
  nom_president: z.string().optional(),
  sexe_president: z.string().optional(),
  mode_designation_president: z.string().optional(),
  date_designation_responsable: z.string().optional(),
  date_prochaine_designation: z.string().optional(),
  duree_mandat_be: z.string().optional(),
  adhesion_crasc: z.string().optional(),
  adhesion_crasc_statut: z.string().optional(),
  type_document_formalisation: z.string().optional(),
  document_formalisation_file: supportingDocumentSchema,
  existence_siege: z.string().optional(),
  manuel_procedures: z.string().optional(),
  plan_action_annee_cours: z.string().optional(),
  plan_action_annee_cours_details: z.string().optional(),
  plan_action: z.string().optional(),
  plan_action_document_file: supportingDocumentSchema,
  rapports_annuels: z.string().optional(),
  rapports_annuels_document_file: supportingDocumentSchema,
  adhesion_crasc_document_file: supportingDocumentSchema,
  niveau_regroupement: z.string().optional(),
  reseau_appartenance: z.string().optional(),
  organes_gouvernance: z.string().optional(),
  pays_couverture: z.string().optional(),
  secteurs_activites: z.string().optional(),
  populations_cibles: z.string().optional(),
  savoir_faire: z.string().optional(),
  difficultes: z.string().optional(),
  recommandations: z.string().optional(),
  recommandations_2: z.string().optional(),
  thumbnail: z.instanceof(File).optional()
    .refine(f => !f || f.size <= 5 * 1024 * 1024, { message: "Max 5MB" })
    .refine(f => !f || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type), { message: "JPG/PNG/WebP uniquement" }),
});

type OscForm = z.infer<typeof oscSchema>;
type ProofFileField = "plan_action_document_file" | "rapports_annuels_document_file" | "adhesion_crasc_document_file";

function FieldWrapper({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all text-sm";
const textareaCls = inputCls + " resize-none";

interface Pole { id: number; name: string; slug: string; }

export default function MonOscModifierPage() {
  const router = useRouter();
  const [typeList, setTypeList] = useState<IOscType[]>([]);
  const [allPoles, setAllPoles] = useState<Pole[]>([]);
  const [selectedPoleIds, setSelectedPoleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [oscSlug, setOscSlug] = useState<string | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
  const [currentFormalisationUrl, setCurrentFormalisationUrl] = useState<string | null>(null);
  const [currentPlanActionDocumentUrl, setCurrentPlanActionDocumentUrl] = useState<string | null>(null);
  const [currentRapportsAnnuelsDocumentUrl, setCurrentRapportsAnnuelsDocumentUrl] = useState<string | null>(null);
  const [currentAdhesionCrascDocumentUrl, setCurrentAdhesionCrascDocumentUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentFormalisationInputRef = useRef<HTMLInputElement>(null);
  const planActionDocumentInputRef = useRef<HTMLInputElement>(null);
  const rapportsAnnuelsDocumentInputRef = useRef<HTMLInputElement>(null);
  const adhesionCrascDocumentInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, formState: { errors }, setValue, watch, register } = useForm<OscForm>({
    resolver: zodResolver(oscSchema),
    defaultValues: {
      name: "", sigle: "", description: "", type_id: "",
      email: "", phone: "", region_nom: "", departement: "", sous_prefecture: "",
      ville: "", origine_organisation: "", address: "", latitude: "", longitude: "",
      website: "", reseaux_sociaux: "", date_creation: "", numero_recepisse: "",
      niveau_couverture: "", zone_couverture: "", categorie: "",
      domaine_prioritaire: "", domaine_prioritaire_2: "", domaine_prioritaire_3: "",
      domaine_prioritaire_4: "", domaine_prioritaire_5: "",
      nb_membres: "", nb_femmes_membres: "", nb_hommes_membres: "", nb_membres_jeunes: "",
      nb_membres_handicap: "", nb_membres_be: "", nombre_mandats_be: "",
      nb_personnes_engagees: "", nb_cdi: "", nb_cdd: "", nb_beneficiaires: "",
      nb_femmes_beneficiaires: "", nb_jeunes_beneficiaires: "", nb_beneficiaires_handicap: "",
      nb_activites: "", date_derniere_activite: "",
      budget_annuel: "", type_financement: "", etat_cotisations: "", montant_cotisation: "",
      nom_president: "", sexe_president: "", mode_designation_president: "",
      date_designation_responsable: "", date_prochaine_designation: "",
      duree_mandat_be: "", adhesion_crasc: "", adhesion_crasc_statut: "",
      type_document_formalisation: "", existence_siege: "", manuel_procedures: "",
      plan_action_annee_cours: "", plan_action_annee_cours_details: "",
      plan_action: "", rapports_annuels: "",
      niveau_regroupement: "", reseau_appartenance: "", organes_gouvernance: "", pays_couverture: "",
      secteurs_activites: "", populations_cibles: "", savoir_faire: "", difficultes: "",
      recommandations: "", recommandations_2: "",
    },
  });

  useEffect(() => {
    fetchAllOscType().then(setTypeList).catch(console.error);
    fetch(`${API_BASE}/api/v1/forum/poles?limit=50`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllPoles(Array.isArray(data) ? data : data.items ?? []))
      .catch(console.error);

    fetchWithAuth(`${API_BASE}/api/v1/crasc/osc/me`)
      .then(r => { if (!r.ok) throw new Error("OSC introuvable"); return r.json(); })
      .then(osc => {
        setOscSlug(osc.slug);
        setCurrentThumbnailUrl(osc.thumbnail_url || null);
        setCurrentFormalisationUrl(osc.document_formalisation_url || null);
        setCurrentPlanActionDocumentUrl(osc.plan_action_document_url || null);
        setCurrentRapportsAnnuelsDocumentUrl(osc.rapports_annuels_document_url || null);
        setCurrentAdhesionCrascDocumentUrl(osc.adhesion_crasc_document_url || null);
        setPreviewImage(osc.thumbnail_url || null);
        if (Array.isArray(osc.poles)) {
          setSelectedPoleIds(osc.poles.map((p: Pole) => p.id));
        }
        const s = (v: unknown) => v != null ? String(v) : "";
        setValue("name", osc.name || "");
        setValue("sigle", osc.sigle || "");
        setValue("description", osc.description || "");
        setValue("type_id", osc.type?.id ? String(osc.type.id) : "");
        setValue("email", osc.email || "");
        setValue("phone", osc.phone || "");
        setValue("region_nom", osc.region_nom || "");
        setValue("departement", osc.departement || "");
        setValue("sous_prefecture", osc.sous_prefecture || "");
        setValue("ville", osc.ville || "");
        setValue("origine_organisation", osc.origine_organisation || "");
        setValue("address", osc.address || "");
        setValue("latitude", s(osc.latitude));
        setValue("longitude", s(osc.longitude));
        setValue("website", osc.website || "");
        setValue("reseaux_sociaux", osc.reseaux_sociaux || "");
        setValue("date_creation", osc.date_creation || "");
        setValue("numero_recepisse", osc.numero_recepisse || "");
        setValue("niveau_couverture", osc.niveau_couverture || "");
        setValue("zone_couverture", osc.zone_couverture || "");
        setValue("categorie", osc.categorie || "");
        setValue("domaine_prioritaire", osc.domaine_prioritaire || "");
        setValue("domaine_prioritaire_2", osc.domaine_prioritaire_2 || "");
        setValue("domaine_prioritaire_3", osc.domaine_prioritaire_3 || "");
        setValue("domaine_prioritaire_4", osc.domaine_prioritaire_4 || "");
        setValue("domaine_prioritaire_5", osc.domaine_prioritaire_5 || "");
        setValue("nb_membres", s(osc.nb_membres));
        setValue("nb_femmes_membres", s(osc.nb_femmes_membres));
        setValue("nb_hommes_membres", s(osc.nb_hommes_membres));
        setValue("nb_membres_jeunes", s(osc.nb_membres_jeunes));
        setValue("nb_membres_handicap", s(osc.nb_membres_handicap));
        setValue("nb_membres_be", s(osc.nb_membres_be));
        setValue("nombre_mandats_be", s(osc.nombre_mandats_be));
        setValue("nb_personnes_engagees", s(osc.nb_personnes_engagees));
        setValue("nb_cdi", s(osc.nb_cdi));
        setValue("nb_cdd", s(osc.nb_cdd));
        setValue("nb_beneficiaires", s(osc.nb_beneficiaires));
        setValue("nb_femmes_beneficiaires", s(osc.nb_femmes_beneficiaires));
        setValue("nb_jeunes_beneficiaires", s(osc.nb_jeunes_beneficiaires));
        setValue("nb_beneficiaires_handicap", s(osc.nb_beneficiaires_handicap));
        setValue("nb_activites", s(osc.nb_activites));
        setValue("date_derniere_activite", osc.date_derniere_activite || "");
        setValue("budget_annuel", s(osc.budget_annuel));
        setValue("type_financement", osc.type_financement || "");
        setValue("etat_cotisations", osc.etat_cotisations || "");
        setValue("montant_cotisation", s(osc.montant_cotisation));
        setValue("nom_president", osc.nom_president || "");
        setValue("sexe_president", osc.sexe_president || "");
        setValue("mode_designation_president", osc.mode_designation_president || "");
        setValue("date_designation_responsable", osc.date_designation_responsable || "");
        setValue("date_prochaine_designation", osc.date_prochaine_designation || "");
        setValue("duree_mandat_be", osc.duree_mandat_be || "");
        setValue("adhesion_crasc", osc.adhesion_crasc != null ? (osc.adhesion_crasc ? "true" : "false") : "");
        setValue("adhesion_crasc_statut", osc.adhesion_crasc_statut || (osc.adhesion_crasc != null ? (osc.adhesion_crasc ? "oui" : "non") : ""));
        setValue("type_document_formalisation", osc.type_document_formalisation || "");
        setValue("existence_siege", osc.existence_siege != null ? (osc.existence_siege ? "true" : "false") : "");
        setValue("manuel_procedures", osc.manuel_procedures != null ? (osc.manuel_procedures ? "true" : "false") : "");
        const planActionValue = osc.plan_action ?? osc.plan_action_annee_cours;
        const planActionString = planActionValue != null ? (planActionValue ? "true" : "false") : "";
        setValue("plan_action_annee_cours", planActionString);
        setValue("plan_action_annee_cours_details", osc.plan_action_annee_cours_details || "");
        setValue("plan_action", planActionString);
        setValue("rapports_annuels", osc.rapports_annuels != null ? (osc.rapports_annuels ? "true" : "false") : "");
        setValue("niveau_regroupement", osc.niveau_regroupement || "");
        setValue("reseau_appartenance", osc.reseau_appartenance || "");
        setValue("organes_gouvernance", osc.organes_gouvernance || "");
        setValue("pays_couverture", osc.pays_couverture || "");
        setValue("secteurs_activites", osc.secteurs_activites || "");
        setValue("populations_cibles", osc.populations_cibles || "");
        setValue("savoir_faire", osc.savoir_faire || "");
        setValue("difficultes", osc.difficultes || "");
        setValue("recommandations", osc.recommandations || "");
        setValue("recommandations_2", osc.recommandations_2 || "");
      })
      .catch(e => setErrorMessage(e.message))
      .finally(() => setFetchLoading(false));
  }, [setValue]);

  const thumbnailFile = watch("thumbnail");
  const documentFormalisationFile = watch("document_formalisation_file");
  const planActionValue = watch("plan_action");
  const rapportsAnnuelsValue = watch("rapports_annuels");
  const adhesionCrascStatutValue = watch("adhesion_crasc_statut");

  const renderProofUpload = (
    field: ProofFileField,
    inputRef: React.RefObject<HTMLInputElement | null>,
    label: string,
    currentUrl?: string | null
  ) => {
    const selectedFile = watch(field);
    return (
      <div className="md:col-span-2 rounded-xl border border-dashed border-[#2A591D]/30 bg-[#2A591D]/5 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-left text-sm bg-white hover:border-[#2A591D] hover:bg-white transition-all"
        >
          <span className="flex items-center gap-2 text-gray-700">
            <Upload className="w-4 h-4 text-[#2A591D]" />
            {selectedFile?.name || "Remplacer ou déposer la preuve"}
          </span>
          <span className="mt-1 block text-xs text-gray-500">PDF, Word, JPG, PNG ou WebP • 10MB max</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={FORMALISATION_FILE_ACCEPT}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setValue(field, file);
          }}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          {currentUrl && (
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#2A591D] hover:underline">
              Voir la preuve actuelle
            </a>
          )}
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setValue(field, undefined);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="font-semibold text-red-600 hover:text-red-700"
            >
              Retirer le fichier choisi
            </button>
          )}
        </div>
        {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
      </div>
    );
  };
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(thumbnailFile);
    }
  }, [thumbnailFile]);

  const onSubmit = async (values: OscForm) => {
    if (!oscSlug) return;
    setLoading(true); setErrorMessage(null); setSuccessMessage(null);
    const token = getToken();
    if (!token) { setErrorMessage("Vous devez être connecté."); setLoading(false); return; }

    try {
      const fd = new FormData();
      const append = (key: string, val: unknown) => { if (val !== "" && val != null) fd.append(key, String(val)); };
      append("name", values.name);
      append("sigle", values.sigle);
      append("description", values.description);
      append("type_id", values.type_id);
      append("email", values.email);
      append("phone", values.phone);
      append("region_nom", values.region_nom);
      append("departement", values.departement);
      append("sous_prefecture", values.sous_prefecture);
      append("ville", values.ville);
      append("origine_organisation", values.origine_organisation);
      append("address", values.address);
      append("latitude", values.latitude);
      append("longitude", values.longitude);
      append("website", values.website);
      append("reseaux_sociaux", values.reseaux_sociaux);
      append("date_creation", values.date_creation);
      append("numero_recepisse", values.numero_recepisse);
      append("niveau_couverture", values.niveau_couverture);
      append("zone_couverture", values.zone_couverture);
      append("categorie", values.categorie);
      append("domaine_prioritaire", values.domaine_prioritaire);
      append("domaine_prioritaire_2", values.domaine_prioritaire_2);
      append("domaine_prioritaire_3", values.domaine_prioritaire_3);
      append("domaine_prioritaire_4", values.domaine_prioritaire_4);
      append("domaine_prioritaire_5", values.domaine_prioritaire_5);
      append("nb_membres", values.nb_membres);
      append("nb_femmes_membres", values.nb_femmes_membres);
      append("nb_hommes_membres", values.nb_hommes_membres);
      append("nb_membres_jeunes", values.nb_membres_jeunes);
      append("nb_membres_handicap", values.nb_membres_handicap);
      append("nb_membres_be", values.nb_membres_be);
      append("nombre_mandats_be", values.nombre_mandats_be);
      append("nb_personnes_engagees", values.nb_personnes_engagees);
      append("nb_cdi", values.nb_cdi);
      append("nb_cdd", values.nb_cdd);
      append("nb_beneficiaires", values.nb_beneficiaires);
      append("nb_femmes_beneficiaires", values.nb_femmes_beneficiaires);
      append("nb_jeunes_beneficiaires", values.nb_jeunes_beneficiaires);
      append("nb_beneficiaires_handicap", values.nb_beneficiaires_handicap);
      append("nb_activites", values.nb_activites);
      append("date_derniere_activite", values.date_derniere_activite);
      append("budget_annuel", values.budget_annuel);
      append("type_financement", values.type_financement);
      append("etat_cotisations", values.etat_cotisations);
      append("montant_cotisation", values.montant_cotisation);
      append("nom_president", values.nom_president);
      append("sexe_president", values.sexe_president);
      append("mode_designation_president", values.mode_designation_president);
      append("date_designation_responsable", values.date_designation_responsable);
      append("date_prochaine_designation", values.date_prochaine_designation);
      append("duree_mandat_be", values.duree_mandat_be);
      append("adhesion_crasc_statut", values.adhesion_crasc_statut);
      append("adhesion_crasc", values.adhesion_crasc_statut === "oui" ? "true" : values.adhesion_crasc_statut === "non" ? "false" : "");
      append("type_document_formalisation", values.type_document_formalisation);
      append("existence_siege", values.existence_siege);
      append("manuel_procedures", values.manuel_procedures);
      append("plan_action_annee_cours", values.plan_action);
      append("plan_action_annee_cours_details", values.plan_action_annee_cours_details);
      append("plan_action", values.plan_action);
      append("rapports_annuels", values.rapports_annuels);
      append("niveau_regroupement", values.niveau_regroupement);
      append("reseau_appartenance", values.reseau_appartenance);
      append("organes_gouvernance", values.organes_gouvernance);
      append("pays_couverture", values.pays_couverture);
      append("secteurs_activites", values.secteurs_activites);
      append("populations_cibles", values.populations_cibles);
      append("savoir_faire", values.savoir_faire);
      append("difficultes", values.difficultes);
      append("recommandations", values.recommandations);
      append("recommandations_2", values.recommandations_2);
      if (values.thumbnail) fd.append("thumbnail", values.thumbnail);
      if (values.document_formalisation_file) fd.append("document_formalisation_file", values.document_formalisation_file);
      if (values.plan_action_document_file) fd.append("plan_action_document_file", values.plan_action_document_file);
      if (values.rapports_annuels_document_file) fd.append("rapports_annuels_document_file", values.rapports_annuels_document_file);
      if (values.adhesion_crasc_document_file) fd.append("adhesion_crasc_document_file", values.adhesion_crasc_document_file);
      fd.append("pole_ids", JSON.stringify(selectedPoleIds));

      const res = await fetch(`${API_BASE}/api/v1/crasc/osc/${oscSlug}/modification-requests`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        setSuccessMessage("Votre demande de modification a été envoyée en modération. Elle sera visible après validation par un administrateur.");
        setTimeout(() => router.push("/admin/mon-osc"), 2500);
      } else {
        const d = await res.json();
        setErrorMessage(typeof d.detail === "string" ? d.detail : "Erreur lors de la modification.");
      }
    } catch {
      setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ name, placeholder, options }: { name: keyof OscForm; placeholder: string; options: { value: string; label: string }[] }) => (
    <Controller name={name} control={control} render={({ field }) => (
      <Select.Root onValueChange={field.onChange} value={field.value as string}>
        <Select.Trigger className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-left flex items-center justify-between text-sm hover:border-[#2A591D] transition-all">
          <Select.Value placeholder={placeholder} />
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </Select.Trigger>
        <Select.Content className="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          <Select.Viewport className="p-1">
            {options.map(o => (
              <Select.Item key={o.value} value={o.value} className="px-3 py-2 hover:bg-[#2A591D]/10 cursor-pointer rounded text-sm outline-none">
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    )} />
  );

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
      {icon}{title}
    </h2>
  );

  if (fetchLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#2A591D] animate-spin" />
    </div>
  );

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
      <div className="mb-6">
        <Link href="/admin/mon-osc"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />Retour au profil
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#2A591D]" />Modifier le profil de mon OSC
        </h1>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-[#2A591D]" />} title="Informations de base" />
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWrapper label="Nom de l'OSC" error={errors.name?.message}>
              <input {...register("name")} className={inputCls} placeholder="Nom complet" />
            </FieldWrapper>
            <FieldWrapper label="Sigle ou abréviation">
              <input {...register("sigle")} className={inputCls} placeholder="Ex: APD" />
            </FieldWrapper>
            <FieldWrapper label="Description (max 500 car.)" error={errors.description?.message}>
              <textarea {...register("description")} rows={3} maxLength={500} className={textareaCls} placeholder="Description..." />
            </FieldWrapper>
            <FieldWrapper label="Type d'OSC">
              <SelectField name="type_id" placeholder="Sélectionnez un type"
                options={typeList.map(t => ({ value: String(t.id), label: t.name }))} />
            </FieldWrapper>
            <FieldWrapper label="Catégorie">
              <SelectField name="categorie" placeholder="Sélectionner" options={[
                { value: "organisation_jeune", label: "Organisation de jeune (ODJ)" },
                { value: "organisation_femme", label: "Organisation de femme" },
                { value: "organisation_mixte", label: "Organisation mixte" },
              ]} />
            </FieldWrapper>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Phone className="w-5 h-5 text-blue-600" />} title="Contact & localisation" />
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWrapper label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" className={inputCls} placeholder="contact@osc.org" />
            </FieldWrapper>
            <FieldWrapper label="Téléphone">
              <input {...register("phone")} className={inputCls} placeholder="+225 XX XX XX XX" />
            </FieldWrapper>
            <FieldWrapper label="Région">
              <input {...register("region_nom")} className={inputCls} placeholder="Région" />
            </FieldWrapper>
            <FieldWrapper label="Département">
              <input {...register("departement")} className={inputCls} placeholder="Département" />
            </FieldWrapper>
            <FieldWrapper label="Sous-préfecture">
              <input {...register("sous_prefecture")} className={inputCls} placeholder="Sous-préfecture" />
            </FieldWrapper>
            <FieldWrapper label="L'organisation est née où ?">
              <SelectField name="origine_organisation" placeholder="Sélectionner" options={[
                { value: "cote_ivoire", label: "Côte d'Ivoire" },
                { value: "etranger", label: "À l'étranger" },
              ]} />
            </FieldWrapper>
            <FieldWrapper label="Ville">
              <input {...register("ville")} className={inputCls} placeholder="Abidjan" />
            </FieldWrapper>
            <FieldWrapper label="Adresse">
              <input {...register("address")} className={inputCls} placeholder="Quartier, rue..." />
            </FieldWrapper>
            <FieldWrapper label="Latitude">
              <input {...register("latitude")} className={inputCls} placeholder="5.316667" />
            </FieldWrapper>
            <FieldWrapper label="Longitude">
              <input {...register("longitude")} className={inputCls} placeholder="-4.033333" />
            </FieldWrapper>
            <FieldWrapper label="Site web">
              <input {...register("website")} className={inputCls} placeholder="https://..." />
            </FieldWrapper>
            <FieldWrapper label="Réseaux sociaux">
              <input {...register("reseaux_sociaux")} className={inputCls} placeholder="Facebook, Twitter..." />
            </FieldWrapper>
          </div>
        </div>

        {/* Identité juridique */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-purple-600" />} title="Identité juridique" />
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWrapper label="Date de création">
              <input {...register("date_creation")} className={inputCls} placeholder="2010-01-15" />
            </FieldWrapper>
            <FieldWrapper label="Type de document de formalisation">
              <SelectField name="type_document_formalisation" placeholder="Sélectionner un document" options={[
                { value: "statuts_reglement", label: "Statut et règlement intérieur" },
                { value: "recepisse_depot", label: "Récépissé de dépôt" },
                { value: "recepisse_declaration", label: "Récépissé de déclaration" },
                { value: "agrement_decret", label: "Agrément / décret" },
                { value: "journal_officiel", label: "Déclaration Journal Officiel de la République de Côte d'Ivoire" },
              ]} />
            </FieldWrapper>
            <FieldWrapper label="Niveau de couverture">
              <input {...register("niveau_couverture")} className={inputCls} placeholder="National, Régional..." />
            </FieldWrapper>
            <FieldWrapper label="Zone de couverture">
              <input {...register("zone_couverture")} className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="Adhésion CRASC">
              <SelectField name="adhesion_crasc_statut" placeholder="Sélectionner"
                options={[{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }, { value: "en_cours", label: "En cours" }]} />
            </FieldWrapper>
            {adhesionCrascStatutValue === "oui" &&
              renderProofUpload("adhesion_crasc_document_file", adhesionCrascDocumentInputRef, "Preuve d’adhésion au CRASC", currentAdhesionCrascDocumentUrl)}
            <FieldWrapper label="Niveau de regroupement">
              <SelectField name="niveau_regroupement" placeholder="Sélectionner" options={[
                { value: "Simple", label: "Simple" },
                { value: "Réseau", label: "Réseau" },
                { value: "Fédération", label: "Fédération" },
                { value: "Plateforme", label: "Plateforme" },
                { value: "Confédération", label: "Confédération" },
              ]} />
            </FieldWrapper>
            <FieldWrapper label="Réseau d'appartenance">
              <input {...register("reseau_appartenance")} className={inputCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Autoévaluation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-[#E05017]" />} title="Autoévaluation de mon OSC" />
          <p className="text-sm text-gray-500 mb-4">La plateforme calcule automatiquement votre note sur 20 et la couleur correspondante.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWrapper label="Justificatif de formalisation" error={errors.document_formalisation_file?.message}>
              <button
                type="button"
                onClick={() => documentFormalisationInputRef.current?.click()}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-left text-sm hover:border-[#2A591D] hover:bg-[#2A591D]/5 transition-all"
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <Upload className="w-4 h-4 text-[#2A591D]" />
                  {documentFormalisationFile?.name || "Remplacer ou déposer le justificatif"}
                </span>
                <span className="mt-1 block text-xs text-gray-500">PDF, Word, JPG, PNG ou WebP • 10MB max</span>
              </button>
              <input
                ref={documentFormalisationInputRef}
                type="file"
                accept={FORMALISATION_FILE_ACCEPT}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setValue("document_formalisation_file", file);
                }}
              />
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                {currentFormalisationUrl && (
                  <a
                    href={currentFormalisationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2A591D] hover:underline"
                  >
                    Voir le justificatif actuel
                  </a>
                )}
                {documentFormalisationFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("document_formalisation_file", undefined);
                      if (documentFormalisationInputRef.current) documentFormalisationInputRef.current.value = "";
                    }}
                    className="font-semibold text-red-600 hover:text-red-700"
                  >
                    Retirer le fichier choisi
                  </button>
                )}
              </div>
            </FieldWrapper>
            {[
              ["existence_siege", "Existence d’un siège"],
              ["manuel_procedures", "Manuel de procédures"],
            ].map(([name, label]) => (
              <FieldWrapper key={name} label={label}>
                <SelectField name={name as keyof OscForm} placeholder="Sélectionner" options={[{ value: "true", label: "Oui" }, { value: "false", label: "Non" }]} />
              </FieldWrapper>
            ))}
            <FieldWrapper label={"L'organisation a-t-elle un plan d'action ?"}>
              <SelectField name="plan_action" placeholder="Sélectionner" options={[{ value: "true", label: "Oui" }, { value: "false", label: "Non" }]} />
            </FieldWrapper>
            {planActionValue === "true" &&
              renderProofUpload("plan_action_document_file", planActionDocumentInputRef, "Preuve du plan d’action", currentPlanActionDocumentUrl)}
            <FieldWrapper label="Rédigez-vous des rapports annuels d’activités ?">
              <SelectField name="rapports_annuels" placeholder="Sélectionner" options={[{ value: "true", label: "Oui" }, { value: "false", label: "Non" }]} />
            </FieldWrapper>
            {rapportsAnnuelsValue === "true" &&
              renderProofUpload("rapports_annuels_document_file", rapportsAnnuelsDocumentInputRef, "Preuve des rapports annuels", currentRapportsAnnuelsDocumentUrl)}
          </div>
          <div className="mt-4">
            <FieldWrapper label="Plan d’action pour l’année en cours et activités/initiatives à venir">
              <textarea {...register("plan_action_annee_cours_details")} rows={3} className={textareaCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Domaines / Pôles de concertation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Tag className="w-5 h-5 text-indigo-600" />} title="Domaines prioritaires (Pôles de concertation)" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allPoles.map(pole => {
              const checked = selectedPoleIds.includes(pole.id);
              return (
                <label
                  key={pole.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm font-medium
                    ${checked ? "bg-indigo-50 border-indigo-400 text-indigo-800" : "border-gray-200 text-gray-700 hover:border-indigo-300"}`}
                >
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={checked}
                    onChange={() =>
                      setSelectedPoleIds(prev =>
                        checked ? prev.filter(id => id !== pole.id) : [...prev, pole.id]
                      )
                    }
                  />
                  {pole.name}
                </label>
              );
            })}
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {([
              ["domaine_prioritaire", "1er domaine prioritaire"],
              ["domaine_prioritaire_2", "2ème domaine prioritaire"],
              ["domaine_prioritaire_3", "3ème domaine prioritaire"],
              ["domaine_prioritaire_4", "4ème domaine prioritaire"],
              ["domaine_prioritaire_5", "5ème domaine prioritaire"],
            ] as [string, string][]).map(([field, label]) => (
              <FieldWrapper key={field} label={label}>
                <SelectField
                  name={field as keyof OscForm}
                  placeholder="Sélectionner un domaine"
                  options={DOMAINE_PRIORITAIRE_OPTIONS}
                />
              </FieldWrapper>
            ))}
          </div>
          <div className="grid md:grid-cols-1 gap-4 mt-4">
            <FieldWrapper label="Secteurs d'activités">
              <textarea {...register("secteurs_activites")} rows={3} className={textareaCls} />
            </FieldWrapper>
            <FieldWrapper label="Populations cibles">
              <textarea {...register("populations_cibles")} rows={3} className={textareaCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Gouvernance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Users className="w-5 h-5 text-orange-500" />} title="Gouvernance" />
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWrapper label="Nom du président">
              <input {...register("nom_president")} className={inputCls} placeholder="Prénom et nom" />
            </FieldWrapper>
            <FieldWrapper label="Sexe du président">
              <SelectField name="sexe_president" placeholder="Sélectionner"
                options={[{ value: "Masculin", label: "Masculin" }, { value: "Féminin", label: "Féminin" }]} />
            </FieldWrapper>
            <FieldWrapper label="Mode de désignation">
              <input {...register("mode_designation_president")} className={inputCls} placeholder="Élection, nomination..." />
            </FieldWrapper>
            <FieldWrapper label="Date de désignation du/de la responsable actuel(le)">
              <input {...register("date_designation_responsable")} type="date" className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="Prochaine date de désignation">
              <input {...register("date_prochaine_designation")} type="date" className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="Nombre de mandat du BE ou DE actuel">
              <input {...register("nombre_mandats_be")} type="number" min="0" className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="Durée mandat BE">
              <input {...register("duree_mandat_be")} className={inputCls} placeholder="2 ans, 4 ans..." />
            </FieldWrapper>
            <FieldWrapper label="Organes de gouvernance">
              <textarea {...register("organes_gouvernance")} rows={3} className={textareaCls} placeholder="AG, CA, BE, CC, DE, CG, CS..." />
            </FieldWrapper>
            <FieldWrapper label="Pays de couverture en plus de la Côte d’Ivoire">
              <textarea {...register("pays_couverture")} rows={3} className={textareaCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Membres */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Users className="w-5 h-5 text-green-600" />} title="Membres & bénéficiaires" />
          <div className="grid md:grid-cols-3 gap-4">
            {([
              ["nb_membres", "Nb membres total"],
              ["nb_femmes_membres", "Nb femmes membres"],
              ["nb_hommes_membres", "Nb hommes membres"],
              ["nb_membres_jeunes", "Nb membres jeunes"],
              ["nb_membres_handicap", "Nb membres en situation de handicap"],
              ["nb_membres_be", "Nb membres BE"],
              ["nb_personnes_engagees", "Nb personnes engagées"],
              ["nb_cdi", "Nb CDI"],
              ["nb_cdd", "Nb CDD"],
              ["nb_beneficiaires", "Nb bénéficiaires"],
              ["nb_femmes_beneficiaires", "Nb femmes bénéficiaires"],
              ["nb_jeunes_beneficiaires", "Nb jeunes bénéficiaires"],
              ["nb_beneficiaires_handicap", "Nb bénéficiaires en situation de handicap"],
              ["nb_activites", "Nb activités"],
            ] as [string, string][]).map(([field, label]) => (
              <FieldWrapper key={field} label={label}>
                <input {...register(field as keyof OscForm)} type="number" min="0" className={inputCls} />
              </FieldWrapper>
            ))}
            <FieldWrapper label="Date de la dernière activité réalisée">
              <input {...register("date_derniere_activite")} type="date" className={inputCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Financement */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Wallet className="w-5 h-5 text-green-700" />} title="Financement" />
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWrapper label="Budget annuel (F CFA)">
              <input {...register("budget_annuel")} type="number" min="0" className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="Type de financement">
              <input {...register("type_financement")} className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="État des cotisations">
              <input {...register("etat_cotisations")} className={inputCls} />
            </FieldWrapper>
            <FieldWrapper label="Montant cotisation (F CFA)">
              <input {...register("montant_cotisation")} type="number" min="0" className={inputCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Savoir-faire */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-gray-600" />} title="Savoir-faire & recommandations" />
          <div className="space-y-4">
            <FieldWrapper label="Savoir-faire / expertise">
              <textarea {...register("savoir_faire")} rows={3} className={textareaCls} />
            </FieldWrapper>
            <FieldWrapper label="Difficultés rencontrées">
              <textarea {...register("difficultes")} rows={3} className={textareaCls} />
            </FieldWrapper>
            <FieldWrapper label="Recommandations">
              <textarea {...register("recommandations")} rows={3} className={textareaCls} />
            </FieldWrapper>
            <FieldWrapper label="Deuxième recommandation">
              <textarea {...register("recommandations_2")} rows={3} className={textareaCls} />
            </FieldWrapper>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<ImageIcon className="w-5 h-5 text-[#2A591D]" />} title="Logo / Image" />
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              errors.thumbnail ? "border-red-300 bg-red-50" : previewImage ? "border-[#2A591D] bg-[#2A591D]/5" : "border-gray-300 hover:border-[#2A591D]"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={e => { const f = e.target.files?.[0]; if (f) setValue("thumbnail", f); }} className="hidden" />
            {previewImage ? (
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-3 rounded-lg overflow-hidden">
                  <Image src={previewImage} alt="Aperçu" fill className="object-cover" />
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setValue("thumbnail", undefined); setPreviewImage(currentThumbnailUrl); }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                  <X className="w-4 h-4" />Changer
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Cliquez pour sélectionner une image</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Max 5MB</p>
              </>
            )}
          </div>
          {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail.message}</p>}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2A591D] to-[#1f4416] text-white rounded-lg hover:shadow-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Enregistrement...</> : <><Save className="w-5 h-5" />Enregistrer les modifications</>}
          </button>
          <Link href="/admin/mon-osc"
            className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
            Annuler
          </Link>
        </div>
      </form>
    </section>
  );
}
