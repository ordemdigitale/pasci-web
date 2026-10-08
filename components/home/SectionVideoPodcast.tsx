"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Headphones, Radio, Video } from "lucide-react";
import { CLES_MEDIAS, lecteurAudio, lecteurVideo } from "@/lib/medias-accueil";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Lucarnes de l'accueil (remplacent « Télécharger PdoC sur Android » et le QR code) :
 * une vidéo — qui peut être un Live — et un podcast avec son titre, réglés dans
 * l'admin (Textes et illustrations › Accueil : vidéo et podcast).
 */
export default function SectionVideoPodcast() {
  const [cfg, setCfg] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/config`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setCfg(data || {}))
      .catch(() => setCfg({}));
  }, []);

  if (!cfg) return null;
  const v = (cle: string) => (cfg[cle] || "").trim();
  const video = lecteurVideo(v(CLES_MEDIAS.videoUrl));
  const audio = lecteurAudio(v(CLES_MEDIAS.podcastUrl));
  if (!video && !audio) return null;
  const enDirect = v(CLES_MEDIAS.videoDirect) === "true";

  return (
    <section className="py-10 bg-white font-poppins">
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 ${video && audio ? "md:grid-cols-[1fr_340px]" : ""}`}>
        {video && (
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#f0f9ff]">
            <div className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A591D] text-white flex items-center justify-center flex-shrink-0">
                {enDirect ? <Radio className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#E05017]">{enDirect ? "Live" : "Vidéo"}</p>
                  {enDirect && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> EN DIRECT
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">{v(CLES_MEDIAS.videoTitre) || "Vidéo de la PdoC"}</h2>
                {v(CLES_MEDIAS.videoDescription) && <p className="text-sm text-gray-600 mt-1">{v(CLES_MEDIAS.videoDescription)}</p>}
              </div>
            </div>
            <div className="aspect-video bg-black">
              {video.type === "iframe" ? (
                <iframe
                  src={video.src}
                  title={v(CLES_MEDIAS.videoTitre) || "Vidéo"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : video.type === "fichier" ? (
                <video src={video.src} controls className="w-full h-full" preload="metadata" />
              ) : (
                <a href={video.src} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center gap-2 text-white font-semibold hover:underline">
                  <ExternalLink className="w-5 h-5" /> Regarder la vidéo
                </a>
              )}
            </div>
          </div>
        )}

        {audio && (
          <div className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm flex flex-col">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E05017] text-white flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[#E05017] mb-1">Podcast</p>
                <h2 className="text-lg font-extrabold text-gray-900">{v(CLES_MEDIAS.podcastTitre) || "Podcast de la PdoC"}</h2>
                {v(CLES_MEDIAS.podcastDescription) && <p className="text-sm text-gray-600 mt-1">{v(CLES_MEDIAS.podcastDescription)}</p>}
              </div>
            </div>
            <div className="mt-auto">
              {audio.type === "fichier" ? (
                <audio src={audio.src} controls preload="metadata" className="w-full" />
              ) : audio.type === "iframe" ? (
                <iframe src={audio.src} title={v(CLES_MEDIAS.podcastTitre) || "Podcast"} className="w-full rounded-lg" style={{ height: audio.hauteur }} allow="autoplay; encrypted-media" />
              ) : (
                <a href={audio.src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E05017] text-white text-sm font-semibold hover:bg-[#c94714]">
                  <Headphones className="w-4 h-4" /> Écouter le podcast
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
