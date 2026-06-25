"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateEvenement, fetchAllCrasc } from "@/lib/fetch-crasc";
import { getToken } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { ICrasc, IEvenement } from "@/types/api.types";
import {
  CalendarDays, ArrowLeft, Check, Loader2, AlertCircle,
  MapPin, Clock, FileText, Building2, ChevronDown,
} from "lucide-react";

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export default function ModifierEvenementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const isCrascAdmin = !!currentUser?.is_staff && !currentUser?.is_superuser && !!currentUser?.crasc_id;

  const [crascs, setCrascs] = useState<ICrasc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", date_debut: "", date_fin: "", lieu: "", crasc_id: "",
  });

  useEffect(() => {
    async function load() {
      try {
        if (!isCrascAdmin) {
          const crascData = await fetchAllCrasc();
          setCrascs(crascData);
        }
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/v1/crasc/evenement/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Événement introuvable.");
        const evt: IEvenement = await res.json();
        setForm({
          title: evt.title,
          description: evt.description || "",
          date_debut: toDatetimeLocal(evt.date_debut),
          date_fin: toDatetimeLocal(evt.date_fin),
          lieu: evt.lieu || "",
          crasc_id: evt.crasc_id ? String(evt.crasc_id) : "",
        });
      } catch (e: any) {
        setError(e.message || "Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isCrascAdmin]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Le titre est obligatoire.");
    if (!form.date_debut) return setError("La date de début est obligatoire.");
    const token = getToken();
    if (!token) return setError("Vous devez être connecté.");
    setSaving(true);
    setError(null);
    try {
      await updateEvenement(Number(id), {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        date_debut: new Date(form.date_debut).toISOString(),
        date_fin: form.date_fin ? new Date(form.date_fin).toISOString() : undefined,
        lieu: form.lieu.trim() || undefined,
        crasc_id: form.crasc_id ? parseInt(form.crasc_id) : undefined,
      }, token);
      setSuccess(true);
      setTimeout(() => router.push("/admin/gestion-des-crasc/agenda"), 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 font-poppins">
      <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl"><CalendarDays className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold">Modifier l&apos;événement</h1>
            <p className="text-white/80 mt-1">Mettez à jour les informations de l&apos;événement</p>
          </div>
        </div>
        <Link href="/admin/gestion-des-crasc/agenda" className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />Retour à l&apos;agenda
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#2A591D]" /></div>
      ) : (
        <>
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">Événement mis à jour avec succès !</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <FileText className="w-5 h-5 text-[#2A591D]" />
                <h2 className="text-xl font-bold text-gray-900">Informations</h2>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre <span className="text-red-500">*</span></label>
                <input name="title" type="text" value={form.title} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all resize-none" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <Clock className="w-5 h-5 text-[#2A591D]" />
                <h2 className="text-xl font-bold text-gray-900">Date &amp; Heure</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Début <span className="text-red-500">*</span></label>
                  <input name="date_debut" type="datetime-local" value={form.date_debut} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fin (optionnel)</label>
                  <input name="date_fin" type="datetime-local" value={form.date_fin} min={form.date_debut} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-[#2A591D]" />
                <h2 className="text-xl font-bold text-gray-900">Lieu &amp; Association</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu</label>
                  <input name="lieu" type="text" value={form.lieu} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all" />
                </div>
                {!isCrascAdmin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building2 className="inline w-4 h-4 mr-1" />CRASC associé
                    </label>
                    <div className="relative">
                      <select name="crasc_id" value={form.crasc_id} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent appearance-none transition-all">
                        <option value="">Sélectionnez un CRASC</option>
                        {crascs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <button type="button" onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Annuler
              </button>
              <button type="submit" disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-[#2A591D] to-[#3d7a28] text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center gap-2">
                {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Enregistrement...</> : <><Check className="w-5 h-5" />Enregistrer les modifications</>}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
