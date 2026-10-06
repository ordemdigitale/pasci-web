"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { API_ENDPOINTS } from "@/lib/api-config";
import { getToken } from "@/lib/auth";
import { Loader2, MapPin, Search } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Un CRASC se définit par les régions qu'il couvre : la sélection d'au moins
 * une région est donc obligatoire. Le nombre de CRASC n'est pas limité — un
 * 6e CRASC se crée exactement comme les cinq premiers.
 */
const crascSchema = z.object({
  name: z.string().min(5, "Le nom du CRASC doit contenir au moins 5 caractères."),
  description: z.string().optional(),
  email_pca: z.string().email("Adresse e-mail invalide.").optional().or(z.literal("")),
});

type CrascSchemaForm = z.infer<typeof crascSchema>;

interface IRegion {
  id: number;
  name: string;
  slug?: string | null;
  crasc_id?: number | null;
}

interface ICrascExistant {
  id: number;
  name: string;
  regions?: { id: number; name: string }[];
}

export default function AdminAddCrasc() {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [crascs, setCrascs] = useState<ICrascExistant[]>([]);
  const [regionsChoisies, setRegionsChoisies] = useState<number[]>([]);
  const [erreurRegions, setErreurRegions] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");
  const router = useRouter();

  const { handleSubmit, formState: { errors }, reset, register } = useForm<CrascSchemaForm>({
    resolver: zodResolver(crascSchema),
    defaultValues: { name: "", description: "", email_pca: "" },
  });

  useEffect(() => {
    fetch(`${API_ENDPOINTS.region.list}?limit=200`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRegions(Array.isArray(data) ? data : data?.items ?? []))
      .catch(() => setRegions([]));

    fetch(`${API_ENDPOINTS.crasc.list}?limit=50`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCrascs(Array.isArray(data) ? data : []))
      .catch(() => setCrascs([]));
  }, []);

  // Une région appartient à un seul CRASC : celles déjà prises sont affichées
  // mais non sélectionnables, avec le nom du CRASC qui les couvre.
  const crascParRegion = useMemo(() => {
    const index = new Map<number, string>();
    crascs.forEach((crasc) => (crasc.regions ?? []).forEach((region) => index.set(Number(region.id), crasc.name)));
    return index;
  }, [crascs]);

  const regionsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return regions;
    return regions.filter((region) => region.name.toLowerCase().includes(terme));
  }, [regions, recherche]);

  const basculerRegion = (id: number) => {
    setErreurRegions(null);
    setRegionsChoisies((precedentes) =>
      precedentes.includes(id) ? precedentes.filter((r) => r !== id) : [...precedentes, id],
    );
  };

  const onSubmit = async (values: CrascSchemaForm) => {
    if (regionsChoisies.length === 0) {
      setErreurRegions("Sélectionner au moins une région couverte par ce CRASC.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description?.trim()) formData.append("description", values.description.trim());
      if (values.email_pca?.trim()) formData.append("email_pca", values.email_pca.trim());
      formData.append("region_ids", JSON.stringify(regionsChoisies));

      const reponse = await fetch(`${API_BASE_URL}/api/v1/crasc/crasc`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      if (reponse.status === 201) {
        reset();
        setRegionsChoisies([]);
        router.push("/admin/gestion-des-crasc");
        return;
      }

      const corps = await reponse.json().catch(() => null);
      const detail = corps?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : detail?.errors?.map((e: { message: string }) => e.message).join("\n") ||
            `Erreur ${reponse.status} : ${reponse.statusText}`;
      alert(message);
    } catch (error) {
      console.error("Erreur lors de l'ajout du CRASC : ", error);
      alert("Erreur réseau. Vérifiez votre connexion et que l'API est en cours d'exécution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter un CRASC</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          ← Retour à la page de gestion des CRASC
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        {/* Nom du CRASC */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom du CRASC</label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="CRASC Sud-Ouest"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description (optionnelle)</label>
          <input
            id="description"
            type="text"
            {...register("description")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* E-mail du PCA */}
        <div className="mb-6">
          <label htmlFor="email_pca" className="block text-gray-700 font-medium mb-2">E-mail du PCA (optionnel)</label>
          <input
            id="email_pca"
            type="email"
            {...register("email_pca")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="pca@exemple.ci"
          />
          {errors.email_pca && <p className="text-red-500 text-sm mt-1">{errors.email_pca.message}</p>}
        </div>

        {/* Régions couvertes — obligatoire */}
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <label className="block font-medium text-gray-700">
              Régions couvertes <span className="text-red-500">*</span>
            </label>
            <span className="text-sm text-gray-500">
              {regionsChoisies.length} région{regionsChoisies.length > 1 ? "s" : ""} sélectionnée
              {regionsChoisies.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Ce sont les régions qui définissent la zone du CRASC. Une région déjà rattachée à un
            autre CRASC doit d&apos;abord en être détachée.
          </p>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Filtrer les régions…"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm"
            />
          </div>

          <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 p-2">
            {regionsFiltrees.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-400">Aucune région.</p>
            ) : (
              <div className="grid gap-1 sm:grid-cols-2">
                {regionsFiltrees.map((region) => {
                  const occupeePar = crascParRegion.get(Number(region.id));
                  const choisie = regionsChoisies.includes(Number(region.id));
                  return (
                    <label
                      key={region.id}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                        occupeePar ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"
                      }`}
                      title={occupeePar ? `Déjà rattachée à ${occupeePar}` : undefined}
                    >
                      <input
                        type="checkbox"
                        checked={choisie}
                        disabled={Boolean(occupeePar)}
                        onChange={() => basculerRegion(Number(region.id))}
                        className="h-4 w-4 rounded border-gray-300 text-[#2A591D] focus:ring-[#2A591D]"
                      />
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{region.name}</span>
                      {occupeePar && (
                        <span className="ml-auto flex-shrink-0 text-[11px] text-gray-400">{occupeePar}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          {erreurRegions && <p className="mt-1 text-sm text-red-500">{erreurRegions}</p>}
        </div>

        {/* Groupe de boutons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Valider"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setRegionsChoisies([]);
              setErreurRegions(null);
            }}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
