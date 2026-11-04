"use client";

import { Clock, Award, Video, ListOrdered, GraduationCap, Pin, Monitor } from "lucide-react";
import { MODES_FORMATION, DOCUMENTS_DELIVRES } from "@/lib/fetch-formations";

/** Fiche de la formation : mode, durée, document délivré, prérequis, lien visio, chronogramme, épinglage. */
export interface FicheFormation {
  mode: string;
  duree_heures: string;
  document_delivre: string;
  competences_requises: string;
  lien_visio: string;
  chronogramme: string;
  is_pinned: boolean;
}

export const FICHE_VIDE: FicheFormation = {
  mode: "", duree_heures: "", document_delivre: "", competences_requises: "", lien_visio: "", chronogramme: "", is_pinned: false,
};

/** Valeurs initiales depuis une formation existante (page de modification). */
export function ficheDepuis(f: {
  mode?: string | null; duree_heures?: number | null; document_delivre?: string | null;
  competences_requises?: string | null; lien_visio?: string | null; chronogramme?: string | null; is_pinned?: boolean;
}): FicheFormation {
  return {
    mode: f.mode || "",
    duree_heures: f.duree_heures != null ? String(f.duree_heures) : "",
    document_delivre: f.document_delivre || "",
    competences_requises: f.competences_requises || "",
    lien_visio: f.lien_visio || "",
    chronogramme: f.chronogramme || "",
    is_pinned: !!f.is_pinned,
  };
}

/** Une valeur vide efface le champ côté API. */
export function ajouterFiche(fd: FormData, f: FicheFormation, avecEpinglage: boolean) {
  fd.append("mode", f.mode);
  fd.append("duree_heures", f.duree_heures.trim());
  fd.append("document_delivre", f.document_delivre);
  fd.append("competences_requises", f.competences_requises);
  fd.append("lien_visio", f.lien_visio.trim());
  fd.append("chronogramme", f.chronogramme);
  if (avecEpinglage) fd.append("is_pinned", String(f.is_pinned));
}

/** Message d'erreur si la fiche est invalide, sinon null. */
export function erreurFiche(f: FicheFormation): string | null {
  const duree = f.duree_heures.trim().replace(",", ".");
  if (duree && !(Number(duree) >= 0)) return "La durée doit être un nombre d'heures (ex. 12 ou 2,5).";
  if (f.lien_visio.trim() && !/^https?:\/\//i.test(f.lien_visio.trim())) return "Le lien de visioconférence doit commencer par https://";
  return null;
}

const CHAMP = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent";

export default function ChampsFicheFormation({
  valeur,
  onChange,
  peutEpingler,
}: {
  valeur: FicheFormation;
  onChange: (v: FicheFormation) => void;
  /** L'épinglage est réservé au staff */
  peutEpingler: boolean;
}) {
  const maj = (champ: Partial<FicheFormation>) => onChange({ ...valeur, ...champ });

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Monitor className="inline w-4 h-4 mr-1" /> Mode
          </label>
          <select value={valeur.mode} onChange={(e) => maj({ mode: e.target.value })} className={CHAMP}>
            <option value="">Non précisé</option>
            {MODES_FORMATION.map((m) => (
              <option key={m.valeur} value={m.valeur}>{m.libelle}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" /> Durée (en heures)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={valeur.duree_heures}
            onChange={(e) => maj({ duree_heures: e.target.value })}
            className={CHAMP}
            placeholder="Ex : 12"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Award className="inline w-4 h-4 mr-1" /> Document délivré
          </label>
          <select value={valeur.document_delivre} onChange={(e) => maj({ document_delivre: e.target.value })} className={CHAMP}>
            <option value="">Non précisé</option>
            {DOCUMENTS_DELIVRES.map((d) => (
              <option key={d.valeur} value={d.valeur}>{d.libelle}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Video className="inline w-4 h-4 mr-1" /> Lien de la séance en ligne (Zoom, Teams…)
        </label>
        <input
          type="url"
          value={valeur.lien_visio}
          onChange={(e) => maj({ lien_visio: e.target.value })}
          className={CHAMP}
          placeholder="https://zoom.us/j/…"
        />
        <p className="text-xs text-gray-500 mt-1">Affiché aux participants inscrits uniquement.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <GraduationCap className="inline w-4 h-4 mr-1" /> Compétences requises
        </label>
        <textarea
          value={valeur.competences_requises}
          onChange={(e) => maj({ competences_requises: e.target.value })}
          rows={3}
          className={CHAMP}
          placeholder="Ex : savoir utiliser un tableur, avoir déjà rédigé un projet…"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <ListOrdered className="inline w-4 h-4 mr-1" /> Chronogramme de la formation
        </label>
        <textarea
          value={valeur.chronogramme}
          onChange={(e) => maj({ chronogramme: e.target.value })}
          rows={5}
          className={CHAMP}
          placeholder={"Une étape par ligne, par exemple :\nJour 1, 9 h – 12 h : cadrage du projet\nJour 1, 14 h – 17 h : budget"}
        />
      </div>

      {peutEpingler && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={valeur.is_pinned}
            onChange={(e) => maj({ is_pinned: e.target.checked })}
            className="w-5 h-5 text-[#2A591D] border-gray-300 rounded focus:ring-[#2A591D]"
          />
          <span className="text-sm text-gray-700">
            <Pin className="inline w-4 h-4 mr-1 text-[#E05017]" />
            Épingler en tête de la page Formations (3 au plus : la plus ancienne épinglée laisse sa place)
          </span>
        </label>
      )}
    </div>
  );
}
