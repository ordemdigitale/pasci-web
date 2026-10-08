"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Download, FileText, Loader2, Lock, Unlock, Wand2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/auth";
import { IForumSujet, IPieceJointe } from "@/types/api.types";
import MediasJoints from "@/components/forum/MediasJoints";

interface Contribution {
  id: number;
  auteur: string;
  osc?: string | null;
  date: string;
  contenu: string;
  pieces_jointes: IPieceJointe[];
}

interface ContributionsSujet {
  sujet: IForumSujet;
  pole_nom: string;
  pole_slug: string;
  contributions: Contribution[];
  nb_contributions: number;
  nb_participants: number;
  nb_osc: number;
  mots_cles: string[];
  brouillon: string;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Toutes les idées d'une discussion, l'export et la rédaction de la synthèse. */
export default function SyntheseSujetPage() {
  const { sujetId } = useParams<{ sujetId: string }>();
  const [donnees, setDonnees] = useState<ContributionsSujet | null>(null);
  const [synthese, setSynthese] = useState("");
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/forum/sujets/${sujetId}/contributions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ContributionsSujet = await res.json();
      setDonnees(data);
      setSynthese(data.sujet.synthese || "");
    } catch {
      toast.error("Impossible de charger les contributions.");
    } finally {
      setChargement(false);
    }
  }, [sujetId]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function enregistrer(modifs: { synthese?: string; est_clos?: boolean }, message: string) {
    setEnregistrement(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/forum/sujets/${sujetId}/synthese`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifs),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : `HTTP ${res.status}`);
      }
      const sujet: IForumSujet = await res.json();
      setDonnees((prev) => (prev ? { ...prev, sujet } : prev));
      toast.success(message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Enregistrement impossible.");
    } finally {
      setEnregistrement(false);
    }
  }

  function exporterCsv() {
    if (!donnees) return;
    const echapper = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
    const lignes = [
      ["Date", "Auteur", "OSC", "Contribution", "Médias"].join(";"),
      ...donnees.contributions.map((c) =>
        [
          formatDate(c.date),
          c.auteur,
          c.osc || "",
          c.contenu,
          c.pieces_jointes.map((p) => p.url).join(" "),
        ]
          .map(echapper)
          .join(";")
      ),
    ];
    // BOM UTF-8 : accents corrects à l'ouverture dans Excel
    const blob = new Blob(["﻿" + lignes.join("\n")], { type: "text/csv;charset=utf-8" });
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(blob);
    lien.download = `contributions-${donnees.sujet.slug}.csv`;
    lien.click();
    URL.revokeObjectURL(lien.href);
  }

  if (chargement) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }
  if (!donnees) {
    return <p className="p-6 text-gray-500">Sujet introuvable.</p>;
  }

  const { sujet } = donnees;

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/admin/forum/poles/${donnees.pole_slug}/sujets`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E05017] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Sujets du pôle {donnees.pole_nom}
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{sujet.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {donnees.nb_contributions} contribution(s) · {donnees.nb_participants} participant(s) · {donnees.nb_osc} OSC
              {sujet.est_clos && (
                <span className="ml-2 inline-flex items-center gap-1 text-gray-600">
                  <Lock className="w-3.5 h-3.5" /> discussion close
                </span>
              )}
            </p>
            {donnees.mots_cles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {donnees.mots_cles.map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">{m}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exporterCsv}
              disabled={donnees.contributions.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-40"
            >
              <Download className="w-4 h-4" /> Exporter (CSV)
            </button>
            <button
              onClick={() =>
                enregistrer(
                  { est_clos: !sujet.est_clos },
                  sujet.est_clos ? "Discussion rouverte." : "Discussion close : plus de nouveaux messages."
                )
              }
              disabled={enregistrement}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-40"
            >
              {sujet.est_clos ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {sujet.est_clos ? "Rouvrir la discussion" : "Clore la discussion"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contributions */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-3">Idées exprimées</h2>
            <div className="mb-4 rounded-lg bg-gray-50 border border-gray-100 p-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">Question posée</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{sujet.content}</p>
            </div>
            {donnees.contributions.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune contribution pour le moment.</p>
            ) : (
              <ol className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {donnees.contributions.map((c) => (
                  <li key={c.id} className="border-b border-gray-100 pb-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-800">{c.auteur}</span>
                      {c.osc ? ` · ${c.osc}` : ""} · {formatDate(c.date)}
                    </p>
                    {c.contenu && <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{c.contenu}</p>}
                    <MediasJoints pieces={c.pieces_jointes} />
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Synthèse */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-700" /> Synthèse
              </h2>
              <button
                onClick={() => {
                  if (synthese.trim() && !confirm("Remplacer le texte actuel par le brouillon automatique ?")) return;
                  setSynthese(donnees.brouillon);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E05017] border border-[#E05017]/30 rounded-lg hover:bg-orange-50"
              >
                <Wand2 className="w-3.5 h-3.5" /> Générer un brouillon
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Le brouillon rassemble automatiquement la période, la participation, les idées de chaque contributeur et les
              mots-clés. Relisez-le et complétez les points de convergence, de divergence et les recommandations avant de publier.
            </p>
            <textarea
              value={synthese}
              onChange={(e) => setSynthese(e.target.value)}
              rows={20}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              placeholder="Rédigez la synthèse de la discussion…"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-gray-500">
                {sujet.synthese
                  ? `Publiée${sujet.synthese_par ? ` par ${sujet.synthese_par}` : ""}${sujet.synthese_le ? ` le ${formatDate(sujet.synthese_le)}` : ""}.`
                  : "Pas encore publiée."}
              </p>
              <div className="flex gap-2">
                {sujet.synthese && (
                  <button
                    onClick={() => {
                      if (!confirm("Retirer la synthèse publiée ?")) return;
                      setSynthese("");
                      enregistrer({ synthese: "" }, "Synthèse retirée.");
                    }}
                    disabled={enregistrement}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
                  >
                    Retirer
                  </button>
                )}
                <button
                  onClick={() => enregistrer({ synthese }, "Synthèse publiée sur la discussion.")}
                  disabled={enregistrement || !synthese.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-40"
                >
                  {enregistrement && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publier la synthèse
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
