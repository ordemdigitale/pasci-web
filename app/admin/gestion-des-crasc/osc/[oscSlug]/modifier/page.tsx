"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IOscType } from "@/types/api.types";
import { fetchAllCrasc, fetchAllOscType } from "@/lib/fetch-crasc";
import { fetchWithAuth } from "@/lib/auth";
import Image from "next/image";
import {
  ArrowLeft, Building2, FileText, Upload, X, Check, Loader2,
  AlertCircle, ChevronDown, Image as ImageIcon, Save,
  Phone, Users, Wallet, Tag,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const oscSchema = z.object({
  name: z.string().min(4, "Minimum 4 caractères").optional(),
  description: z.string().max(500, "Maximum 500 caractères").optional(),
  crasc_id: z.string().optional(),
  type_id: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  ville: z.string().optional(),
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
  nb_membres: z.string().optional(),
  nb_femmes_membres: z.string().optional(),
  nb_membres_jeunes: z.string().optional(),
  nb_membres_be: z.string().optional(),
  nb_personnes_engagees: z.string().optional(),
  nb_beneficiaires: z.string().optional(),
  nb_activites: z.string().optional(),
  budget_annuel: z.string().optional(),
  type_financement: z.string().optional(),
  etat_cotisations: z.string().optional(),
  montant_cotisation: z.string().optional(),
  nom_president: z.string().optional(),
  sexe_president: z.string().optional(),
  mode_designation_president: z.string().optional(),
  duree_mandat_be: z.string().optional(),
  adhesion_crasc: z.string().optional(),
  type_document_formalisation: z.string().optional(),
  existence_siege: z.string().optional(),
  manuel_procedures: z.string().optional(),
  plan_action: z.string().optional(),
  rapports_annuels: z.string().optional(),
  niveau_regroupement: z.string().optional(),
  reseau_appartenance: z.string().optional(),
  secteurs_activites: z.string().optional(),
  populations_cibles: z.string().optional(),
  savoir_faire: z.string().optional(),
  difficultes: z.string().optional(),
  recommandations: z.string().optional(),
  thumbnail: z.instanceof(File).optional()
    .refine(f => !f || f.size <= 5 * 1024 * 1024, { message: "Max 5MB" })
    .refine(f => !f || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type), { message: "JPG/PNG/WebP uniquement" }),
});

type OscForm = z.infer<typeof oscSchema>;

interface IOscDetail {
  id: number; name: string; slug: string; description: string | null;
  thumbnail_url: string; thumbnail_path: string;
  type?: { id: number; name: string }; crasc?: { id: number; name: string };
  ville: string | null; email: string | null; phone: string | null;
  address: string | null; latitude: number | null; longitude: number | null;
  website?: string | null; reseaux_sociaux?: string | null;
  date_creation?: string | null; numero_recepisse?: string | null;
  niveau_couverture?: string | null; zone_couverture?: string | null;
  categorie?: string | null;
  poles?: { id: number; name: string; slug: string }[];
  nb_membres?: number | null; nb_femmes_membres?: number | null;
  nb_membres_jeunes?: number | null; nb_membres_be?: number | null;
  nb_personnes_engagees?: number | null; nb_beneficiaires?: number | null;
  nb_activites?: number | null; budget_annuel?: number | null;
  type_financement?: string | null; etat_cotisations?: string | null;
  montant_cotisation?: number | null; nom_president?: string | null; sexe_president?: string | null;
  mode_designation_president?: string | null; duree_mandat_be?: string | null;
  adhesion_crasc?: boolean | null; niveau_regroupement?: string | null; reseau_appartenance?: string | null;
  type_document_formalisation?: string | null;
  existence_siege?: boolean | null; manuel_procedures?: boolean | null;
  plan_action?: boolean | null; rapports_annuels?: boolean | null;
  secteurs_activites?: string | null; populations_cibles?: string | null;
  savoir_faire?: string | null; difficultes?: string | null;
  recommandations?: string | null;
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
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

export default function ModifierOscPage() {
  const params = useParams();
  const oscSlug = params.oscSlug as string;
  const router = useRouter();

  const [crascList, setCrascList] = useState<ICrasc[]>([]);
  const [typeList, setTypeList] = useState<IOscType[]>([]);
  const [allPoles, setAllPoles] = useState<Pole[]>([]);
  const [selectedPoleIds, setSelectedPoleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [osc, setOsc] = useState<IOscDetail | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAllCrasc().then(setCrascList).catch(console.error);
    fetchAllOscType().then(setTypeList).catch(console.error);
    fetch(`${API_BASE_URL}/api/v1/forum/poles?limit=50`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllPoles(Array.isArray(data) ? data : data.items ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!oscSlug) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`, { cache: "no-store" });
        if (!res.ok) throw new Error("OSC non trouvée");
        const data = await res.json();
        setOsc(data);
        setPreviewImage(data.thumbnail_url || null);
        if (Array.isArray(data.poles)) {
          setSelectedPoleIds(data.poles.map((p: Pole) => p.id));
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [oscSlug]);

  const { control, handleSubmit, formState: { errors }, setValue, watch, register } = useForm<OscForm>({
    resolver: zodResolver(oscSchema),
    defaultValues: {
      name: "", description: "", crasc_id: "", type_id: "",
      email: "", phone: "", ville: "", address: "", latitude: "", longitude: "",
      website: "", reseaux_sociaux: "", date_creation: "", numero_recepisse: "",
      niveau_couverture: "", zone_couverture: "", categorie: "",
      nb_membres: "", nb_femmes_membres: "", nb_membres_jeunes: "", nb_membres_be: "",
      nb_personnes_engagees: "", nb_beneficiaires: "", nb_activites: "",
      budget_annuel: "", type_financement: "", etat_cotisations: "", montant_cotisation: "",
      nom_president: "", sexe_president: "", mode_designation_president: "", duree_mandat_be: "", adhesion_crasc: "",
      type_document_formalisation: "", existence_siege: "", manuel_procedures: "", plan_action: "", rapports_annuels: "",
      niveau_regroupement: "", reseau_appartenance: "", secteurs_activites: "", populations_cibles: "",
      savoir_faire: "", difficultes: "", recommandations: "",
    },
  });

  useEffect(() => {
    if (!osc) return;
    const s = (v: any) => v != null ? String(v) : "";
    setValue("name", osc.name || "");
    setValue("description", osc.description || "");
    setValue("crasc_id", osc.crasc?.id ? String(osc.crasc.id) : "");
    setValue("type_id", osc.type?.id ? String(osc.type.id) : "");
    setValue("email", osc.email || "");
    setValue("phone", osc.phone || "");
    setValue("ville", osc.ville || "");
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
    setValue("nb_membres", s(osc.nb_membres));
    setValue("nb_femmes_membres", s(osc.nb_femmes_membres));
    setValue("nb_membres_jeunes", s(osc.nb_membres_jeunes));
    setValue("nb_membres_be", s(osc.nb_membres_be));
    setValue("nb_personnes_engagees", s(osc.nb_personnes_engagees));
    setValue("nb_beneficiaires", s(osc.nb_beneficiaires));
    setValue("nb_activites", s(osc.nb_activites));
    setValue("budget_annuel", s(osc.budget_annuel));
    setValue("type_financement", osc.type_financement || "");
    setValue("etat_cotisations", osc.etat_cotisations || "");
    setValue("montant_cotisation", s(osc.montant_cotisation));
    setValue("nom_president", osc.nom_president || "");
    setValue("sexe_president", osc.sexe_president || "");
    setValue("mode_designation_president", osc.mode_designation_president || "");
    setValue("duree_mandat_be", osc.duree_mandat_be || "");
    setValue("adhesion_crasc", osc.adhesion_crasc != null ? (osc.adhesion_crasc ? "true" : "false") : "");
    setValue("type_document_formalisation", osc.type_document_formalisation || "");
    setValue("existence_siege", osc.existence_siege != null ? (osc.existence_siege ? "true" : "false") : "");
    setValue("manuel_procedures", osc.manuel_procedures != null ? (osc.manuel_procedures ? "true" : "false") : "");
    setValue("plan_action", osc.plan_action != null ? (osc.plan_action ? "true" : "false") : "");
    setValue("rapports_annuels", osc.rapports_annuels != null ? (osc.rapports_annuels ? "true" : "false") : "");
    setValue("niveau_regroupement", osc.niveau_regroupement || "");
    setValue("reseau_appartenance", osc.reseau_appartenance || "");
    setValue("secteurs_activites", osc.secteurs_activites || "");
    setValue("populations_cibles", osc.populations_cibles || "");
    setValue("savoir_faire", osc.savoir_faire || "");
    setValue("difficultes", osc.difficultes || "");
    setValue("recommandations", osc.recommandations || "");
  }, [osc, setValue]);

  const thumbnailFile = watch("thumbnail");
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(thumbnailFile);
    }
  }, [thumbnailFile]);

  const onSubmit = async (values: OscForm) => {
    setLoading(true); setErrorMessage(null); setSuccessMessage(null);
    try {
      const fd = new FormData();
      const append = (key: string, val: any) => {
        if (val !== "" && val != null) fd.append(key, String(val));
      };
      append("name", values.name);
      append("description", values.description);
      append("crasc_id", values.crasc_id);
      append("type_id", values.type_id);
      append("email", values.email);
      append("phone", values.phone);
      append("ville", values.ville);
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
      append("nb_membres", values.nb_membres);
      append("nb_femmes_membres", values.nb_femmes_membres);
      append("nb_membres_jeunes", values.nb_membres_jeunes);
      append("nb_membres_be", values.nb_membres_be);
      append("nb_personnes_engagees", values.nb_personnes_engagees);
      append("nb_beneficiaires", values.nb_beneficiaires);
      append("nb_activites", values.nb_activites);
      append("budget_annuel", values.budget_annuel);
      append("type_financement", values.type_financement);
      append("etat_cotisations", values.etat_cotisations);
      append("montant_cotisation", values.montant_cotisation);
      append("nom_president", values.nom_president);
      append("sexe_president", values.sexe_president);
      append("mode_designation_president", values.mode_designation_president);
      append("duree_mandat_be", values.duree_mandat_be);
      append("adhesion_crasc", values.adhesion_crasc);
      append("type_document_formalisation", values.type_document_formalisation);
      append("existence_siege", values.existence_siege);
      append("manuel_procedures", values.manuel_procedures);
      append("plan_action", values.plan_action);
      append("rapports_annuels", values.rapports_annuels);
      append("niveau_regroupement", values.niveau_regroupement);
      append("reseau_appartenance", values.reseau_appartenance);
      append("secteurs_activites", values.secteurs_activites);
      append("populations_cibles", values.populations_cibles);
      append("savoir_faire", values.savoir_faire);
      append("difficultes", values.difficultes);
      append("recommandations", values.recommandations);
      if (values.thumbnail) fd.append("thumbnail", values.thumbnail);

      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`, { method: "PATCH", body: fd });
      if (res.ok) {
        // Mettre à jour les pôles (domaines prioritaires)
        await fetchWithAuth(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}/poles`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedPoleIds),
        });
        setSuccessMessage("OSC modifiée avec succès !");
        setTimeout(() => router.push(`/admin/gestion-des-crasc/osc/${oscSlug}`), 1500);
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

  if (fetchLoading) return (
    <div className="min-h-screen flex items-center justify-center font-poppins">
      <Loader2 className="w-10 h-10 text-[#2A591D] animate-spin" />
    </div>
  );

  if (!osc) return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-poppins">
      <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-800">{errorMessage || "OSC non trouvée"}</p>
        <Link href="/admin/gestion-des-crasc/osc" className="mt-4 inline-block text-blue-600 hover:underline text-sm">← Retour</Link>
      </div>
    </div>
  );

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
      {icon}{title}
    </h2>
  );

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

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
      <div className="mb-6">
        <Link href={`/admin/gestion-des-crasc/osc/${oscSlug}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />Retour aux détails
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#2A591D]" />Modifier {osc.name}
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
            <Field label="Nom de l'OSC" error={errors.name?.message}>
              <input {...register("name")} className={inputCls} placeholder="Nom complet" />
            </Field>
            <Field label="Description (max 500 car.)" error={errors.description?.message}>
              <textarea {...register("description")} rows={3} maxLength={500} className={textareaCls} placeholder="Description..." />
            </Field>
            <Field label="CRASC associé">
              <SelectField name="crasc_id" placeholder="Sélectionnez un CRASC"
                options={crascList.map(c => ({ value: String(c.id), label: c.name }))} />
            </Field>
            <Field label="Type d'OSC">
              <SelectField name="type_id" placeholder="Sélectionnez un type"
                options={typeList.map(t => ({ value: String(t.id), label: t.name }))} />
            </Field>
            <Field label="Catégorie">
              <input {...register("categorie")} className={inputCls} placeholder="Ex: Association communautaire" />
            </Field>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Phone className="w-5 h-5 text-blue-600" />} title="Contact & localisation" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" className={inputCls} placeholder="contact@osc.org" />
            </Field>
            <Field label="Téléphone">
              <input {...register("phone")} className={inputCls} placeholder="+225 XX XX XX XX" />
            </Field>
            <Field label="Ville">
              <input {...register("ville")} className={inputCls} placeholder="Abidjan" />
            </Field>
            <Field label="Adresse">
              <input {...register("address")} className={inputCls} placeholder="Quartier, rue..." />
            </Field>
            <Field label="Latitude">
              <input {...register("latitude")} className={inputCls} placeholder="5.316667" />
            </Field>
            <Field label="Longitude">
              <input {...register("longitude")} className={inputCls} placeholder="-4.033333" />
            </Field>
            <Field label="Site web">
              <input {...register("website")} className={inputCls} placeholder="https://..." />
            </Field>
            <Field label="Réseaux sociaux">
              <input {...register("reseaux_sociaux")} className={inputCls} placeholder="Facebook, Twitter..." />
            </Field>
          </div>
        </div>

        {/* Identité juridique */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-purple-600" />} title="Identité juridique" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Date de création">
              <input {...register("date_creation")} className={inputCls} placeholder="2010-01-15" />
            </Field>
            <Field label="N° récépissé">
              <input {...register("numero_recepisse")} className={inputCls} />
            </Field>
            <Field label="Niveau de couverture">
              <input {...register("niveau_couverture")} className={inputCls} placeholder="National, Régional..." />
            </Field>
            <Field label="Zone de couverture">
              <input {...register("zone_couverture")} className={inputCls} />
            </Field>
            <Field label="Adhésion CRASC">
              <SelectField name="adhesion_crasc" placeholder="Sélectionner"
                options={[{ value: "true", label: "Oui" }, { value: "false", label: "Non" }]} />
            </Field>
            <Field label="Niveau de regroupement">
              <SelectField name="niveau_regroupement" placeholder="Sélectionner" options={[
                { value: "Réseau", label: "Réseau" },
                { value: "Fédération", label: "Fédération" },
                { value: "Plateforme", label: "Plateforme" },
                { value: "Confédération", label: "Confédération" },
              ]} />
            </Field>
            <Field label="Réseau d'appartenance">
              <input {...register("reseau_appartenance")} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Autoévaluation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-[#E05017]" />} title="Autoévaluation de l’OSC" />
          <p className="text-sm text-gray-500 mb-4">Ces réponses déterminent automatiquement la note sur 20 et la couleur de l’OSC.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Niveau de formalisation">
              <SelectField name="type_document_formalisation" placeholder="Sélectionner le document le plus avancé" options={[
                { value: "statuts_reglement", label: "Statuts et règlement — 1 point" },
                { value: "recepisse_depot", label: "Récépissé de dépôt — 3 points" },
                { value: "recepisse_declaration", label: "Récépissé de déclaration — 5 points" },
                { value: "agrement_decret", label: "Agrément / décret — 5 points" },
                { value: "journal_officiel", label: "Déclaration au journal officiel — 7 points" },
              ]} />
            </Field>
            {[
              ["existence_siege", "Existence d’un siège — 3 points"],
              ["manuel_procedures", "Manuel de procédures — 3 points"],
              ["plan_action", "Plan d’action — 3 points"],
              ["rapports_annuels", "Rapports annuels d’activités — 3 points"],
            ].map(([name, label]) => (
              <Field key={name} label={label}>
                <SelectField name={name as keyof OscForm} placeholder="Sélectionner" options={[{ value: "true", label: "Oui" }, { value: "false", label: "Non" }]} />
              </Field>
            ))}
          </div>
        </div>

        {/* Domaines prioritaires / Pôles de concertation */}
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
          <div className="grid md:grid-cols-1 gap-4 mt-4">
            <Field label="Secteurs d'activités">
              <textarea {...register("secteurs_activites")} rows={3} className={textareaCls} />
            </Field>
            <Field label="Populations cibles">
              <textarea {...register("populations_cibles")} rows={3} className={textareaCls} />
            </Field>
          </div>
        </div>

        {/* Gouvernance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Users className="w-5 h-5 text-orange-500" />} title="Gouvernance" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nom du président">
              <input {...register("nom_president")} className={inputCls} placeholder="Prénom et nom" />
            </Field>
            <Field label="Sexe du président">
              <SelectField name="sexe_president" placeholder="Sélectionner"
                options={[{ value: "Masculin", label: "Masculin" }, { value: "Féminin", label: "Féminin" }]} />
            </Field>
            <Field label="Mode de désignation">
              <input {...register("mode_designation_president")} className={inputCls} placeholder="Élection, nomination..." />
            </Field>
            <Field label="Durée mandat BE">
              <input {...register("duree_mandat_be")} className={inputCls} placeholder="2 ans, 4 ans..." />
            </Field>
          </div>
        </div>

        {/* Membres */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Users className="w-5 h-5 text-green-600" />} title="Membres & bénéficiaires" />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["nb_membres", "Nb membres total"],
              ["nb_femmes_membres", "Nb femmes membres"],
              ["nb_membres_jeunes", "Nb membres jeunes"],
              ["nb_membres_be", "Nb membres BE"],
              ["nb_personnes_engagees", "Nb personnes engagées"],
              ["nb_beneficiaires", "Nb bénéficiaires"],
              ["nb_activites", "Nb activités"],
            ].map(([field, label]) => (
              <Field key={field} label={label}>
                <input {...register(field as keyof OscForm)} type="number" min="0" className={inputCls} />
              </Field>
            ))}
          </div>
        </div>

        {/* Financement */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<Wallet className="w-5 h-5 text-green-700" />} title="Financement" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Budget annuel (F CFA)">
              <input {...register("budget_annuel")} type="number" min="0" className={inputCls} />
            </Field>
            <Field label="Type de financement">
              <input {...register("type_financement")} className={inputCls} />
            </Field>
            <Field label="État des cotisations">
              <input {...register("etat_cotisations")} className={inputCls} />
            </Field>
            <Field label="Montant cotisation (F CFA)">
              <input {...register("montant_cotisation")} type="number" min="0" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Savoir-faire / difficultés */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionTitle icon={<FileText className="w-5 h-5 text-gray-600" />} title="Savoir-faire & recommandations" />
          <div className="space-y-4">
            <Field label="Savoir-faire / expertise">
              <textarea {...register("savoir_faire")} rows={3} className={textareaCls} />
            </Field>
            <Field label="Difficultés rencontrées">
              <textarea {...register("difficultes")} rows={3} className={textareaCls} />
            </Field>
            <Field label="Recommandations">
              <textarea {...register("recommandations")} rows={3} className={textareaCls} />
            </Field>
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
                <button type="button" onClick={e => { e.stopPropagation(); setValue("thumbnail", undefined); setPreviewImage(osc?.thumbnail_url || null); }}
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
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Modification...</> : <><Save className="w-5 h-5" />Enregistrer</>}
          </button>
          <Link href={`/admin/gestion-des-crasc/osc/${oscSlug}`}
            className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
            Annuler
          </Link>
        </div>
      </form>
    </section>
  );
}
