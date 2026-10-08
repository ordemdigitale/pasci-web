"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Eye, ImageIcon, Loader2, RotateCcw, Save, Type, Upload } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { CONTENUS_PAR_DEFAUT, TexteFormate } from "@/lib/contenus-site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TEXTES = [
  {
    cle: "poles_intro",
    titre: "Pôles de concertation — introduction",
    aide: "Affiché en haut de la page Pôles de concertation (site et application). {nb_poles} est remplacé par le nombre de pôles actifs.",
  },
  {
    cle: "poles_charte",
    titre: "Pôles de concertation — charte",
    aide: "Charte affichée sous l'introduction de la page Pôles de concertation.",
  },
];

const IMAGES = [
  { cle: "poles_illustration", titre: "Illustration de la page Pôles de concertation" },
  { cle: "ressources_illustration", titre: "Illustration de la page Ressources" },
];

export default function TextesIllustrationsPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [brouillons, setBrouillons] = useState<Record<string, string>>({});
  const [apercu, setApercu] = useState<Record<string, boolean>>({});
  const [envoi, setEnvoi] = useState<string | null>(null);
  const [message, setMessage] = useState<{ cle: string; ok: boolean; texte: string } | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/config`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, string>) => {
        setConfig(data || {});
        const b: Record<string, string> = {};
        TEXTES.forEach(({ cle }) => (b[cle] = (data?.[cle] || "").trim() || CONTENUS_PAR_DEFAUT[cle]));
        setBrouillons(b);
      })
      .finally(() => setChargement(false));
  }, []);

  async function enregistrer(cle: string, valeur: string) {
    setEnvoi(cle);
    setMessage(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/config/${cle}`, {
        method: "PUT",
        body: JSON.stringify({ value: valeur }),
      });
      if (!res.ok) throw new Error();
      setConfig((c) => ({ ...c, [cle]: valeur }));
      setMessage({ cle, ok: true, texte: valeur ? "Enregistré." : "Valeur par défaut rétablie." });
    } catch {
      setMessage({ cle, ok: false, texte: "Enregistrement impossible." });
    } finally {
      setEnvoi(null);
    }
  }

  async function envoyerImage(cle: string, fichier: File) {
    setEnvoi(cle);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("image", fichier);
      const res = await fetchWithAuth(`${API_BASE}/api/v1/config/upload/${cle}`, { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Envoi impossible.");
      setConfig((c) => ({ ...c, [cle]: data.value }));
      setMessage({ cle, ok: true, texte: "Image remplacée." });
    } catch (err) {
      setMessage({ cle, ok: false, texte: err instanceof Error ? err.message : "Envoi impossible." });
    } finally {
      setEnvoi(null);
    }
  }

  const retour = (cle: string) =>
    message?.cle === cle && (
      <span className={`text-sm flex items-center gap-1 ${message.ok ? "text-green-600" : "text-red-600"}`}>
        {message.ok && <CheckCircle className="w-4 h-4" />} {message.texte}
      </span>
    );

  if (chargement) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#E05017]" /></div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Textes et illustrations</h1>
          <p className="text-gray-600">Textes des pôles et images d&apos;illustration des pages Pôles et Ressources.</p>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-[#E05017]" /> Images d&apos;illustration
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            JPG, PNG ou WEBP, 5 Mo maximum. Les images de chaque pôle se changent dans Forum › Pôles de concertation.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {IMAGES.map(({ cle, titre }) => {
              const actuelle = (config[cle] || "").trim() || CONTENUS_PAR_DEFAUT[cle];
              const personnalisee = !!(config[cle] || "").trim();
              return (
                <div key={cle}>
                  <p className="text-sm font-semibold text-gray-800 mb-2">{titre}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={actuelle} alt={titre} className="w-full h-44 object-cover rounded-lg border border-gray-200 mb-3" />
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-[#c44315]">
                      {envoi === cle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Changer l&apos;image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        aria-label={`Nouvelle image : ${titre}`}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) envoyerImage(cle, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {personnalisee && (
                      <button
                        onClick={() => enregistrer(cle, "")}
                        className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      >
                        <RotateCcw className="w-4 h-4" /> Image d&apos;origine
                      </button>
                    )}
                    {retour(cle)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {TEXTES.map(({ cle, titre, aide }) => (
          <section key={cle} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Type className="w-5 h-5 text-[#E05017]" /> {titre}
              </h2>
              <button
                onClick={() => setApercu((a) => ({ ...a, [cle]: !a[cle] }))}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Eye className="w-4 h-4" /> {apercu[cle] ? "Modifier" : "Aperçu"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {aide} Mise en forme : ligne vide = nouveau paragraphe, « ## » = intertitre, « - » = puce, **texte** = gras.
            </p>
            {apercu[cle] ? (
              <TexteFormate
                className="text-gray-700 border border-gray-100 rounded-lg p-4 bg-gray-50"
                texte={brouillons[cle] || ""}
                variables={{ nb_poles: "N" }}
              />
            ) : (
              <textarea
                value={brouillons[cle] || ""}
                onChange={(e) => setBrouillons((b) => ({ ...b, [cle]: e.target.value }))}
                rows={cle === "poles_charte" ? 18 : 8}
                aria-label={titre}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={() => enregistrer(cle, (brouillons[cle] || "").trim())}
                disabled={envoi === cle}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50"
              >
                {envoi === cle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
              </button>
              <button
                onClick={() => {
                  setBrouillons((b) => ({ ...b, [cle]: CONTENUS_PAR_DEFAUT[cle] }));
                  enregistrer(cle, "");
                }}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" /> Texte d&apos;origine
              </button>
              {retour(cle)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
