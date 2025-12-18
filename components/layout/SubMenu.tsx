"use client";

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SubMenu() {
  const [isAnnuaireOpen, setIsAnnuaireOpen] = useState(false);

  return (
    <div className="w-full bg-[#E05017] font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm">
        <nav className="flex items-center justify-center gap-6 py-3">
          {/* Annuaire with dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAnnuaireOpen(!isAnnuaireOpen)}
              className="flex items-center gap-1 text-white hover:text-white/90 transition-colors"
            >
              Annuaire
              <ChevronDown className="size-4" />
            </button>
            {isAnnuaireOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="/annuaire/annuaire-des-crasc" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Annuaire des CRASC
                </a>
                <a href="/annuaire/annuaire-des-partenaires-techniques-et-financiers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Annuaire des Partenaires Techniques et Financiers
                </a>
                {/* <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Option 3
                </a> */}
              </div>
            )}
          </div>

          {/* Offres d'emploi */}
          {/* <a
            href="#"
            className="text-white hover:text-white/90 transition-colors"
          >
            Offres d&apos;emploi
          </a> */}

          {/* Offres de projets */}
          <a
            href="#"
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

          {/* Cri de coeur */}
          {/* <a
            href="#"
            className="text-white hover:text-white/90 transition-colors"
          >
            Cri de coeur
          </a> */}
        </nav>
      </div>
    </div>
  );
}
