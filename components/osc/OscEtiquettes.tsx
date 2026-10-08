// Étiquettes d'une OSC calculées par l'API : OdF, OdJ, OPSH (catégorie) et Faîtière (niveau de regroupement)

const STYLES: Record<string, { classe: string; titre: string }> = {
  OdF: { classe: "bg-pink-100 text-pink-700", titre: "Organisation de femmes" },
  OdJ: { classe: "bg-sky-100 text-sky-700", titre: "Organisation de jeunes" },
  OPSH: { classe: "bg-violet-100 text-violet-700", titre: "Organisation de personnes en situation de handicap" },
  "Faîtière": { classe: "bg-amber-100 text-amber-800", titre: "Organisation faîtière (réseau, fédération, plateforme, confédération)" },
};

export default function OscEtiquettes({ etiquettes, className = "" }: { etiquettes?: string[] | null; className?: string }) {
  if (!etiquettes || etiquettes.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {etiquettes.map((e) => (
        <span
          key={e}
          title={STYLES[e]?.titre}
          className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold ${STYLES[e]?.classe || "bg-gray-100 text-gray-700"}`}
        >
          {e}
        </span>
      ))}
    </div>
  );
}
