"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface IPartenaire {
  id: number;
  image_url: string;
  ordre: number;
  is_active: boolean;
  type: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Partners() {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);
  const [partners, setPartners] = useState<IPartenaire[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/hero-slides?active_only=true&type=bas`)
      .then((r) => r.ok ? r.json() : [])
      .then(setPartners)
      .catch(() => setPartners([]));
  }, []);

  if (partners.length === 0) return null;

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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              onMouseEnter={() => setHoveredPartner(partner.id)}
              onMouseLeave={() => setHoveredPartner(null)}
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#E05017]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Card Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E05017]/5 to-[#2a591d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container */}
                <div className="w-full h-24 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <ImageWithFallback
                    src={partner.image_url}
                    alt={`Partenaire ${partner.ordre + 1}`}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#E05017]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#E05017]/5 to-[#2a591d]/5 rounded-2xl p-8 border border-[#E05017]/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Adhésion au CRASC
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Votre organisation souhaite intégrer le réseau des OSC membres du CRASC ? Soumettez votre demande d&apos;adhésion et bénéficiez de l&apos;accompagnement de la plateforme PDOC.
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
