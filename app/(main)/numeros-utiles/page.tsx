/* app/(main)/numeros-utiles/page.tsx */
import type { Metadata } from "next";
import { Phone, Shield, Flame, Heart, Ambulance, AlertTriangle, Info, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Numéros utiles — PDOC",
  description: "Retrouvez les numéros d'urgence et services utiles en Côte d'Ivoire : Police, Pompiers, SAMU, et bien plus.",
};

interface NumeroItem {
  label: string;
  numero: string;
  description?: string;
}

interface Categorie {
  titre: string;
  couleur: string;
  bg: string;
  bordure: string;
  icon: React.ReactNode;
  numeros: NumeroItem[];
}

const CATEGORIES: Categorie[] = [
  {
    titre: "Urgences médicales",
    couleur: "text-red-600",
    bg: "bg-red-50",
    bordure: "border-red-200",
    icon: <Ambulance className="w-6 h-6 text-red-600" />,
    numeros: [
      { label: "SAMU", numero: "185", description: "Service d'Aide Médicale Urgente" },
      { label: "Croix-Rouge de Côte d'Ivoire", numero: "01 51 06 89", description: "Assistance humanitaire" },
      { label: "CHU de Cocody", numero: "22 48 16 07" },
      { label: "CHU de Treichville", numero: "21 35 68 00" },
      { label: "CHU de Yopougon", numero: "23 45 81 81" },
    ],
  },
  {
    titre: "Sécurité & Police",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    bordure: "border-blue-200",
    icon: <Shield className="w-6 h-6 text-blue-700" />,
    numeros: [
      { label: "Police secours", numero: "111", description: "Numéro d'urgence national" },
      { label: "Gendarmerie nationale", numero: "170" },
      { label: "Brigade anti-criminalité (BAC)", numero: "110" },
      { label: "Police judiciaire", numero: "22 44 78 47" },
    ],
  },
  {
    titre: "Pompiers & Secours",
    couleur: "text-orange-600",
    bg: "bg-orange-50",
    bordure: "border-orange-200",
    icon: <Flame className="w-6 h-6 text-orange-600" />,
    numeros: [
      { label: "Sapeurs-Pompiers", numero: "180", description: "Incendies et secours d'urgence" },
      { label: "Protection civile", numero: "185" },
    ],
  },
  {
    titre: "Protection sociale & Enfance",
    couleur: "text-purple-700",
    bg: "bg-purple-50",
    bordure: "border-purple-200",
    icon: <Heart className="w-6 h-6 text-purple-700" />,
    numeros: [
      { label: "Enfance en danger (SOS Enfants)", numero: "116", description: "Signalement maltraitance enfants" },
      { label: "Violences faites aux femmes", numero: "1717", description: "Ligne nationale d'écoute" },
      { label: "Ministère de la Femme", numero: "20 21 81 22" },
      { label: "Direction Protection de l'Enfant", numero: "20 21 76 65" },
    ],
  },
  {
    titre: "Services publics",
    couleur: "text-[#2a591d]",
    bg: "bg-green-50",
    bordure: "border-green-200",
    icon: <Info className="w-6 h-6 text-[#2a591d]" />,
    numeros: [
      { label: "CI-Énergie (panne électricité)", numero: "100" },
      { label: "SODECI (eau)", numero: "20 30 60 00" },
      { label: "Orange CI assistance", numero: "888" },
      { label: "MTN assistance", numero: "188" },
      { label: "Moov Africa assistance", numero: "155" },
    ],
  },
  {
    titre: "Organisations de la société civile",
    couleur: "text-[#E05017]",
    bg: "bg-orange-50",
    bordure: "border-orange-200",
    icon: <Users className="w-6 h-6 text-[#E05017]" />,
    numeros: [
      { label: "PDOC — Plateforme OSC CRASC", numero: "05 05 56 57 41", description: "15, avenue Jean Mermoz, Cocody" },
      { label: "Email PDOC", numero: "pdoc@plateforme-osci.org", description: "Contact par email" },
      { label: "ONUCI — Bureau CI", numero: "20 31 75 00" },
      { label: "PNUD Côte d'Ivoire", numero: "20 31 49 00" },
    ],
  },
  {
    titre: "Urgences nationales",
    couleur: "text-gray-700",
    bg: "bg-gray-50",
    bordure: "border-gray-200",
    icon: <AlertTriangle className="w-6 h-6 text-gray-600" />,
    numeros: [
      { label: "Numéro d'urgence européen (appel gratuit)", numero: "112" },
      { label: "Centre antipoison", numero: "20 21 32 11" },
      { label: "Cellule de crise nationale", numero: "20 33 62 62" },
    ],
  },
];

export default function NumerosUtilesPage() {
  return (
    <section className="pb-16 font-poppins">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#052838] to-[#0a4060] py-14 px-4 text-center mb-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #E05017 0%, transparent 55%), radial-gradient(circle at 80% 20%, #2a591d 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Numéros utiles
          </h1>
          <p className="text-white/75 text-base">
            Retrouvez les numéros d&apos;urgence et de services essentiels en Côte d&apos;Ivoire.
            En cas d&apos;urgence vitale, composez le <strong className="text-white">185</strong> (SAMU) ou le <strong className="text-white">180</strong> (Pompiers).
          </p>
        </div>
      </div>

      {/* Raccourcis urgences */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "SAMU", numero: "185", color: "bg-red-600" },
            { label: "Pompiers", numero: "180", color: "bg-orange-500" },
            { label: "Police", numero: "111", color: "bg-blue-700" },
            { label: "Gendarmerie", numero: "170", color: "bg-blue-900" },
          ].map((u) => (
            <a
              key={u.numero}
              href={`tel:${u.numero}`}
              className={`${u.color} rounded-xl p-4 text-white text-center hover:opacity-90 transition-opacity shadow-md`}
            >
              <p className="text-3xl font-extrabold">{u.numero}</p>
              <p className="text-sm font-semibold mt-1 opacity-90">{u.label}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Grille des catégories */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.titre}
              className={`${cat.bg} border ${cat.bordure} rounded-2xl p-6`}
            >
              {/* En-tête catégorie */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">{cat.icon}</div>
                <h2 className={`font-bold text-base ${cat.couleur}`}>{cat.titre}</h2>
              </div>

              {/* Liste des numéros */}
              <ul className="space-y-3">
                {cat.numeros.map((n) => (
                  <li key={n.numero} className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                      {n.description && (
                        <p className="text-xs text-gray-500">{n.description}</p>
                      )}
                    </div>
                    <a
                      href={n.numero.includes("@") ? `mailto:${n.numero}` : `tel:${n.numero.replace(/\s/g, "")}`}
                      className={`flex-shrink-0 font-bold text-sm ${cat.couleur} hover:underline whitespace-nowrap`}
                    >
                      {n.numero}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note bas de page */}
        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> Ces numéros sont fournis à titre indicatif. En cas d&apos;urgence absolue,
            composez le <strong>185</strong> (SAMU) ou le <strong>180</strong> (Pompiers).
            Certains numéros peuvent varier selon la région ou l&apos;opérateur.
          </p>
        </div>
      </div>
    </section>
  );
}
