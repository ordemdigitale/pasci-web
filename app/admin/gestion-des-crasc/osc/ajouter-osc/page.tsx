"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrascRegion, IOscType } from "@/types/api.types";
import { fetchAllCrascRegions, fetchAllOscType } from "@/lib/fetch-crasc";

// Schema de validation pour le formulaire d'ajout de région CIV
const oscSchema = z.object({
  name: z.string().min(4, "Le nom de l'OSC doit contenir au moins 4 caractères."),
  description: z.string().min(4, "Veuillez renseigner une description."),
  region_id: z.string().min(1, "Veuillez sélectionner un CRASC."),
  type_id: z.string().min(1, "Veuillez sélectionner un type de OSC."),
});

type OscForm = z.infer<typeof oscSchema>;

export default function AdminAjoutOsc() {
  const [crascRegions, setCrascRegions] = useState<ICrascRegion[]>([]);
  const [oscType, setOscType] = useState<IOscType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Récupérer les régions CRASC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllCrascRegions()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux régions CRASC: ", error));
  }, []);
  // Récupérer les types de OSC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllOscType()
      .then(data => setOscType(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux types de OSC: ", error));
  }, []);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<OscForm>({
    resolver: zodResolver(oscSchema),
    defaultValues: { name: "", description: "", region_id: "", type_id: "" },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: OscForm) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/crasc/osc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          region_id: parseInt(values.region_id, 10),
          type_id: parseInt(values.type_id, 10),
        }),
      });
      if (response.ok) {
        // Rediriger vers la liste des régions civ ou afficher un message de succès
        reset();
        router.push("/admin/gestion-des-crasc");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une OSC': ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter une OSC</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          Retour à la page de gestion des CRASC
        </Link>
      </div>

      {/* Le formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom de l&apos;OSC</label>
          <input
            id="name"
            type="text"
            {...control.register("name")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
          <input
            id="description"
            type="text"
            {...control.register("description")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="crasc_region_id" className="block text-gray-700 font-medium mb-2">CRASC associé</label>
          <Controller
            name="region_id"
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
        </div>
        <div className="mb-4">
          <label htmlFor="type_id" className="block text-gray-700 font-medium mb-2">Type de OSC</label>
          <Controller
            name="type_id"
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
                    {oscType.map((type) => (
                      <Select.Item
                        key={type.id}
                        value={type.id.toString()}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Select.ItemText>{type.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="text-center p-2 cursor-pointer">▼</Select.ScrollDownButton>
                </Select.Content>
              </Select.Root>
            )}
          />
        </div>        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors cursor-pointer"
        >
          {loading ? "Ajout en cours..." : "Valider"}
        </button>
        {" "}
        <button type="button" className="cursor-pointer hover:underline text-slate-500" onClick={() => { reset(); }}>Annuler</button>
      </form>
    </section>
  )
}
