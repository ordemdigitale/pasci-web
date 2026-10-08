"use client";

import { useCallback, useEffect, useState } from "react";
import { Award, CheckCircle, ClipboardCheck, Loader2, RotateCcw, XCircle } from "lucide-react";
import { getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// En-tête du participant connecté (pas fetchWithAuth : il renvoie vers la connexion admin en cas de 401)
function enTeteAuth(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface Question {
  id: number;
  enonce: string;
  choix: string[];
  plusieurs_reponses: boolean;
}

interface Evaluation {
  note_minimale: number;
  questions: Question[];
  lecons_terminees: boolean;
  reussie: boolean;
  tentatives: { score: number; reussi: boolean; date: string }[];
  certificat_code?: string | null;
}

interface Resultat {
  score: number;
  reussi: boolean;
  note_minimale: number;
  bonnes: number;
  total: number;
  questions_a_revoir: number[];
  certificat_code?: string | null;
}

/**
 * Évaluation finale d'une formation (QCM) : à réussir, après toutes les
 * leçons, pour obtenir le certificat. `rafraichir` change quand la progression
 * change (une leçon de plus vue peut débloquer l'évaluation).
 */
export default function EvaluationFinale({
  slug,
  rafraichir,
  onCertificat,
}: {
  slug: string;
  rafraichir?: unknown;
  onCertificat: (code: string) => void;
}) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [ouverte, setOuverte] = useState(false);
  const [reponses, setReponses] = useState<Record<number, number[]>>({});
  const [envoi, setEnvoi] = useState(false);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/${slug}/evaluation`, { headers: enTeteAuth() });
      if (res.ok) setEvaluation(await res.json());
    } catch {
      /* pas d'évaluation accessible */
    }
  }, [slug]);

  useEffect(() => {
    charger();
  }, [charger, rafraichir]);

  if (!evaluation || evaluation.questions.length === 0) return null;

  function cocher(q: Question, index: number) {
    setReponses((prev) => {
      const actuelles = prev[q.id] || [];
      if (!q.plusieurs_reponses) return { ...prev, [q.id]: [index] };
      return {
        ...prev,
        [q.id]: actuelles.includes(index) ? actuelles.filter((i) => i !== index) : [...actuelles, index],
      };
    });
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!evaluation) return;
    const sansReponse = evaluation.questions.filter((q) => !(reponses[q.id] || []).length).length;
    if (sansReponse && !confirm(`${sansReponse} question(s) sans réponse. Valider quand même ?`)) return;
    setEnvoi(true);
    setErreur("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/${slug}/evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...enTeteAuth() },
        body: JSON.stringify({ reponses }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Envoi impossible.");
      setResultat(data);
      if (data.reussi) {
        setOuverte(false);
        if (data.certificat_code) onCertificat(data.certificat_code);
      }
      charger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  const meilleur = evaluation.tentatives.reduce((m, t) => Math.max(m, t.score), 0);

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#E05017]" /> Évaluation finale
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {evaluation.questions.length} question(s) · note minimale {evaluation.note_minimale} % pour obtenir le certificat.
            {evaluation.tentatives.length > 0 && ` Meilleur score : ${meilleur} %.`}
          </p>
        </div>
        {evaluation.reussie ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            <Award className="w-4 h-4" /> Évaluation réussie
          </span>
        ) : !evaluation.lecons_terminees ? (
          <span className="text-sm text-gray-500">Disponible après toutes les leçons.</span>
        ) : !ouverte ? (
          <button
            onClick={() => {
              setOuverte(true);
              setResultat(null);
              setReponses({});
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315]"
          >
            {evaluation.tentatives.length ? <RotateCcw className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
            {evaluation.tentatives.length ? "Repasser l'évaluation" : "Passer l'évaluation"}
          </button>
        ) : null}
      </div>

      {resultat && (
        <div
          className={`mt-4 rounded-lg border p-4 text-sm ${
            resultat.reussi ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p className="font-semibold flex items-center gap-2">
            {resultat.reussi ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            Score : {resultat.score} % ({resultat.bonnes}/{resultat.total} bonnes réponses)
          </p>
          <p className="mt-1">
            {resultat.reussi
              ? "Félicitations, vous avez réussi l'évaluation : votre certificat est disponible."
              : `Il faut au moins ${resultat.note_minimale} %. Revoyez les leçons puis réessayez : les questions à revoir sont signalées.`}
          </p>
        </div>
      )}

      {ouverte && (
        <form onSubmit={soumettre} className="mt-4 space-y-5">
          {evaluation.questions.map((q, n) => {
            const aRevoir = resultat?.questions_a_revoir.includes(q.id);
            return (
              <fieldset key={q.id} className={`rounded-lg border p-4 ${aRevoir ? "border-amber-300 bg-amber-50/50" : "border-gray-200"}`}>
                <legend className="px-1 text-sm font-semibold text-gray-900">
                  {n + 1}. {q.enonce}
                </legend>
                {q.plusieurs_reponses && <p className="text-xs text-gray-500 mb-2">Plusieurs réponses possibles.</p>}
                <div className="space-y-2">
                  {q.choix.map((c, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                      <input
                        type={q.plusieurs_reponses ? "checkbox" : "radio"}
                        name={`question-${q.id}`}
                        checked={(reponses[q.id] || []).includes(i)}
                        onChange={() => cocher(q, i)}
                        className="accent-[#E05017]"
                      />
                      {c}
                    </label>
                  ))}
                </div>
                {aRevoir && <p className="text-xs text-amber-800 mt-2">À revoir.</p>}
              </fieldset>
            );
          })}
          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315] disabled:opacity-50"
            >
              {envoi && <Loader2 className="w-4 h-4 animate-spin" />} Valider mes réponses
            </button>
            <button type="button" onClick={() => setOuverte(false)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Annuler
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
