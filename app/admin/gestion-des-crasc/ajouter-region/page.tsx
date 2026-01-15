"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IRegionCiv } from "@/types/api.types";
import { fetchAllCrasc, fetchAllRegion } from "@/lib/fetch-crasc";

// Schema de validation pour le formulaire d'ajout de région CIV
const regionCivSchema = z.object({
  name: z.string().min(4, "Le nom de la région doit contenir au moins 4 caractères."),
  crasc_id: z.string().min(1, "Veuillez sélectionner un CRASC pour cette région."),
});

type RegionCivForm = z.infer<typeof regionCivSchema>;

export default function AdminAddRegionCiv() {
  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Récupérer les régions CRASC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllCrasc()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux régions CRASC: ", error));
  }, [])

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<RegionCivForm>({
    resolver: zodResolver(regionCivSchema),
    defaultValues: { name: "", crasc_id: "" },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: RegionCivForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.crasc_id) {
        formData.append("crasc_id", values.crasc_id);
      }
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        if (xhr.status === 201) {
          reset();
          router.push("/admin/gestion-des-crasc");
        } else {
          // Parse error response
          let errorMessage = "Une erreur est survenue lors de l'ajout de region.";
          let fieldErrors: Record<string, string> = {};

          try {
            const response = JSON.parse(xhr.responseText);

            if(response.detail) {
              // Handle structured error response
              if (typeof response.detail === 'string') {
                errorMessage = response.detail;
              } else if (response.detail.type === 'duplicate_error' && response.detail.errors) {
                // Handle duplicate title error
                response.detail.errors.forEach((error: any) => {
                  if (error.field === 'name') {
                    errorMessage = error.message;
                    fieldErrors.title = error.message;
                  }
                });
              }
            }
          } catch (e) {
            // Response is not JSON or parsing failed
            errorMessage = `Erreur ${xhr.status}: ${xhr.statusText}`;
          }
          // Show error message
          alert(errorMessage);
          // If we have field-specific errors, we could set them in form state
          // For now, we just log them
          if (Object.keys(fieldErrors).length > 0) {
            console.log("Field errors:", fieldErrors);
          }
        }
        setLoading(false);
      };
      
      xhr.onerror = () => {
        console.error("Erreur réseau lors de l'envoi du formulaire");
        alert("Erreur réseau. Vérifiez votre connexion et que l'API est en cours d'exécution.");
        setLoading(false);
      };
      
      xhr.open("POST", "http://localhost:8000/api/v1/crasc/region");
      xhr.send(formData);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une région: ", error);
      alert("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter une région</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          ← Retour à la page de gestion des CRASC
        </Link>
      </div>

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
          <label htmlFor="crasc_id" className="block text-gray-700 font-medium mb-2">Région CRASC associée</label>
          <Controller
            name="crasc_id"
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
          {errors.crasc_id && <p className="text-red-500 text-sm mt-1">{errors.crasc_id.message}</p>}
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
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
            }}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  )
}
