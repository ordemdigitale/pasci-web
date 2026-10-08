"use client";

import { CalendarClock, FileText, Image as ImageIcon, Trash2 } from "lucide-react";

/** Champs ajoutés aux slides : date d'expiration et descriptif affiché par « Voir plus ». */
export interface DescriptifSlide {
  date_expiration: string; // AAAA-MM-JJ ou vide
  objectif: string;
  resume: string;
  article: string;
  photo1: File | null;
  photo2: File | null;
  photo1_url?: string | null;
  photo2_url?: string | null;
  supprimer_photo1?: boolean;
  supprimer_photo2?: boolean;
}

export const DESCRIPTIF_VIDE: DescriptifSlide = {
  date_expiration: "", objectif: "", resume: "", article: "", photo1: null, photo2: null,
};

/** Valeurs initiales depuis une slide existante (page de modification). */
export function descriptifDepuis(s: {
  date_expiration?: string | null; objectif?: string | null; resume?: string | null; article?: string | null;
  photo1_url?: string | null; photo2_url?: string | null;
}): DescriptifSlide {
  return {
    date_expiration: s.date_expiration ? s.date_expiration.slice(0, 10) : "",
    objectif: s.objectif || "",
    resume: s.resume || "",
    article: s.article || "",
    photo1: null,
    photo2: null,
    photo1_url: s.photo1_url,
    photo2_url: s.photo2_url,
  };
}

export function ajouterDescriptif(fd: FormData, d: DescriptifSlide) {
  fd.append("date_expiration", d.date_expiration);
  fd.append("objectif", d.objectif);
  fd.append("resume", d.resume);
  fd.append("article", d.article);
  if (d.photo1) fd.append("photo1", d.photo1);
  if (d.photo2) fd.append("photo2", d.photo2);
  if (d.supprimer_photo1 && !d.photo1) fd.append("supprimer_photo1", "true");
  if (d.supprimer_photo2 && !d.photo2) fd.append("supprimer_photo2", "true");
}

const CHAMP = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017]";

export default function ChampsDescriptifSlide({
  valeur,
  onChange,
}: {
  valeur: DescriptifSlide;
  onChange: (v: DescriptifSlide) => void;
}) {
  const maj = (champ: Partial<DescriptifSlide>) => onChange({ ...valeur, ...champ });
  const aujourdHui = new Date().toISOString().slice(0, 10);

  const photo = (n: 1 | 2) => {
    const fichier = n === 1 ? valeur.photo1 : valeur.photo2;
    const existante = n === 1 ? valeur.photo1_url : valeur.photo2_url;
    const supprimee = n === 1 ? valeur.supprimer_photo1 : valeur.supprimer_photo2;
    const apercu = fichier ? URL.createObjectURL(fichier) : !supprimee ? existante : null;
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo {n}</label>
        {apercu ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={apercu} alt={`Photo ${n}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => maj(n === 1 ? { photo1: null, supprimer_photo1: true } : { photo2: null, supprimer_photo2: true })}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-white"
              title="Retirer la photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1 aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#E05017] text-gray-400 text-xs">
            <ImageIcon className="w-6 h-6" /> Choisir une photo (JPG, PNG, WebP — 5 Mo)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              aria-label={`Photo ${n}`}
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                maj(n === 1 ? { photo1: f, supprimer_photo1: false } : { photo2: f, supprimer_photo2: false });
              }}
            />
          </label>
        )}
      </div>
    );
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4 text-[#E05017]" /> Date d&apos;expiration
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={valeur.date_expiration}
            min={aujourdHui}
            onChange={(e) => maj({ date_expiration: e.target.value })}
            className={CHAMP}
            aria-label="Date d'expiration"
          />
          {valeur.date_expiration && (
            <button type="button" onClick={() => maj({ date_expiration: "" })} className="px-3 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Aucune
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Facultative. Après cette date, l&apos;image est retirée automatiquement du carrousel (site et application).
        </p>
      </div>

      <fieldset className="border border-gray-200 rounded-xl p-4 space-y-4">
        <legend className="px-1 text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#E05017]" /> Descriptif « Voir plus »
        </legend>
        <p className="text-xs text-gray-500 -mt-2">
          Page ouverte par le bouton « Voir plus » de cette image (à la place de la page « À propos »).
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objectif de l&apos;activité</label>
          <textarea value={valeur.objectif} onChange={(e) => maj({ objectif: e.target.value })} rows={2} className={`${CHAMP} resize-y`} aria-label="Objectif de l'activité" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Résumé de l&apos;activité</label>
          <textarea value={valeur.resume} onChange={(e) => maj({ resume: e.target.value })} rows={3} className={`${CHAMP} resize-y`} aria-label="Résumé de l'activité" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {photo(1)}
          {photo(2)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>
          <textarea value={valeur.article} onChange={(e) => maj({ article: e.target.value })} rows={8} className={`${CHAMP} resize-y`} aria-label="Article" />
          <p className="text-xs text-gray-400 mt-1">Ligne vide = nouveau paragraphe, « ## » = intertitre, « - » = puce, **texte** = gras.</p>
        </div>
      </fieldset>
    </>
  );
}
