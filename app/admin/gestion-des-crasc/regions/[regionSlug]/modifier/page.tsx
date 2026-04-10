"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IRegionCiv } from "@/types/api.types";
import { fetchAllCrasc, getRegionBySlug, updateRegion } from "@/lib/fetch-crasc";
import { MapPin, Loader2, ArrowLeft, Save } from 'lucide-react';

const regionSchema = z.object({
  name: z.string().min(4, "Le nom de la région doit contenir au moins 4 caractères."),
  crasc_id: z.string().optional(),
});

type RegionForm = z.infer<typeof regionSchema>;

export default function ModifierRegionPage({ params }: { params: Promise<{ regionSlug: string }> }) {
  const resolvedParams = use(params);
  const regionSlug = resolvedParams.regionSlug;
  const router = useRouter();

  const [region, setRegion] = useState<IRegionCiv | null>(null);
  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<RegionForm>({
    resolver: zodResolver(regionSchema),
    defaultValues: { name: "", crasc_id: "" },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [regionData, crascData] = await Promise.all([
          getRegionBySlug(regionSlug),
          fetchAllCrasc()
        ]);
        setRegion(regionData);
        setCrascRegions(crascData);
        reset({
          name: regionData.name,
          crasc_id: regionData.crasc_id?.toString() || ""
        });
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [regionSlug, reset]);

  const onSubmit = async (values: RegionForm) => {
    if (!region) return;

    setSubmitting(true);
    try {
      await updateRegion(region.slug, {
        name: values.name,
        crasc_id: values.crasc_id ? parseInt(values.crasc_id) : undefined
      });
      router.push("/admin/gestion-des-crasc/regions");
    } catch (err: any) {
      alert(err.message || "Erreur lors de la mise à jour de la région");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#2A591D] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !region) {
    return (
      <div className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Erreur</h2>
          <p className="text-red-700">{error || "Région non trouvée"}</p>
          <Link
            href="/admin/gestion-des-crasc/regions"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Retour à la liste des régions et districts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/gestion-des-crasc/regions"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des régions et districts
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-green-600" />
          Modifier la région
        </h2>
        <p className="text-gray-600 mt-2">Modifiez les informations de la région {region.name}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Nom de la région <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...control.register("name")}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2A591D] focus:outline-none transition-colors"
            placeholder="Ex: Agnéby-Tiassa"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="crasc_id" className="block text-gray-700 font-semibold mb-2">
            CRASC associé
          </label>
          <Controller
            name="crasc_id"
            control={control}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value ?? undefined}>
                <Select.Trigger className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors">
                  <Select.Value placeholder="Sélectionnez un CRASC" />
                  <Select.Icon className="ml-2 text-gray-500">▼</Select.Icon>
                </Select.Trigger>
                <Select.Content className="bg-white border-2 border-gray-300 rounded-lg shadow-lg mt-1 overflow-hidden z-50">
                  <Select.ScrollUpButton className="text-center p-2 cursor-pointer hover:bg-gray-100">▲</Select.ScrollUpButton>
                  <Select.Viewport>
                    <Select.Item
                      value=""
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic"
                    >
                      <Select.ItemText>Aucun CRASC</Select.ItemText>
                    </Select.Item>
                    {crascRegions.map((crasc) => (
                      <Select.Item
                        key={crasc.id}
                        value={crasc.id.toString()}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                      >
                        <Select.ItemText>{crasc.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="text-center p-2 cursor-pointer hover:bg-gray-100">▼</Select.ScrollDownButton>
                </Select.Content>
              </Select.Root>
            )}
          />
          {errors.crasc_id && (
            <p className="text-red-500 text-sm mt-1">{errors.crasc_id.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </>
            )}
          </button>

          <Link
            href="/admin/gestion-des-crasc/regions"
            className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Annuler
          </Link>
        </div>
      </form>
    </section>
  );
}
