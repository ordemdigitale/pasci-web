"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrascRegion, IOsc } from "@/types/api.types";
import { fetchAllCrascRegions, fetchAllOsc } from "@/lib/fetch-crasc";

// Schema de validation pour le formulaire d'ajout d'actualité
const newsSchema = z.object({
  title: z.string().min(4, "Le titre de l'actualité doit contenir au moins 8 caractères."),
  crasc_id: z.string().optional(),
  osc_id: z.string().optional(),
});

type NewsForm = z.infer<typeof newsSchema>;

export default function AdminAjoutArticle() {
  const [crascRegions, setCrascRegions] = useState<ICrascRegion[]>([]);
  const [Osc, setOsc] = useState<IOsc[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Récupérer les régions CRASC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllCrascRegions()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux régions CRASC: ", error));
  }, []);
  // Récupérer les OSC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllOsc()
      .then(data => setOsc(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux OSC: ", error));
  }, []);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<NewsForm>({
    resolver: zodResolver(newsSchema),
    defaultValues: { title: "", crasc_id: "", osc_id: "" },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: NewsForm) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/crasc/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          crasc_id: values.crasc_id ? parseInt(values.crasc_id, 10) : undefined,
          osc_id: values.osc_id ? parseInt(values.osc_id, 10) : undefined,
        }),
      });
      if (response.ok) {
        // Rediriger vers la liste des régions civ ou afficher un message de succès
        reset();
        router.push("/admin/gestion-des-crasc");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une actualité: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter l&apos;actualité</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          Retour à la page de gestion des CRASC
        </Link>
      </div>

      {/* Le formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Titre de l&apos;actualité</label>
          <input
            id="title"
            type="text"
            {...control.register("title")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Tournées d'information"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="crasc_id" className="block text-gray-700 font-medium mb-2">CRASC associé</label>
          <Controller
            name="crasc_id"
            control={control}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value}>
                <Select.Trigger className="w-full p-2 border border-gray-300 rounded-lg text-left">
                  <Select.Value placeholder="Sélectionnez un CRASC" />
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
          <label htmlFor="osc_id" className="block text-gray-700 font-medium mb-2">OSC associée</label>
          <Controller
            name="osc_id"
            control={control}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value}>
                <Select.Trigger className="w-full p-2 border border-gray-300 rounded-lg text-left">
                  <Select.Value placeholder="Sélectionnez une OSC" />
                  <Select.Icon className="ml-2">▼</Select.Icon>
                </Select.Trigger>
                <Select.Content className="bg-white border border-gray-300 rounded-lg mt-1">
                  <Select.ScrollUpButton className="text-center p-2 cursor-pointer">▲</Select.ScrollUpButton>
                  <Select.Viewport>
                    {Osc.map((osc) => (
                      <Select.Item
                        key={osc.id}
                        value={osc.id.toString()}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Select.ItemText>{osc.name}</Select.ItemText>
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
