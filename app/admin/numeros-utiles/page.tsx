"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/auth";
import { Phone, Plus, Edit, Trash2, Loader2, Eye, EyeOff, X, Check } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface NumeroUtile {
  id: number;
  categorie: string;
  label: string;
  numero: string;
  description: string | null;
  ordre: number;
  is_active: boolean;
}

const EMPTY: Omit<NumeroUtile, "id"> = {
  categorie: "",
  label: "",
  numero: "",
  description: "",
  ordre: 0,
  is_active: true,
};

export default function AdminNumerosUtilesPage() {
  const [numeros, setNumeros] = useState<NumeroUtile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NumeroUtile | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("Toutes");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/numeros-utiles/all`);
      const data = await res.json();
      setNumeros(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(n: NumeroUtile) {
    setEditing(n);
    setForm({ categorie: n.categorie, label: n.label, numero: n.numero, description: n.description || "", ordre: n.ordre, is_active: n.is_active });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.categorie.trim() || !form.label.trim() || !form.numero.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, description: form.description || null };
      if (editing) {
        await fetchWithAuth(`${API_BASE}/api/v1/numeros-utiles/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithAuth(`${API_BASE}/api/v1/numeros-utiles/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(n: NumeroUtile) {
    await fetchWithAuth(`${API_BASE}/api/v1/numeros-utiles/${n.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !n.is_active }),
    });
    setNumeros((prev) => prev.map((x) => x.id === n.id ? { ...x, is_active: !x.is_active } : x));
  }

  async function handleDelete(n: NumeroUtile) {
    if (!confirm(`Supprimer "${n.label}" ?`)) return;
    setDeletingId(n.id);
    try {
      await fetchWithAuth(`${API_BASE}/api/v1/numeros-utiles/${n.id}`, { method: "DELETE" });
      setNumeros((prev) => prev.filter((x) => x.id !== n.id));
    } finally {
      setDeletingId(null);
    }
  }

  const categories = ["Toutes", ...Array.from(new Set(numeros.map((n) => n.categorie))).sort()];
  const filtered = filterCat === "Toutes" ? numeros : numeros.filter((n) => n.categorie === filterCat);

  // Group by category for display
  const grouped = filtered.reduce<Record<string, NumeroUtile[]>>((acc, n) => {
    if (!acc[n.categorie]) acc[n.categorie] = [];
    acc[n.categorie].push(n);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Phone className="w-6 h-6 text-[#E05017]" /> Numéros utiles
            </h1>
            <p className="text-gray-500 text-sm mt-1">{numeros.length} numéro{numeros.length !== 1 ? "s" : ""} enregistré{numeros.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un numéro
          </button>
        </div>

        {/* Filtre catégorie */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === c ? "bg-[#E05017] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                  <h2 className="font-bold text-gray-800 text-sm">{cat} <span className="text-gray-400 font-normal ml-1">({items.length})</span></h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.sort((a, b) => a.ordre - b.ordre).map((n) => (
                    <div key={n.id} className={`flex items-center gap-4 px-5 py-3 ${!n.is_active ? "opacity-50" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                        {n.description && <p className="text-xs text-gray-400">{n.description}</p>}
                      </div>
                      <span className="font-bold text-[#E05017] text-sm whitespace-nowrap">{n.numero}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleToggle(n)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={n.is_active ? "Désactiver" : "Activer"}>
                          {n.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(n)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(n)} disabled={deletingId === n.id} className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-40">
                          {deletingId === n.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">{editing ? "Modifier le numéro" : "Ajouter un numéro"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie <span className="text-red-500">*</span></label>
                <input
                  list="cats-list"
                  value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  placeholder="Ex: Urgences médicales"
                />
                <datalist id="cats-list">
                  {Array.from(new Set(numeros.map((n) => n.categorie))).map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nom du service <span className="text-red-500">*</span></label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  placeholder="Ex: SAMU"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Numéro / Email <span className="text-red-500">*</span></label>
                <input
                  value={form.numero}
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  placeholder="Ex: 185"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description (optionnel)</label>
                <input
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  placeholder="Ex: Service d'Aide Médicale Urgente"
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
                disabled={saving || !form.categorie.trim() || !form.label.trim() || !form.numero.trim()}
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
