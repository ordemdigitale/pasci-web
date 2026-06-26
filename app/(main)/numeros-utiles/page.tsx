/* app/(main)/numeros-utiles/page.tsx */
import type { Metadata } from "next";
import { Phone, Shield, Flame, Heart, Ambulance, AlertTriangle, Info, Users, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Numéros utiles — PdoC",
  description: "Retrouvez les numéros d'urgence et services utiles en Côte d'Ivoire.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface NumeroUtile {
  id: number;
  categorie: string;
  label: string;
  numero: string;
  description: string | null;
  ordre: number;
  is_active: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "Urgences médicales": <Ambulance className="w-5 h-5" />,
  "Sécurité & Police": <Shield className="w-5 h-5" />,
  "Pompiers & Secours": <Flame className="w-5 h-5" />,
  "Protection sociale & Enfance": <Heart className="w-5 h-5" />,
  "Services publics": <Info className="w-5 h-5" />,
  "Organisations de la société civile": <Users className="w-5 h-5" />,
  "Urgences nationales": <AlertTriangle className="w-5 h-5" />,
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  "Urgences médicales":                  { text: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
  "Sécurité & Police":                   { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  "Pompiers & Secours":                  { text: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200" },
  "Protection sociale & Enfance":        { text: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200" },
  "Services publics":                    { text: "text-green-700",   bg: "bg-green-50",   border: "border-green-200" },
  "Organisations de la société civile":  { text: "text-[#E05017]",   bg: "bg-orange-50",  border: "border-orange-200" },
  "Urgences nationales":                 { text: "text-gray-700",    bg: "bg-gray-50",    border: "border-gray-200" },
};

const DEFAULT_COLOR = { text: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" };

async function fetchNumeros(): Promise<NumeroUtile[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/numeros-utiles/`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const TOP_URGENCES = [
  { label: "SAMU",         numero: "185", color: "bg-red-600" },
  { label: "Pompiers",     numero: "180", color: "bg-orange-500" },
  { label: "Police",       numero: "111", color: "bg-blue-700" },
  { label: "Gendarmerie",  numero: "170", color: "bg-blue-900" },
];

export default async function NumerosUtilesPage() {
  const numeros = await fetchNumeros();

  // Grouper par catégorie dans l'ordre d'apparition
  const grouped: Record<string, NumeroUtile[]> = {};
  for (const n of numeros) {
    if (!grouped[n.categorie]) grouped[n.categorie] = [];
    grouped[n.categorie].push(n);
  }

  return (
    <section className="pb-16 font-poppins">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#052838] to-[#0a4060] py-14 px-4 text-center mb-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #E05017 0%, transparent 55%), radial-gradient(circle at 80% 20%, #2a591d 0%, transparent 50%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Numéros utiles</h1>
          <p className="text-white/75 text-base">
            Retrouvez les numéros d&apos;urgence et de services essentiels en Côte d&apos;Ivoire.
            En cas d&apos;urgence vitale, composez le{" "}
            <strong className="text-white">185</strong> (SAMU) ou le{" "}
            <strong className="text-white">180</strong> (Pompiers).
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Raccourcis urgences */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {TOP_URGENCES.map((u) => (
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

        {/* Grille des catégories */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun numéro disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(grouped).map(([cat, items]) => {
              const colors = COLOR_MAP[cat] || DEFAULT_COLOR;
              const icon = ICON_MAP[cat] || <Phone className="w-5 h-5" />;
              return (
                <div key={cat} className={`${colors.bg} border ${colors.border} rounded-2xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={colors.text}>{icon}</span>
                    <h2 className={`font-bold text-base ${colors.text}`}>{cat}</h2>
                  </div>
                  <ul className="space-y-3">
                    {items.map((n) => (
                      <li key={n.id} className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                          {n.description && <p className="text-xs text-gray-500">{n.description}</p>}
                        </div>
                        <a
                          href={n.numero.includes("@") ? `mailto:${n.numero}` : `tel:${n.numero.replace(/\s/g, "")}`}
                          className={`flex-shrink-0 font-bold text-sm ${colors.text} hover:underline whitespace-nowrap`}
                        >
                          {n.numero}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* Note */}
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
