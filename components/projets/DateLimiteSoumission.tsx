import { CalendarClock, Lock } from "lucide-react";

/** Date limite de soumission d'une offre de projet (« Clôturée » une fois passée). */
export default function DateLimiteSoumission({
  date,
  ouverte,
  joursRestants,
  grand = false,
}: {
  date?: string | null;
  ouverte?: boolean;
  joursRestants?: number | null;
  grand?: boolean;
}) {
  if (!date) return null;
  const libelle = new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const taille = grand ? "text-sm px-3 py-2" : "text-xs px-2.5 py-1";
  if (ouverte === false) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-lg font-semibold bg-gray-100 text-gray-600 ${taille}`}>
        <Lock className="w-3.5 h-3.5" /> Clôturée le {libelle}
      </span>
    );
  }
  const urgent = joursRestants !== null && joursRestants !== undefined && joursRestants <= 7;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg font-semibold ${urgent ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"} ${taille}`}>
      <CalendarClock className="w-3.5 h-3.5" /> Soumission jusqu&apos;au {libelle}
      {urgent && ` (${joursRestants === 0 ? "dernier jour" : `J-${joursRestants}`})`}
    </span>
  );
}
