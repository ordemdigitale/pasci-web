"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/auth";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Eye,
  Loader2,
  Lock,
  Plus,
  Trash2,
  Vote,
} from "lucide-react";
import {
  ForumSondageResultsVisibility,
  ForumSondageStatus,
  IForumSondage,
} from "@/types/api.types";

const VISIBILITY_OPTIONS: { value: ForumSondageResultsVisibility; label: string }[] = [
  { value: "after_vote", label: "Après le vote" },
  { value: "always", label: "Toujours visibles" },
  { value: "after_close", label: "Après fermeture" },
];

function formatDateTime(value?: string | null) {
  if (!value) return "Sans date limite";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPoleSondagesPage() {
  const params = useParams();
  const poleSlug = params.poleSlug as string;

  const [poleName, setPoleName] = useState("");
  const [sondages, setSondages] = useState<IForumSondage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [resultsVisibility, setResultsVisibility] = useState<ForumSondageResultsVisibility>("after_vote");
  const [closesAt, setClosesAt] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(API_ENDPOINTS.forum.poleBySlug(poleSlug)).then((res) => res.json()),
      fetchWithAuth(API_ENDPOINTS.forum.sondages(poleSlug)).then((res) => res.json()),
    ])
      .then(([poleData, sondagesData]) => {
        setPoleName(poleData.name || poleSlug);
        setSondages(Array.isArray(sondagesData) ? sondagesData : []);
      })
      .catch(() => setError("Impossible de charger les sondages."))
      .finally(() => setLoading(false));
  }, [poleSlug]);

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((option, i) => (i === index ? value : option)));
  }

  function resetForm() {
    setQuestion("");
    setDescription("");
    setOptions(["", ""]);
    setResultsVisibility("after_vote");
    setClosesAt("");
  }

  async function handleCreateSondage(e: React.FormEvent) {
    e.preventDefault();
    const filteredOptions = options.map((option) => option.trim()).filter(Boolean);
    if (!question.trim()) {
      setError("La question du sondage est obligatoire.");
      return;
    }
    if (filteredOptions.length < 2) {
      setError("Ajoutez au moins deux choix.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.forum.sondages(poleSlug), {
        method: "POST",
        body: JSON.stringify({
          question: question.trim(),
          description: description.trim() || undefined,
          options: filteredOptions,
          results_visibility: resultsVisibility,
          closes_at: closesAt ? new Date(closesAt).toISOString() : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Création impossible.");
      }
      const created: IForumSondage = await res.json();
      setSondages((prev) => [created, ...prev]);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Création impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(sondage: IForumSondage) {
    const nextStatus: ForumSondageStatus = sondage.status === "ouvert" ? "ferme" : "ouvert";
    setUpdatingId(sondage.id);
    setError("");
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.forum.sondage(sondage.id), {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      const updated: IForumSondage = await res.json();
      setSondages((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(sondage: IForumSondage) {
    if (!confirm(`Supprimer le sondage "${sondage.question}" ?`)) return;
    setDeletingId(sondage.id);
    setError("");
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.forum.sondage(sondage.id), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Suppression impossible.");
      setSondages((prev) => prev.filter((item) => item.id !== sondage.id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/forum/poles"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E05017] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux pôles
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Sondages</h1>
            <p className="text-gray-500 text-sm mt-1">{poleName}</p>
          </div>
          <Link
            href={`/espace-collaboratif/pole-concertation/${poleSlug}`}
            target="_blank"
            className="text-sm text-[#E05017] hover:underline flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> Voir sur le site
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateSondage} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Vote className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-900">Nouveau sondage</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Question</label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                placeholder="Ex: Valider le calendrier proposé ?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                placeholder="Contexte ou précision optionnelle..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choix</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder={`Choix ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOptions((prev) => [...prev, ""])}
                className="mt-2 inline-flex items-center gap-1 text-sm text-[#E05017] hover:underline"
              >
                <Plus className="w-4 h-4" /> Ajouter un choix
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Résultats visibles</label>
                <select
                  value={resultsVisibility}
                  onChange={(e) => setResultsVisibility(e.target.value as ForumSondageResultsVisibility)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                >
                  {VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date limite</label>
                <input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Créer le sondage
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : sondages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun sondage dans ce pôle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sondages.map((sondage) => (
              <div key={sondage.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{sondage.question}</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          sondage.status === "ouvert"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {sondage.status === "ouvert" ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {sondage.status === "ouvert" ? "Ouvert" : "Fermé"}
                      </span>
                    </div>
                    {sondage.description && (
                      <p className="text-sm text-gray-500">{sondage.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(sondage.closes_at)} · {sondage.total_votes} vote{sondage.total_votes !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleStatus(sondage)}
                      disabled={updatingId === sondage.id}
                      className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {updatingId === sondage.id ? "..." : sondage.status === "ouvert" ? "Fermer" : "Réouvrir"}
                    </button>
                    <button
                      onClick={() => handleDelete(sondage)}
                      disabled={deletingId === sondage.id}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === sondage.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {sondage.options.map((option) => (
                    <div key={option.id}>
                      <div className="flex justify-between gap-3 text-sm mb-1">
                        <span className="font-medium text-gray-700">{option.label}</span>
                        <span className="text-gray-500">{option.votes_count} vote{option.votes_count !== 1 ? "s" : ""} · {option.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#E05017]"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
