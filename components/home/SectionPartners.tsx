"use client";

import { useEffect, useState } from "react";
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface IPartenaire {
  id: number;
  nom: string;
  logo_url?: string | null;
  site_web?: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Repli si l'API ne répond pas (les logos sont gérés dans l'admin : Accueil › Partenaires)
const PARTENAIRES_DEFAUT: IPartenaire[] = [
  { id: 1, nom: "Save The Children", logo_url: "/images/partenaires/save-the-children.png" },
  { id: 2, nom: "CERAP", logo_url: "/images/partenaires/cerap.png" },
  { id: 3, nom: "Social Justice", logo_url: "/images/partenaires/social-justice.png" },
  { id: 4, nom: "Union Européenne", logo_url: "/images/partenaires/union-europeenne.png" },
  { id: 5, nom: "AICS", logo_url: null, site_web: "https://www.aics.gov.it" },
];

export default function Partners() {
  const [partners, setPartners] = useState<IPartenaire[]>(PARTENAIRES_DEFAUT);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/partenaires-accueil`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setPartners(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-extrabold text-4xl mb-3">Nos partenaires</h2>
          <p className="text-gray-600 text-lg">Ensemble pour un impact durable</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Partners Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {partners.map((partner) => {
            const carte = (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#E05017]/5 to-[#2a591d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-full h-24 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    {partner.logo_url ? (
                      <ImageWithFallback
                        src={partner.logo_url}
                        alt={partner.nom}
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="text-3xl font-black tracking-wider text-[#2a591d]">{partner.nom}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 text-center group-hover:text-[#E05017] transition-colors duration-300">
                    {partner.nom}
                  </h3>
                </div>
              </>
            );
            const classe = "group relative w-[calc(50%-12px)] lg:w-[calc(20%-20px)] min-w-[150px] bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#E05017]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2";
            return partner.site_web ? (
              <a key={partner.id} href={partner.site_web} target="_blank" rel="noopener noreferrer" className={classe} title={partner.nom}>
                {carte}
              </a>
            ) : (
              <div key={partner.id} className={classe}>{carte}</div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#E05017]/5 to-[#2a591d]/5 rounded-2xl p-8 border border-[#E05017]/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            S&apos;enrôler sur la PdoC
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Votre organisation souhaite intégrer la  plateforme des OSC ? Soumettez votre demande et bénéficiez de l&apos;accompagnement de la plateforme PdoC.
          </p>
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Demande d&apos;adhésion
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
