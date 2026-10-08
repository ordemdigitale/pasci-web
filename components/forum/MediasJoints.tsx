"use client";

import { IPieceJointe } from "@/types/api.types";

/** Photos, audios et vidéos joints à un sujet ou à un message d'un pôle. */
export default function MediasJoints({ pieces }: { pieces?: IPieceJointe[] }) {
  if (!pieces || pieces.length === 0) return null;
  const images = pieces.filter((p) => p.type === "image");
  const autres = pieces.filter((p) => p.type !== "image");

  return (
    <div className="mt-3 space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.nom || "Photo jointe"}
                loading="lazy"
                className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90"
              />
            </a>
          ))}
        </div>
      )}
      {autres.map((p) =>
        p.type === "audio" ? (
          <audio key={p.id} controls preload="none" src={p.url} className="w-full max-w-md">
            <a href={p.url}>{p.nom || "Écouter l'audio"}</a>
          </audio>
        ) : (
          <video
            key={p.id}
            controls
            preload="metadata"
            src={p.url}
            className="w-full max-w-lg rounded-lg border border-gray-200 bg-black"
          >
            <a href={p.url}>{p.nom || "Voir la vidéo"}</a>
          </video>
        )
      )}
    </div>
  );
}
