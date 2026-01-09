"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrascRegion, IRegionCiv } from "@/types/api.types";
import { fetchAllCrascRegions, fetchAllRegionCiv } from "@/lib/fetch-crasc";

// Schema de validation pour le formulaire d'ajout de région CIV
const regionCivSchema = z.object({
  name: z.string().min(4, "Le nom de la région doit contenir au moins 4 caractères."),
  crasc_region_id: z.string().min(1, "Veuillez sélectionner un CRASC pour cette région."),
});

type RegionCivForm = z.infer<typeof regionCivSchema>;

export default function AdminAddRegionCiv() {
  const [crascRegions, setCrascRegions] = useState<ICrascRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Récupérer les régions CRASC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllCrascRegions()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux régions CRASC: ", error));
  }, [])

  const { control, handleSubmit, formState: { errors }, reset } = useForm<RegionCivForm>({
    resolver: zodResolver(regionCivSchema),
    defaultValues: { name: "", crasc_region_id: "" },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: RegionCivForm) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/crasc/region-civ-with-crasc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          crasc_region_id: parseInt(values.crasc_region_id, 10)
        }),
      });
      if (response.ok) {
        // Rediriger vers la liste des régions civ ou afficher un message de succès
        reset();
        router.push("/admin/gestion-des-crasc");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la région CIV: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <h2 className="text-2xl font-bold text-gray-900">Ajouter une région</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom de la région CIV</label>
          <input
            id="name"
            type="text"
            {...control.register("name")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="crasc_region_id" className="block text-gray-700 font-medium mb-2">Région CRASC associée</label>
          <Controller
            name="crasc_region_id"
            control={control}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value}>
                <Select.Trigger className="w-full p-2 border border-gray-300 rounded-lg text-left">
                  <Select.Value placeholder="Sélectionnez une région CRASC" />
                  <Select.Icon className="ml-2">▼</Select.Icon>
                </Select.Trigger>
                <Select.Content className="bg-white border border-gray-300 rounded-lg mt-1">
                  <Select.ScrollUpButton className="text-center p-2 cursor-pointer">▲</Select.ScrollUpButton>
                  <Select.Viewport>
                    {crascRegions.map((region) => (
                      <Select.Item
                        key={region.id}
                        value={region.id.toString()}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Select.ItemText>{region.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="text-center p-2 cursor-pointer">▼</Select.ScrollDownButton>
                </Select.Content>
              </Select.Root>
            )}
          />
          {errors.crasc_region_id && <p className="text-red-500 text-sm mt-1">{errors.crasc_region_id.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors cursor-pointer"
        >
          {loading ? "Ajout en cours..." : "Ajouter la région"}
        </button>
      </form>

      <div>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">Retour à la page de gestion des CRASC</Link>
      </div>
    </section>
  )
}
