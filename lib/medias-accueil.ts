// lib/medias-accueil.ts | Lucarnes vidéo (live) et podcast de l'accueil (clés de /api/v1/config)

export const CLES_MEDIAS = {
  videoTitre: "accueil_video_titre",
  videoDescription: "accueil_video_description",
  videoUrl: "accueil_video_url",
  videoDirect: "accueil_video_direct",
  podcastTitre: "accueil_podcast_titre",
  podcastDescription: "accueil_podcast_description",
  podcastUrl: "accueil_podcast_url",
} as const;

const EXT_VIDEO = /\.(mp4|webm|mov)(\?|$)/i;
const EXT_AUDIO = /\.(mp3|m4a|aac|ogg|oga|wav)(\?|$)/i;

export type LecteurVideo = { type: "iframe"; src: string } | { type: "fichier"; src: string } | { type: "lien"; src: string };
export type LecteurAudio = { type: "iframe"; src: string; hauteur: number } | { type: "fichier"; src: string } | { type: "lien"; src: string };

/**
 * Lecteur adapté au lien saisi : YouTube (vidéo ou direct), Vimeo, Facebook
 * (vidéo ou Live), sinon fichier vidéo envoyé sur la plateforme.
 */
export function lecteurVideo(url: string): LecteurVideo | null {
  const u = url.trim();
  if (!u) return null;
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/facebook\.com|fb\.watch/.test(u)) {
    return { type: "iframe", src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false` };
  }
  if (EXT_VIDEO.test(u) || u.includes("/static/accueil-medias/")) return { type: "fichier", src: u };
  return { type: "lien", src: u };
}

/** Lecteur du podcast : fichier audio envoyé, SoundCloud, Spotify, sinon lien « Écouter ». */
export function lecteurAudio(url: string): LecteurAudio | null {
  const u = url.trim();
  if (!u) return null;
  if (EXT_AUDIO.test(u) || u.includes("/static/accueil-medias/")) return { type: "fichier", src: u };
  if (/soundcloud\.com/.test(u)) {
    return { type: "iframe", src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u)}&visual=false`, hauteur: 166 };
  }
  const spotify = u.match(/open\.spotify\.com\/(episode|show)\/(\w+)/);
  if (spotify) return { type: "iframe", src: `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}`, hauteur: 152 };
  return { type: "lien", src: u };
}
