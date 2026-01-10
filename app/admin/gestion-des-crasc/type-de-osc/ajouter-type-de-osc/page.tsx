"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validation pour le formulaire d'ajout de Type de OSC
const oscTypeSchema = z.object({
  name: z.string().min(3, "Le type de OSC doit contenir au moins 3 caractères."),});

type OscTypeForm = z.infer<typeof oscTypeSchema>;


export default function AdminAjoutTypeOsc() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<OscTypeForm>({
    resolver: zodResolver(oscTypeSchema),
    defaultValues: { name: "" }
  });
  // Gestion de la soumission du formulaire
  const onSubmit = async (values: OscTypeForm) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/crasc/osc-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name
        }),
      });
      if (response.ok) {
        // Rediriger vers la page de gestion des crasc
        reset();
        router.push("/admin/gestion-des-crasc");
      }
    } catch (error) {
      console.error("Erreur lors de la création du type de osc: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter un type de OSC</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          Retour à la page de gestion des CRASC
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Type de OSC</label>
          <input
            id="name"
            type="text"
            {...control.register("name")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Association"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors cursor-pointer"
        >
          {loading ? "Ajout en cours..." : "Valider"}
        </button>
      </form>
    </section>
  )
}
