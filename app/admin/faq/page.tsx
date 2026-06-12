"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth";
import { Check, CircleHelp, Edit, Eye, EyeOff, Loader2, Plus, Trash2, X } from "lucide-react";
import { IFaq } from "@/types/api.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type FaqForm = {
  question: string;
  answer: string;
  ordre: number;
  is_active: boolean;
};

const EMPTY: FaqForm = {
  question: "",
  answer: "",
  ordre: 0,
  is_active: true,
};

async function getApiErrorMessage(res: Response, fallback: string) {
  const raw = await res.text().catch(() => "");
  let detail = "";

  if (raw) {
    try {
      const payload = JSON.parse(raw);
      if (typeof payload?.detail === "string") {
        detail = payload.detail;
      } else if (Array.isArray(payload?.detail)) {
        detail = payload.detail
          .map((item: { msg?: string }) => item.msg)
          .filter(Boolean)
          .join(", ");
      }
    } catch {
      detail = raw;
    }
  }

  if (res.status === 404 && (!detail || detail === "Not Found")) {
    return `${fallback} Endpoint FAQ introuvable sur l'API appelée (${res.status}).`;
  }

  return detail ? `${fallback} ${detail}` : `${fallback} Erreur API ${res.status}.`;
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IFaq | null>(null);
  const [form, setForm] = useState<FaqForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/faq/all`);
      if (!res.ok) throw new Error(await getApiErrorMessage(res, "Impossible de charger la FAQ."));
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Impossible de charger la FAQ.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, ordre: faqs.length + 1 });
    setShowForm(true);
  }

  function openEdit(faq: IFaq) {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      ordre: faq.ordre,
      is_active: faq.is_active,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        question: form.question.trim(),
        answer: form.answer.trim(),
      };
      const res = await fetchWithAuth(
        editing ? `${API_BASE}/api/v1/faq/${editing.id}` : `${API_BASE}/api/v1/faq/`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(await getApiErrorMessage(res, "Enregistrement impossible."));
      setShowForm(false);
      await load();
    } catch (err: any) {
      setError(err.message || "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(faq: IFaq) {
    const nextActive = !faq.is_active;
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/faq/${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextActive }),
      });
      if (!res.ok) throw new Error(await getApiErrorMessage(res, "Mise à jour impossible."));
      setFaqs((prev) => prev.map((item) => item.id === faq.id ? { ...item, is_active: nextActive } : item));
    } catch (err: any) {
      setError(err.message || "Mise à jour impossible.");
    }
  }

  async function handleDelete(faq: IFaq) {
    if (!confirm(`Supprimer "${faq.question}" ?`)) return;
    setDeletingId(faq.id);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/faq/${faq.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await getApiErrorMessage(res, "Suppression impossible."));
      setFaqs((prev) => prev.filter((item) => item.id !== faq.id));
    } catch (err: any) {
      setError(err.message || "Suppression impossible.");
    } finally {
      setDeletingId(null);
    }
  }

  const sortedFaqs = [...faqs].sort((a, b) => a.ordre - b.ordre || a.id - b.id);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <CircleHelp className="w-6 h-6 text-[#E05017]" /> FAQ
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {faqs.length} question{faqs.length !== 1 ? "s" : ""} enregistrée{faqs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter une question
          </button>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : sortedFaqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            Aucune question FAQ enregistrée.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {sortedFaqs.map((faq) => (
                <div key={faq.id} className={`px-5 py-4 ${!faq.is_active ? "opacity-50" : ""}`}>
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#E05017]">
                      {faq.ordre}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{faq.question}</p>
                      <p className="mt-1 text-sm text-gray-500 leading-6">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleToggle(faq)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={faq.is_active ? "Désactiver" : "Activer"}>
                        {faq.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(faq)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(faq)} disabled={deletingId === faq.id} className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-40">
                        {deletingId === faq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">{editing ? "Modifier la question" : "Ajouter une question"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Question <span className="text-red-500">*</span></label>
                <input
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  placeholder="Ex: Comment adhérer au CRASC ?"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Réponse <span className="text-red-500">*</span></label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  placeholder="Réponse affichée sur la page Services..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ordre d&apos;affichage</label>
                  <input
                    type="number"
                    min="0"
                    value={form.ordre}
                    onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#E05017]"
                    />
                    <span className="text-sm text-gray-700">Actif</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.question.trim() || !form.answer.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#E05017] text-white rounded-lg text-sm font-semibold hover:bg-[#c44315] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Ajouter"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
