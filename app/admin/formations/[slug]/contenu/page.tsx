"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  GripVertical,
  Video,
  FileText,
  AlignLeft,
  ChevronDown,
  ChevronRight,
  Upload,
  Loader2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Lecon {
  id: number;
  module_id: number;
  title: string;
  type: "video" | "pdf" | "text";
  content: string | null;
  file_path: string | null;
  file_url: string | null;
  duration_minutes: number | null;
  is_preview: boolean;
  order: number;
  created_at: string;
}

interface Module {
  id: number;
  formation_id: number;
  title: string;
  description: string | null;
  order: number;
  lecons: Lecon[];
  created_at: string;
}

interface LeconFormState {
  title: string;
  type: "video" | "pdf" | "text";
  content: string;
  duration_minutes: string;
  is_preview: boolean;
  order: number;
  pdfFile: File | null;
}

const LECON_TYPES = [
  { value: "video" as const, label: "Vidéo", icon: Video, color: "text-red-500" },
  { value: "pdf" as const, label: "PDF", icon: FileText, color: "text-blue-500" },
  { value: "text" as const, label: "Texte", icon: AlignLeft, color: "text-green-500" },
];

export default function FormationContenuPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [formationTitle, setFormationTitle] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  // Module form
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [addingModule, setAddingModule] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", order: 0 });
  const [savingModule, setSavingModule] = useState(false);
  const [deletingModuleId, setDeletingModuleId] = useState<number | null>(null);

  // Leçon form
  const [editingLeconId, setEditingLeconId] = useState<number | null>(null);
  const [editingLeconModuleId, setEditingLeconModuleId] = useState<number | null>(null);
  const [addingLeconForModule, setAddingLeconForModule] = useState<number | null>(null);
  const [leconForm, setLeconForm] = useState<LeconFormState>({
    title: "",
    type: "video",
    content: "",
    duration_minutes: "",
    is_preview: false,
    order: 0,
    pdfFile: null,
  });
  const [savingLecon, setSavingLecon] = useState(false);
  const [deletingLeconId, setDeletingLeconId] = useState<number | null>(null);

  // Standalone PDF upload (for existing pdf leçons)
  const [uploadingLeconId, setUploadingLeconId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [slug]);

  async function loadData() {
    setLoading(true);
    try {
      const [formRes, modsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/formations/${slug}`),
        fetch(`${API_BASE_URL}/api/v1/formations/${slug}/modules`),
      ]);
      if (formRes.ok) {
        const f = await formRes.json();
        setFormationTitle(f.title);
      }
      if (modsRes.ok) {
        const mods = await modsRes.json();
        const list = Array.isArray(mods) ? mods : [];
        setModules(list);
        setExpandedModules(new Set(list.map((m: Module) => m.id)));
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleModule(id: number) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function cancelEdit() {
    setAddingModule(false);
    setEditingModuleId(null);
    setAddingLeconForModule(null);
    setEditingLeconId(null);
    setEditingLeconModuleId(null);
  }

  // ── Modules ──────────────────────────────────────────────────

  function startAddModule() {
    cancelEdit();
    setAddingModule(true);
    setModuleForm({ title: "", description: "", order: modules.length });
  }

  function startEditModule(mod: Module) {
    cancelEdit();
    setEditingModuleId(mod.id);
    setModuleForm({ title: mod.title, description: mod.description || "", order: mod.order });
  }

  async function saveModule() {
    if (!moduleForm.title.trim()) return;
    setSavingModule(true);
    try {
      const body = {
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim() || null,
        order: Number(moduleForm.order),
      };
      if (addingModule) {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/modules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        const newMod = await res.json();
        setModules((prev) => [...prev, { ...newMod, lecons: [] }]);
        setExpandedModules((prev) => new Set([...prev, newMod.id]));
      } else if (editingModuleId !== null) {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/api/v1/formations/${slug}/modules/${editingModuleId}`,
          { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
        );
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setModules((prev) =>
          prev.map((m) => (m.id === editingModuleId ? { ...updated, lecons: m.lecons } : m))
        );
      }
      cancelEdit();
    } catch {
      alert("Erreur lors de l'enregistrement du module");
    } finally {
      setSavingModule(false);
    }
  }

  async function deleteModule(modId: number) {
    if (!confirm("Supprimer ce module et toutes ses leçons ?")) return;
    setDeletingModuleId(modId);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setModules((prev) => prev.filter((m) => m.id !== modId));
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingModuleId(null);
    }
  }

  // ── Leçons ────────────────────────────────────────────────────

  function startAddLecon(modId: number) {
    const mod = modules.find((m) => m.id === modId);
    cancelEdit();
    setAddingLeconForModule(modId);
    setLeconForm({
      title: "",
      type: "video",
      content: "",
      duration_minutes: "",
      is_preview: false,
      order: mod ? mod.lecons.length : 0,
      pdfFile: null,
    });
  }

  function startEditLecon(lecon: Lecon, modId: number) {
    cancelEdit();
    setEditingLeconId(lecon.id);
    setEditingLeconModuleId(modId);
    setLeconForm({
      title: lecon.title,
      type: lecon.type,
      content: lecon.content || "",
      duration_minutes: lecon.duration_minutes?.toString() || "",
      is_preview: lecon.is_preview,
      order: lecon.order,
      pdfFile: null,
    });
  }

  async function saveLecon(modId: number) {
    if (!leconForm.title.trim()) return;
    setSavingLecon(true);
    try {
      const body = {
        title: leconForm.title.trim(),
        type: leconForm.type,
        content: leconForm.type !== "pdf" ? (leconForm.content.trim() || null) : null,
        duration_minutes: leconForm.duration_minutes ? Number(leconForm.duration_minutes) : null,
        is_preview: leconForm.is_preview,
        order: Number(leconForm.order),
      };

      let savedLecon: Lecon;

      if (addingLeconForModule !== null) {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}/lecons`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
        );
        if (!res.ok) throw new Error("Erreur création leçon");
        savedLecon = await res.json();

        // Auto-upload PDF if file was selected
        if (leconForm.pdfFile) {
          const formData = new FormData();
          formData.append("file", leconForm.pdfFile);
          const uploadRes = await fetchWithAuth(
            `${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}/lecons/${savedLecon.id}/upload`,
            { method: "POST", body: formData }
          );
          if (uploadRes.ok) savedLecon = await uploadRes.json();
        }

        setModules((prev) =>
          prev.map((m) => (m.id === modId ? { ...m, lecons: [...m.lecons, savedLecon] } : m))
        );
      } else if (editingLeconId !== null) {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}/lecons/${editingLeconId}`,
          { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
        );
        if (!res.ok) throw new Error("Erreur mise à jour leçon");
        savedLecon = await res.json();

        // Upload new PDF if selected
        if (leconForm.pdfFile) {
          const formData = new FormData();
          formData.append("file", leconForm.pdfFile);
          const uploadRes = await fetchWithAuth(
            `${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}/lecons/${editingLeconId}/upload`,
            { method: "POST", body: formData }
          );
          if (uploadRes.ok) savedLecon = await uploadRes.json();
        }

        setModules((prev) =>
          prev.map((m) =>
            m.id === modId
              ? { ...m, lecons: m.lecons.map((l) => (l.id === editingLeconId ? savedLecon : l)) }
              : m
          )
        );
      }

      cancelEdit();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'enregistrement de la leçon");
    } finally {
      setSavingLecon(false);
    }
  }

  async function deleteLecon(modId: number, leconId: number) {
    if (!confirm("Supprimer cette leçon ?")) return;
    setDeletingLeconId(leconId);
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}/lecons/${leconId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setModules((prev) =>
        prev.map((m) =>
          m.id === modId ? { ...m, lecons: m.lecons.filter((l) => l.id !== leconId) } : m
        )
      );
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingLeconId(null);
    }
  }

  async function uploadPDFStandalone(modId: number, leconId: number, file: File) {
    setUploadingLeconId(leconId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/${slug}/modules/${modId}/lecons/${leconId}/upload`,
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setModules((prev) =>
        prev.map((m) =>
          m.id === modId
            ? { ...m, lecons: m.lecons.map((l) => (l.id === leconId ? updated : l)) }
            : m
        )
      );
    } catch {
      alert("Erreur lors de l'upload du PDF");
    } finally {
      setUploadingLeconId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/formations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour aux formations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Contenu de la formation</h1>
            {formationTitle && <p className="text-gray-500 mt-1">{formationTitle}</p>}
          </div>
          <button
            onClick={startAddModule}
            disabled={addingModule}
            className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Ajouter un module
          </button>
        </div>
      </div>

      {/* New Module Form */}
      {addingModule && (
        <div className="mb-6 bg-white border-2 border-[#E05017] rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Nouveau module</h3>
          <ModuleForm form={moduleForm} onChange={setModuleForm} onSave={saveModule} onCancel={cancelEdit} saving={savingModule} />
        </div>
      )}

      {/* Empty state */}
      {modules.length === 0 && !addingModule && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Aucun module pour le moment</p>
          <p className="text-gray-400 text-sm mt-1">Ajoutez des modules pour organiser le contenu</p>
          <button
            onClick={startAddModule}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold hover:bg-[#c44315] mx-auto"
          >
            <Plus className="w-4 h-4" />
            Créer le premier module
          </button>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Module header */}
            {editingModuleId === mod.id ? (
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-4">Modifier le module</h3>
                <ModuleForm form={moduleForm} onChange={setModuleForm} onSave={saveModule} onCancel={cancelEdit} saving={savingModule} />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-5 py-4">
                <GripVertical className="w-4 h-4 text-gray-300 cursor-grab flex-shrink-0" />
                <button onClick={() => toggleModule(mod.id)} className="flex-1 flex items-center gap-3 text-left min-w-0">
                  {expandedModules.has(mod.id)
                    ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">{mod.title}</h3>
                    {mod.description && <p className="text-sm text-gray-500 truncate">{mod.description}</p>}
                  </div>
                  <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                    {mod.lecons.length} leçon{mod.lecons.length !== 1 ? "s" : ""}
                  </span>
                </button>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => startEditModule(mod)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Modifier">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteModule(mod.id)}
                    disabled={deletingModuleId === mod.id}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    title="Supprimer"
                  >
                    {deletingModuleId === mod.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Leçons */}
            {expandedModules.has(mod.id) && editingModuleId !== mod.id && (
              <div className="border-t border-gray-100">
                {mod.lecons.map((lecon) => (
                  <div key={lecon.id}>
                    {editingLeconId === lecon.id && editingLeconModuleId === mod.id ? (
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <LeconForm
                          form={leconForm}
                          onChange={setLeconForm}
                          onSave={() => saveLecon(mod.id)}
                          onCancel={cancelEdit}
                          saving={savingLecon}
                          existingFileUrl={lecon.file_url}
                          existingFilePath={lecon.file_path}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab ml-6 flex-shrink-0" />
                        <LeconTypeIcon type={lecon.type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{lecon.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            <span className="capitalize">{lecon.type}</span>
                            {lecon.duration_minutes && <span>{lecon.duration_minutes} min</span>}
                            {lecon.type === "video" && lecon.content && (
                              <span className="truncate max-w-[180px] text-gray-400">{lecon.content}</span>
                            )}
                            {lecon.type === "video" && lecon.file_url && (
                              <a href={lecon.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Support PDF
                              </a>
                            )}
                            {lecon.type === "pdf" && lecon.file_url && (
                              <a href={lecon.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Voir le PDF
                              </a>
                            )}
                            {lecon.type === "pdf" && !lecon.file_url && (
                              <span className="text-orange-400">PDF non uploadé</span>
                            )}
                            {lecon.type === "text" && lecon.content && (
                              <span className="text-gray-400">{lecon.content.substring(0, 40)}…</span>
                            )}
                          </div>
                        </div>
                        {lecon.is_preview && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex-shrink-0">Aperçu</span>
                        )}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Upload PDF (pour leçons pdf et video) */}
                          {(lecon.type === "pdf" || lecon.type === "video") && (
                            <label
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title={lecon.type === "video" ? "Ajouter/remplacer le support PDF" : "Remplacer le PDF"}
                            >
                              {uploadingLeconId === lecon.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Upload className="w-4 h-4" />}
                              <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) uploadPDFStandalone(mod.id, lecon.id, f);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          )}
                          <button onClick={() => startEditLecon(lecon, mod.id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Modifier">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLecon(mod.id, lecon.id)}
                            disabled={deletingLeconId === lecon.id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Supprimer"
                          >
                            {deletingLeconId === lecon.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* New leçon form */}
                {addingLeconForModule === mod.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <LeconForm
                      form={leconForm}
                      onChange={setLeconForm}
                      onSave={() => saveLecon(mod.id)}
                      onCancel={cancelEdit}
                      saving={savingLecon}
                      existingFileUrl={null}
                      existingFilePath={null}
                    />
                  </div>
                )}

                {addingLeconForModule !== mod.id && (
                  <div className="px-5 py-3 border-t border-gray-100">
                    <button onClick={() => startAddLecon(mod.id)} className="flex items-center gap-2 text-sm text-[#E05017] font-medium hover:underline">
                      <Plus className="w-4 h-4" />
                      Ajouter une leçon
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function LeconTypeIcon({ type }: { type: "video" | "pdf" | "text" }) {
  if (type === "video") return <Video className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (type === "pdf") return <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  return <AlignLeft className="w-4 h-4 text-green-500 flex-shrink-0" />;
}

function ModuleForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  form: { title: string; description: string; order: number };
  onChange: (f: { title: string; description: string; order: number }) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre du module *"
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
        autoFocus
      />
      <input
        type="text"
        placeholder="Description (optionnel)"
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
      />
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Ordre :</span>
        <input
          type="number"
          min={0}
          value={form.order}
          onChange={(e) => onChange({ ...form, order: Number(e.target.value) })}
          className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
          <X className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </div>
  );
}

function LeconForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
  existingFileUrl,
  existingFilePath,
}: {
  form: LeconFormState;
  onChange: (f: LeconFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  existingFileUrl: string | null;
  existingFilePath: string | null;
}) {
  const fileName = form.pdfFile?.name || existingFilePath?.split("/").pop() || null;

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Titre de la leçon *"
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
        autoFocus
      />

      {/* Type selector */}
      <div className="flex gap-2">
        {LECON_TYPES.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange({ ...form, type: value, content: "", pdfFile: null })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              form.type === value
                ? "border-[#E05017] bg-[#E05017]/5 text-[#E05017]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon className={`w-4 h-4 ${form.type === value ? "text-[#E05017]" : color}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Content fields by type */}
      {form.type === "video" && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">URL YouTube ou Vimeo</label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.content}
            onChange={(e) => onChange({ ...form, content: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
          />
        </div>
      )}

      {form.type === "pdf" && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Fichier PDF <span className="text-gray-400">(max 20 Mo)</span>
          </label>
          <label
            className={`flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
              form.pdfFile
                ? "border-green-400 bg-green-50"
                : existingFileUrl
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 hover:border-[#E05017] hover:bg-[#E05017]/5"
            }`}
          >
            {form.pdfFile ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : existingFileUrl ? (
              <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              {fileName ? (
                <p className="text-sm font-medium text-gray-800 truncate">{fileName}</p>
              ) : (
                <p className="text-sm text-gray-500">Cliquer pour choisir un fichier PDF</p>
              )}
              {existingFileUrl && !form.pdfFile && (
                <p className="text-xs text-blue-500">
                  <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" onClick={(e) => e.stopPropagation()}>
                    Voir le fichier actuel
                  </a>
                  {" — choisir un nouveau pour le remplacer"}
                </p>
              )}
              {form.pdfFile && (
                <p className="text-xs text-green-600">{(form.pdfFile.size / 1024 / 1024).toFixed(2)} Mo — prêt à uploader</p>
              )}
            </div>
            {form.pdfFile && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onChange({ ...form, pdfFile: null }); }}
                className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                onChange({ ...form, pdfFile: f });
                e.target.value = "";
              }}
            />
          </label>
        </div>
      )}

      {form.type === "text" && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Contenu</label>
          <textarea
            placeholder="Écrivez le contenu de la leçon ici (texte ou HTML)..."
            value={form.content}
            onChange={(e) => onChange({ ...form, content: e.target.value })}
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-y font-mono"
          />
        </div>
      )}

      {/* Duration, order, preview */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Durée (min) :</span>
          <input
            type="number"
            min={0}
            value={form.duration_minutes}
            onChange={(e) => onChange({ ...form, duration_minutes: e.target.value })}
            placeholder="–"
            className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Ordre :</span>
          <input
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => onChange({ ...form, order: Number(e.target.value) })}
            className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_preview}
            onChange={(e) => onChange({ ...form, is_preview: e.target.checked })}
            className="rounded border-gray-300 text-[#E05017] focus:ring-[#E05017]"
          />
          <Eye className="w-4 h-4 text-green-500" />
          Visible sans inscription
        </label>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
          <X className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </div>
  );
}
