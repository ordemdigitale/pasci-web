"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  ClipboardCheck,
  Edit3,
  ExternalLink,
  FolderOpen,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import type { ISupportFormation } from "@/components/formations/SupportsFormation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function erreurDe(res: Response, defaut: string) {
  const data = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg as string;
  return defaut;
}

/* ───────────────────────── Supports de formation ───────────────────────── */

export function GestionSupports({ slug }: { slug: string }) {
  const [supports, setSupports] = useState<ISupportFormation[]>([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"fichier" | "lien">("fichier");
  const [fichier, setFichier] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [public_, setPublic] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [cleFichier, setCleFichier] = useState(0);

  const charger = useCallback(async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/supports`);
    if (res.ok) setSupports(await res.json());
  }, [slug]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (!titre.trim()) return setErreur("Le titre est requis.");
    if (mode === "fichier" && !fichier) return setErreur("Choisissez un fichier.");
    if (mode === "lien" && !/^https?:\/\//i.test(url.trim())) return setErreur("Le lien doit commencer par http:// ou https://.");
    const fd = new FormData();
    fd.append("titre", titre.trim());
    if (description.trim()) fd.append("description", description.trim());
    fd.append("public", String(public_));
    fd.append("ordre", String(supports.length));
    if (mode === "fichier" && fichier) fd.append("fichier", fichier);
    else fd.append("url", url.trim());
    setEnvoi(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/supports`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(await erreurDe(res, "Ajout impossible."));
      setTitre("");
      setDescription("");
      setFichier(null);
      setUrl("");
      setPublic(false);
      setCleFichier((k) => k + 1);
      charger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Ajout impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(id: number) {
    if (!confirm("Supprimer ce support ?")) return;
    const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/supports/${id}`, { method: "DELETE" });
    if (res.ok) setSupports((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="font-bold text-gray-900 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-[#E05017]" /> Supports de formation
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Documents (PDF, Word, PowerPoint, Excel, images, audio, vidéo, ZIP — 20 Mo max) ou liens, affichés dans la
        lucarne « Supports de formation ». Un support « public » est visible par tous ; sinon il est réservé aux
        participants ayant accès au contenu.
      </p>

      {supports.length > 0 && (
        <ul className="divide-y divide-gray-100 mb-4 border border-gray-100 rounded-lg">
          {supports.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{s.titre}</p>
                <p className="text-xs text-gray-400 truncate">
                  {s.type === "lien" ? "Lien" : s.nom || "Fichier"} · {s.public ? "Public" : "Réservé aux participants"}
                </p>
              </div>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Ouvrir">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => supprimer(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Supprimer">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={ajouter} className="space-y-3 bg-gray-50 rounded-lg p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre du support *"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={mode === "fichier"} onChange={() => setMode("fichier")} /> Fichier
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={mode === "lien"} onChange={() => setMode("lien")} /> Lien
          </label>
          <label className="flex items-center gap-1.5 ml-auto">
            <input type="checkbox" checked={public_} onChange={(e) => setPublic(e.target.checked)} /> Visible par tous
          </label>
        </div>
        {mode === "fichier" ? (
          <input
            key={cleFichier}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.odp,.ods,.txt,.csv,.zip,.jpg,.jpeg,.png,.mp3,.mp4"
            onChange={(e) => setFichier(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
        ) : (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        )}
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button
          type="submit"
          disabled={envoi}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
        >
          {envoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Ajouter le support
        </button>
      </form>
    </section>
  );
}

/* ───────────────────────── Évaluation finale (QCM) ───────────────────────── */

interface QuestionAdmin {
  id: number;
  enonce: string;
  choix: string[];
  bonnes_reponses: number[];
  ordre: number;
}

interface Brouillon {
  enonce: string;
  choix: string[];
  bonnes_reponses: number[];
}

const VIDE: Brouillon = { enonce: "", choix: ["", ""], bonnes_reponses: [] };

export function GestionEvaluation({ slug, noteInitiale }: { slug: string; noteInitiale: number }) {
  const [questions, setQuestions] = useState<QuestionAdmin[]>([]);
  const [note, setNote] = useState(noteInitiale);
  const [noteEnregistree, setNoteEnregistree] = useState(false);
  const [editionId, setEditionId] = useState<number | "nouvelle" | null>(null);
  const [brouillon, setBrouillon] = useState<Brouillon>(VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/evaluation/questions`);
    if (res.ok) setQuestions(await res.json());
  }, [slug]);

  useEffect(() => {
    charger();
  }, [charger]);

  useEffect(() => setNote(noteInitiale), [noteInitiale]);

  async function enregistrerNote() {
    setNoteEnregistree(false);
    const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/evaluation`, {
      method: "PATCH",
      body: JSON.stringify({ note_minimale: note }),
    });
    if (res.ok) setNoteEnregistree(true);
    else setErreur(await erreurDe(res, "Note non enregistrée."));
  }

  function editer(q: QuestionAdmin | null) {
    setErreur("");
    if (q) {
      setEditionId(q.id);
      setBrouillon({ enonce: q.enonce, choix: [...q.choix], bonnes_reponses: [...q.bonnes_reponses] });
    } else {
      setEditionId("nouvelle");
      setBrouillon({ ...VIDE, choix: ["", ""] });
    }
  }

  function basculerBonne(i: number) {
    setBrouillon((b) => ({
      ...b,
      bonnes_reponses: b.bonnes_reponses.includes(i) ? b.bonnes_reponses.filter((x) => x !== i) : [...b.bonnes_reponses, i].sort(),
    }));
  }

  function retirerChoix(i: number) {
    setBrouillon((b) => ({
      ...b,
      choix: b.choix.filter((_, j) => j !== i),
      // Les indices des bonnes réponses suivantes se décalent
      bonnes_reponses: b.bonnes_reponses.filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)),
    }));
  }

  async function enregistrer() {
    setErreur("");
    const choix = brouillon.choix.map((c) => c.trim());
    if (brouillon.enonce.trim().length < 3) return setErreur("Saisissez l'énoncé de la question.");
    if (choix.length < 2 || choix.some((c) => !c)) return setErreur("Renseignez au moins deux choix, sans choix vide.");
    if (brouillon.bonnes_reponses.length === 0) return setErreur("Cochez au moins une bonne réponse.");
    setEnvoi(true);
    try {
      const nouvelle = editionId === "nouvelle";
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/${slug}/evaluation/questions${nouvelle ? "" : `/${editionId}`}`,
        {
          method: nouvelle ? "POST" : "PUT",
          body: JSON.stringify({
            enonce: brouillon.enonce.trim(),
            choix,
            bonnes_reponses: brouillon.bonnes_reponses,
            ordre: nouvelle ? questions.length : questions.find((q) => q.id === editionId)?.ordre ?? 0,
          }),
        },
      );
      if (!res.ok) throw new Error(await erreurDe(res, "Question non enregistrée."));
      setEditionId(null);
      charger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Question non enregistrée.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(id: number) {
    if (!confirm("Supprimer cette question ?")) return;
    const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/evaluation/questions/${id}`, { method: "DELETE" });
    if (res.ok) setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  const formulaire = (
    <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <textarea
        value={brouillon.enonce}
        onChange={(e) => setBrouillon((b) => ({ ...b, enonce: e.target.value }))}
        placeholder="Énoncé de la question *"
        rows={2}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <p className="text-xs text-gray-500">Cochez la ou les bonnes réponses.</p>
      {brouillon.choix.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={brouillon.bonnes_reponses.includes(i)}
            onChange={() => basculerBonne(i)}
            title="Bonne réponse"
            className="accent-green-600"
          />
          <input
            value={c}
            onChange={(e) => setBrouillon((b) => ({ ...b, choix: b.choix.map((x, j) => (j === i ? e.target.value : x)) }))}
            placeholder={`Choix ${i + 1}`}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />
          {brouillon.choix.length > 2 && (
            <button type="button" onClick={() => retirerChoix(i)} className="p-1 text-gray-400 hover:text-red-500" title="Retirer ce choix">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {brouillon.choix.length < 8 && (
        <button
          type="button"
          onClick={() => setBrouillon((b) => ({ ...b, choix: [...b.choix, ""] }))}
          className="text-sm text-[#E05017] font-medium hover:underline"
        >
          + Ajouter un choix
        </button>
      )}
      {erreur && <p className="text-sm text-red-600">{erreur}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={enregistrer}
          disabled={envoi}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
        >
          {envoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
        </button>
        <button type="button" onClick={() => setEditionId(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          Annuler
        </button>
      </div>
    </div>
  );

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="font-bold text-gray-900 flex items-center gap-2">
        <ClipboardCheck className="w-5 h-5 text-[#E05017]" /> Évaluation finale
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        QCM proposé au participant après toutes les leçons. Le certificat n&apos;est délivré qu&apos;en cas de réussite.
        Sans question, le certificat est délivré dès que toutes les leçons sont vues.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <label htmlFor="note-minimale" className="text-gray-700">Note minimale de réussite</label>
        <input
          id="note-minimale"
          type="number"
          min={0}
          max={100}
          value={note}
          onChange={(e) => {
            setNote(Math.max(0, Math.min(100, Number(e.target.value) || 0)));
            setNoteEnregistree(false);
          }}
          className="w-20 border border-gray-300 rounded-lg px-2 py-1"
        />
        <span>%</span>
        <button onClick={enregistrerNote} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">
          Enregistrer
        </button>
        {noteEnregistree && <CheckCircle className="w-4 h-4 text-green-600" />}
      </div>

      <ol className="space-y-3 mb-4">
        {questions.map((q, n) =>
          editionId === q.id ? (
            <li key={q.id}>{formulaire}</li>
          ) : (
            <li key={q.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <p className="flex-1 text-sm font-semibold text-gray-800">
                  {n + 1}. {q.enonce}
                </p>
                <button onClick={() => editer(q)} className="p-1 text-gray-500 hover:bg-gray-100 rounded" title="Modifier">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => supprimer(q.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <ul className="mt-1 ml-4 text-sm text-gray-600 list-disc">
                {q.choix.map((c, i) => (
                  <li key={i} className={q.bonnes_reponses.includes(i) ? "text-green-700 font-medium" : ""}>
                    {c}
                    {q.bonnes_reponses.includes(i) && " ✓"}
                  </li>
                ))}
              </ul>
            </li>
          ),
        )}
      </ol>

      {editionId === "nouvelle" ? (
        formulaire
      ) : (
        <button onClick={() => editer(null)} className="inline-flex items-center gap-2 text-sm text-[#E05017] font-medium hover:underline">
          <Plus className="w-4 h-4" /> Ajouter une question
        </button>
      )}
    </section>
  );
}
