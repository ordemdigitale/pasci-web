"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllCrasc, fetchEvenements, deleteEvenement } from "@/lib/fetch-crasc";
import { getToken } from "@/lib/auth";
import { ICrasc, IEvenement } from "@/types/api.types";
import {
  CalendarDays,
  Plus,
  Trash2,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";

export default function AdminAgendaPage() {
  const [crascs, setCrascs] = useState<ICrasc[]>([]);
  const [selectedCrascId, setSelectedCrascId] = useState<number | null>(null);
  const [evenements, setEvenements] = useState<IEvenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCrasc()
      .then((data) => {
        setCrascs(data);
        if (data.length > 0) setSelectedCrascId(parseInt(data[0].id));
      })
      .catch(() => setError("Impossible de charger les CRASC."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCrascId) return;
    setLoading(true);
    fetchEvenements(selectedCrascId, false)
      .then(setEvenements)
      .catch(() => setError("Impossible de charger les événements."))
      .finally(() => setLoading(false));
  }, [selectedCrascId]);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet événement ?")) return;
    const token = getToken();
    if (!token) return setError("Non authentifié.");
    setDeleting(id);
    try {
      await deleteEvenement(id, token);
      setEvenements((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  const upcoming = evenements.filter((e) => new Date(e.date_debut) >= new Date());
  const past = evenements.filter((e) => new Date(e.date_debut) < new Date());

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion de l'Agenda</h1>
            <p className="text-white/80 mt-1">Gérez les événements de chaque CRASC</p>
          </div>
        </div>
        <Link
          href="/admin/gestion-des-crasc"
          className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la gestion des CRASC
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        {/* CRASC Selector */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2A591D]" />
              CRASC
            </h3>
            <div className="space-y-1">
              {crascs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrascId(parseInt(c.id))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCrascId === parseInt(c.id)
                      ? "bg-[#2A591D] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Événements {selectedCrascId ? `— ${crascs.find(c => parseInt(c.id) === selectedCrascId)?.name}` : ""}
            </h2>
            <Link
              href={`/admin/gestion-des-crasc/agenda/ajouter-evenement${selectedCrascId ? `?crasc_id=${selectedCrascId}` : ""}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#3d7a28] transition-colors font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter un événement
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#2A591D]" />
            </div>
          ) : (
            <>
              {/* Upcoming */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  À venir ({upcoming.length})
                </h3>
                {upcoming.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">Aucun événement à venir.</p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((evt) => (
                      <EventCard key={evt.id} evt={evt} onDelete={handleDelete} deleting={deleting} />
                    ))}
                  </div>
                )}
              </div>

              {/* Past */}
              {past.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Passés ({past.length})
                  </h3>
                  <div className="space-y-3 opacity-60">
                    {past.map((evt) => (
                      <EventCard key={evt.id} evt={evt} onDelete={handleDelete} deleting={deleting} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({
  evt,
  onDelete,
  deleting,
}: {
  evt: IEvenement;
  onDelete: (id: number) => void;
  deleting: number | null;
}) {
  const debut = new Date(evt.date_debut);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#2A591D] flex flex-col items-center justify-center text-white font-bold">
        <span className="text-lg leading-none">{debut.getDate().toString().padStart(2, "0")}</span>
        <span className="text-xs uppercase">{debut.toLocaleDateString("fr-FR", { month: "short" })}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 line-clamp-1">{evt.title}</p>
        {evt.description && <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{evt.description}</p>}
        <div className="flex flex-wrap gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {debut.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            {evt.date_fin && (
              <> – {new Date(evt.date_fin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</>
            )}
          </span>
          {evt.lieu && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {evt.lieu}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(evt.id)}
        disabled={deleting === evt.id}
        className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {deleting === evt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
