// lib/contenus-site.tsx | Textes et illustrations modifiables depuis l'admin (clés de /api/v1/config)
"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Format des textes (volontairement simple, saisi dans un champ texte) :
 * - une ligne vide sépare deux paragraphes ;
 * - « ## Titre » : intertitre ;
 * - « - élément » : puce ;
 * - **gras** ;
 * - {nb_poles} : remplacé par le nombre de pôles actifs.
 */
export const CONTENUS_PAR_DEFAUT: Record<string, string> = {
  poles_intro: `Les pôles de concertation, il y en a {nb_poles}. Ce sont des espaces où les organisations de la société civile (OSC) peuvent **se rencontrer, discuter librement et partager leurs idées**.

- Chaque pôle met en avant un domaine important (par exemple agriculture, santé, éducation…).
- Seules les OSC inscrites sur la plateforme peuvent y participer.
- Les échanges se font dans un esprit de **respect** et de **collaboration**, pour avancer ensemble vers des objectifs communs.

Les pôles sont des lieux pour **parler, échanger et valoriser les priorités des OSC**, dans une ambiance constructive et ouverte.`,
  poles_charte: `## 1. Objectif des pôles
Les pôles de concertation sont des espaces où les organisations de la société civile (OSC) peuvent **échanger librement, partager leurs idées et mettre en valeur leurs domaines prioritaires**.

## 2. Accès et participation
- Les pôles sont **réservés aux OSC inscrites** sur la plateforme.
- Chaque membre participe en son nom et représente son organisation.
- L'inscription implique l'acceptation de cette charte.

## 3. Principes de fonctionnement
- **Respect mutuel** : chaque avis compte, aucune discrimination n'est tolérée.
- **Intérêt commun** : les discussions doivent servir à renforcer l'action collective.
- **Transparence** : les échanges sont clairs et ouverts à tous les membres du pôle.
- **Collaboration** : les pôles favorisent l'entraide et la mise en réseau.

## 4. Organisation des échanges
- Les discussions se font en ligne sur la plateforme.
- Les pôles peuvent organiser des **rencontres thématiques** ou des ateliers.
- Les contributions doivent rester **constructives et pertinentes**.

## 5. Responsabilités des membres
- Respecter les règles de la charte.
- Participer activement aux échanges.
- Valoriser les priorités de son domaine (éducation, santé, agriculture, etc.).
- Partager des informations fiables et utiles.

## 6. Suivi et amélioration
- Les pôles peuvent proposer des **recommandations collectives**.
- Un bilan régulier est fait pour mesurer l'impact des échanges.
- La charte peut évoluer selon les besoins des OSC.`,
  poles_illustration: "/images/b81daf7f-c015-4a68-942f-ce602fdf5542.jpg",
  ressources_illustration: "/images/3a510ba6881dd3274d3f509019311d42ace72cf51c823f60c5e5fe2e112ff892.png",
};

/** Valeurs de configuration du site, complétées par les valeurs par défaut. */
export function useContenusSite() {
  const [config, setConfig] = useState<Record<string, string>>({});
  useEffect(() => {
    let actif = true;
    fetch(`${API_BASE}/api/v1/config`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (actif) setConfig(data || {});
      })
      .catch(() => {});
    return () => {
      actif = false;
    };
  }, []);
  return (cle: string) => (config[cle] && config[cle].trim()) || CONTENUS_PAR_DEFAUT[cle] || "";
}

function enLigne(texte: string, variables: Record<string, string | number>, cle: string) {
  const remplace = texte.replace(/\{(\w+)\}/g, (m, nom) => (nom in variables ? String(variables[nom]) : m));
  return remplace.split(/(\*\*[^*]+\*\*)/g).map((morceau, i) =>
    morceau.startsWith("**") && morceau.endsWith("**") ? (
      <b key={`${cle}-${i}`}>{morceau.slice(2, -2)}</b>
    ) : (
      <React.Fragment key={`${cle}-${i}`}>{morceau}</React.Fragment>
    ),
  );
}

/** Affiche un texte au format ci-dessus (sans HTML : aucun risque d'injection). */
export function TexteFormate({
  texte,
  variables = {},
  className = "",
}: {
  texte: string;
  variables?: Record<string, string | number>;
  className?: string;
}) {
  const blocs: React.ReactNode[] = [];
  let puces: string[] = [];
  let paragraphe: string[] = [];
  const vider = (cle: number) => {
    if (paragraphe.length) {
      blocs.push(<p key={`p${cle}`} className="mb-3">{enLigne(paragraphe.join(" "), variables, `p${cle}`)}</p>);
      paragraphe = [];
    }
    if (puces.length) {
      blocs.push(
        <ul key={`u${cle}`} className="list-disc list-inside pl-5 mb-3">
          {puces.map((p, i) => <li key={i}>{enLigne(p, variables, `u${cle}-${i}`)}</li>)}
        </ul>,
      );
      puces = [];
    }
  };
  texte.split(/\r?\n/).forEach((ligne, i) => {
    const l = ligne.trim();
    if (!l) return vider(i);
    if (l.startsWith("## ")) {
      vider(i);
      blocs.push(<h4 key={`h${i}`} className="font-bold mt-4 mb-1">{enLigne(l.slice(3), variables, `h${i}`)}</h4>);
    } else if (l.startsWith("- ")) {
      if (paragraphe.length) vider(i);
      puces.push(l.slice(2));
    } else {
      if (puces.length) vider(i);
      paragraphe.push(l);
    }
  });
  vider(-1);
  return <div className={className}>{blocs}</div>;
}
