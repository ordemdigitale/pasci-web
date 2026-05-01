"use client";

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SubMenu() {
  /* const [isAnnuaireOpen, setIsAnnuaireOpen] = useState(false); */
  return (
    <div className="w-full bg-[#E05017] font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm">
        <nav className="flex items-center justify-center gap-6 py-3">
          {/* Annuaire des CRASC */}
          <a
            href="/annuaire/annuaire-des-crasc"
            className="text-white hover:text-white/90 transition-colors"
          >
            Annuaire des CRASC
          </a>

          {/* Annuaire des PTF */}
          <a
            href="/annuaire/annuaire-des-partenaires-techniques-et-financiers"
            className="text-white hover:text-white/90 transition-colors"
          >
            Annuaire des PTF
          </a>

          {/* Offres de projets */}
          <a
            href="/offre-projets"
            className="text-white hover:text-white/90 transition-colors"
          >
            Offres de projets
          </a>

          {/* Processus de formalisation */}
          <a
            href="/processus-de-formalisation"
            className="text-white hover:text-white/90 transition-colors"
          >
            Processus de formalisation
          </a>
        </nav>
      </div>
    </div>
  );
}
