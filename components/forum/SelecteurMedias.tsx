"use client";

import { useEffect, useRef, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Image as ImageIcon, Mic, Music, Square, X } from "lucide-react";

type TypeMedia = "image" | "audio" | "video";
type Limites = { image: number; audio: number; video: number; fichiers: number };

// Mêmes valeurs par défaut que l'API (settings.FORUM_MAX_*), remplacées par
// celles de GET /forum/medias/limites dès qu'elles sont chargées.
const LIMITES_DEFAUT: Limites = { image: 5, audio: 10, video: 30, fichiers: 4 };
const LIBELLES: Record<TypeMedia, string> = { image: "photo", audio: "audio", video: "vidéo" };
const EXTENSIONS: Record<TypeMedia, string[]> = {
  image: ["jpg", "jpeg", "png", "webp"],
  audio: ["mp3", "m4a", "aac", "ogg", "oga", "wav", "webm", "opus", "3gp"],
  video: ["mp4", "mov", "webm", "3gp", "m4v"],
};

function typeDe(fichier: File): TypeMedia | null {
  const famille = fichier.type.split("/")[0];
  const extension = fichier.name.split(".").pop()?.toLowerCase() || "";
  if ((famille === "image" || famille === "audio" || famille === "video") && EXTENSIONS[famille].includes(extension)) {
    return famille;
  }
  return null;
}

const taille = (octets: number) =>
  octets >= 1024 * 1024 ? `${(octets / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(octets / 1024))} Ko`;

/**
 * Choix des photos, audios et vidéos d'un message, avec enregistrement d'une
 * note vocale depuis le navigateur. Vérifie le format, la taille et le nombre
 * de fichiers avant l'envoi (l'API refait les mêmes contrôles).
 */
export default function SelecteurMedias({
  fichiers,
  onChange,
  disabled,
}: {
  fichiers: File[];
  onChange: (fichiers: File[]) => void;
  disabled?: boolean;
}) {
  const [limites, setLimites] = useState<Limites>(LIMITES_DEFAUT);
  const [erreur, setErreur] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [duree, setDuree] = useState(0);
  const enregistreur = useRef<MediaRecorder | null>(null);
  const morceaux = useRef<Blob[]>([]);
  const minuteur = useRef<ReturnType<typeof setInterval> | null>(null);
  const champPhotoVideo = useRef<HTMLInputElement>(null);
  const champAudio = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.forum.poles.replace(/\/poles$/, "")}/medias/limites`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setLimites({ ...LIMITES_DEFAUT, ...data }))
      .catch(() => {});
    return () => {
      if (minuteur.current) clearInterval(minuteur.current);
      enregistreur.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function ajouter(nouveaux: File[]) {
    setErreur("");
    const acceptes: File[] = [];
    for (const f of nouveaux) {
      const type = typeDe(f);
      if (!type) {
        setErreur(`« ${f.name} » : format non accepté (photos JPG/PNG/WebP, audio, vidéo MP4/MOV/WebM).`);
        continue;
      }
      if (f.size > limites[type] * 1024 * 1024) {
        setErreur(`« ${f.name} » dépasse ${limites[type]} Mo (taille maximale pour une ${LIBELLES[type]}).`);
        continue;
      }
      acceptes.push(f);
    }
    const total = [...fichiers, ...acceptes];
    if (total.length > limites.fichiers) {
      setErreur(`${limites.fichiers} fichiers au maximum par message.`);
      onChange(total.slice(0, limites.fichiers));
    } else {
      onChange(total);
    }
  }

  async function demarrerEnregistrement() {
    setErreur("");
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErreur("L'enregistrement audio n'est pas disponible sur ce navigateur : joignez un fichier audio.");
      return;
    }
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ["audio/webm", "audio/mp4", "audio/ogg"].find((m) => MediaRecorder.isTypeSupported(m)) || "";
      const rec = new MediaRecorder(flux, mime ? { mimeType: mime } : undefined);
      morceaux.current = [];
      rec.ondataavailable = (e) => e.data.size && morceaux.current.push(e.data);
      rec.onstop = () => {
        flux.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || mime || "audio/webm";
        const extension = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        const blob = new Blob(morceaux.current, { type: type.split(";")[0] });
        ajouter([new File([blob], `note-vocale-${Date.now()}.${extension}`, { type: blob.type })]);
      };
      rec.start();
      enregistreur.current = rec;
      setDuree(0);
      setEnregistrement(true);
      minuteur.current = setInterval(() => setDuree((d) => d + 1), 1000);
    } catch {
      setErreur("Micro inaccessible : autorisez l'accès au micro dans votre navigateur.");
    }
  }

  function arreterEnregistrement() {
    enregistreur.current?.stop();
    enregistreur.current = null;
    if (minuteur.current) clearInterval(minuteur.current);
    setEnregistrement(false);
  }

  const plein = fichiers.length >= limites.fichiers;
  const bouton =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors disabled:opacity-40";

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || plein || enregistrement}
          onClick={() => champPhotoVideo.current?.click()}
          className={`${bouton} border-gray-200 text-gray-600 hover:border-[#E05017]/50`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Photo / vidéo
        </button>
        <button
          type="button"
          disabled={disabled || plein || enregistrement}
          onClick={() => champAudio.current?.click()}
          className={`${bouton} border-gray-200 text-gray-600 hover:border-[#E05017]/50`}
        >
          <Music className="w-3.5 h-3.5" /> Fichier audio
        </button>
        {enregistrement ? (
          <button type="button" onClick={arreterEnregistrement} className={`${bouton} border-red-300 bg-red-50 text-red-700`}>
            <Square className="w-3.5 h-3.5" /> Arrêter ({Math.floor(duree / 60)}:{String(duree % 60).padStart(2, "0")})
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled || plein}
            onClick={demarrerEnregistrement}
            className={`${bouton} border-gray-200 text-gray-600 hover:border-[#E05017]/50`}
          >
            <Mic className="w-3.5 h-3.5" /> Note vocale
          </button>
        )}
        <span className="text-[11px] text-gray-400">
          Photo {limites.image} Mo · audio {limites.audio} Mo · vidéo {limites.video} Mo · {limites.fichiers} fichiers max.
        </span>
      </div>

      <input
        ref={champPhotoVideo}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm,video/3gpp"
        multiple
        hidden
        onChange={(e) => {
          ajouter(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
      <input
        ref={champAudio}
        type="file"
        accept="audio/*"
        multiple
        hidden
        onChange={(e) => {
          ajouter(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />

      {erreur && <p className="text-xs text-red-600 mt-2">{erreur}</p>}

      {fichiers.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {fichiers.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
            >
              <span className="max-w-[180px] truncate">{f.name}</span>
              <span className="text-gray-400">{taille(f.size)}</span>
              <button
                type="button"
                onClick={() => onChange(fichiers.filter((_, j) => j !== i))}
                className="text-gray-400 hover:text-red-600"
                aria-label={`Retirer ${f.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
