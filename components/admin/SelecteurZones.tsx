"use client";

import { ZONES_GENERALES, ZONES_PROJET, zonesDe } from "@/lib/zones-projet";

export default function SelecteurZones({ valeur, onChange }: { valeur: string; onChange: (zone: string) => void }) {
  const choisies = zonesDe(valeur);
  const basculer = (z: string) =>
    onChange((choisies.includes(z) ? choisies.filter((c) => c !== z) : [...choisies, z]).join(", "));

  const case_ = (z: string) => (
    <label key={z} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={choisies.includes(z)}
        onChange={() => basculer(z)}
        className="w-4 h-4 text-[#E05017] rounded focus:ring-[#E05017]"
      />
      {z}
    </label>
  );

  return (
    <div className="border border-gray-300 rounded-lg p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 mb-3 border-b border-gray-100">
        {ZONES_GENERALES.map(case_)}
      </div>
      <p className="text-xs font-semibold text-gray-500 mb-2">Régions de Côte d&apos;Ivoire</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {ZONES_PROJET.filter((z) => !ZONES_GENERALES.includes(z)).map(case_)}
      </div>
      {choisies.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">
          {choisies.length} zone{choisies.length > 1 ? "s" : ""} : {choisies.join(", ")}
        </p>
      )}
    </div>
  );
}
