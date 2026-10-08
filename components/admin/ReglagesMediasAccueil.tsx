"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Headphones, Loader2, Radio, Save, Upload, Video } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { CLES_MEDIAS, lecteurAudio, lecteurVideo } from "@/lib/medias-accueil";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Lucarnes vidéo (Live possible) et podcast de l'accueil. Chaque média est un
 * lien (YouTube, Vimeo, Facebook Live, SoundCloud, Spotify…) ou un fichier
 * envoyé sur la plateforme (100 Mo maximum). Sans média, la lucarne est masquée.
 */
export default function ReglagesMediasAccueil({ config }: { config: Record<string, string> }) {
  const [valeurs, setValeurs] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; texte: string; bloc: "video" | "podcast" } | null>(null);

  useEffect(() => {
    const v: Record<string, string> = {};
    Object.values(CLES_MEDIAS).forEach((cle) => (v[cle] = config[cle] || ""));
    setValeurs(v);
  }, [config]);

  const maj = (cle: string, valeur: string) => setValeurs((v) => ({ ...v, [cle]: valeur }));

  async function enregistrer(bloc: "video" | "podcast") {
    const cles = bloc === "video"
      ? [CLES_MEDIAS.videoTitre, CLES_MEDIAS.videoDescription, CLES_MEDIAS.videoUrl, CLES_MEDIAS.videoDirect]
      : [CLES_MEDIAS.podcastTitre, CLES_MEDIAS.podcastDescription, CLES_MEDIAS.podcastUrl];
    setEnvoi(bloc);
    setMessage(null);
    try {
      for (const cle of cles) {
        const res = await fetchWithAuth(`${API_BASE}/api/v1/config/${cle}`, {
          method: "PUT",
          body: JSON.stringify({ value: (valeurs[cle] || "").trim() }),
        });
        if (!res.ok) throw new Error();
      }
      setMessage({ ok: true, texte: "Enregistré.", bloc });
    } catch {
      setMessage({ ok: false, texte: "Enregistrement impossible.", bloc });
    } finally {
      setEnvoi(null);
    }
  }

  async function envoyerFichier(bloc: "video" | "podcast", fichier: File) {
    const cle = bloc === "video" ? CLES_MEDIAS.videoUrl : CLES_MEDIAS.podcastUrl;
    setEnvoi(`${bloc}-fichier`);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("fichier", fichier);
      const res = await fetchWithAuth(`${API_BASE}/api/v1/config/upload-media/${cle}`, { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Envoi impossible.");
      maj(cle, data.value);
      setMessage({ ok: true, texte: "Fichier envoyé.", bloc });
    } catch (err) {
      setMessage({ ok: false, texte: err instanceof Error ? err.message : "Envoi impossible.", bloc });
    } finally {
      setEnvoi(null);
    }
  }

  const CHAMP = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm";
  const retour = (bloc: "video" | "podcast") =>
    message?.bloc === bloc && (
      <span className={`text-sm flex items-center gap-1 ${message.ok ? "text-green-600" : "text-red-600"}`}>
        {message.ok && <CheckCircle className="w-4 h-4" />} {message.texte}
      </span>
    );
  const typeVideo = lecteurVideo(valeurs[CLES_MEDIAS.videoUrl] || "")?.type;
  const typeAudio = lecteurAudio(valeurs[CLES_MEDIAS.podcastUrl] || "")?.type;
  const libelle = (t?: string) => (t === "iframe" ? "lecteur intégré" : t === "fichier" ? "fichier envoyé" : t === "lien" ? "lien externe (bouton)" : "aucun : lucarne masquée");

  return (
    <section id="medias" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="font-bold text-gray-900 mb-1">Accueil — vidéo et podcast</h2>
      <p className="text-xs text-gray-500 mb-5">
        Lucarnes affichées sous le carrousel de l&apos;accueil (site et application), à la place de « Télécharger PdoC sur
        Android » et du QR code. Laissez le lien vide pour masquer une lucarne.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Video className="w-4 h-4 text-[#E05017]" /> Vidéo / Live</h3>
          <input value={valeurs[CLES_MEDIAS.videoTitre] || ""} onChange={(e) => maj(CLES_MEDIAS.videoTitre, e.target.value)} placeholder="Titre de la vidéo" className={CHAMP} aria-label="Titre de la vidéo" />
          <textarea value={valeurs[CLES_MEDIAS.videoDescription] || ""} onChange={(e) => maj(CLES_MEDIAS.videoDescription, e.target.value)} placeholder="Courte description (facultative)" rows={2} className={CHAMP} aria-label="Description de la vidéo" />
          <input value={valeurs[CLES_MEDIAS.videoUrl] || ""} onChange={(e) => maj(CLES_MEDIAS.videoUrl, e.target.value)} placeholder="Lien YouTube, Vimeo ou Facebook (vidéo ou Live)" className={CHAMP} aria-label="Lien de la vidéo" />
          <p className="text-xs text-gray-500">Lecture : {libelle(typeVideo)}</p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={valeurs[CLES_MEDIAS.videoDirect] === "true"} onChange={(e) => maj(CLES_MEDIAS.videoDirect, e.target.checked ? "true" : "")} />
            <Radio className="w-4 h-4 text-red-600" /> Diffusion en direct (badge « EN DIRECT »)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => enregistrer("video")} disabled={!!envoi} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50">
              {envoi === "video" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
            </button>
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
              {envoi === "video-fichier" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Envoyer une vidéo (MP4)
              <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" aria-label="Fichier vidéo"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) envoyerFichier("video", f); e.target.value = ""; }} />
            </label>
            {retour("video")}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Headphones className="w-4 h-4 text-[#E05017]" /> Podcast</h3>
          <input value={valeurs[CLES_MEDIAS.podcastTitre] || ""} onChange={(e) => maj(CLES_MEDIAS.podcastTitre, e.target.value)} placeholder="Titre du podcast" className={CHAMP} aria-label="Titre du podcast" />
          <textarea value={valeurs[CLES_MEDIAS.podcastDescription] || ""} onChange={(e) => maj(CLES_MEDIAS.podcastDescription, e.target.value)} placeholder="Courte description (facultative)" rows={2} className={CHAMP} aria-label="Description du podcast" />
          <input value={valeurs[CLES_MEDIAS.podcastUrl] || ""} onChange={(e) => maj(CLES_MEDIAS.podcastUrl, e.target.value)} placeholder="Lien SoundCloud, Spotify… ou fichier envoyé" className={CHAMP} aria-label="Lien du podcast" />
          <p className="text-xs text-gray-500">Lecture : {libelle(typeAudio)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => enregistrer("podcast")} disabled={!!envoi} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50">
              {envoi === "podcast" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
            </button>
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
              {envoi === "podcast-fichier" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Envoyer un fichier audio (MP3…)
              <input type="file" accept="audio/*" className="hidden" aria-label="Fichier audio"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) envoyerFichier("podcast", f); e.target.value = ""; }} />
            </label>
            {retour("podcast")}
          </div>
        </div>
      </div>
    </section>
  );
}
