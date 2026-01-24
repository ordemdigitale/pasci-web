"use client";

import { useState } from "react";
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface IPartenaires {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  website?: string;
}

export default function Partners() {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);

  const partners: IPartenaires[] = [
    {
      id: 1,
      name: 'Save The Children',
      imageUrl: "/images/partenaires/save-the-children.png",
      description: "Protection de l'enfance",
      website: "#"
    },
    {
      id: 2,
      name: 'CERAP',
      imageUrl: '/images/partenaires/cerap.png',
      description: "Recherche et formation",
      website: "#"
    },
    {
      id: 3,
      name: 'Social Justice',
      imageUrl: '/images/partenaires/social-justice.png',
      description: "Justice sociale",
      website: "#"
    },
    {
      id: 4,
      name: 'Union Européenne',
      imageUrl: '/images/partenaires/union-europeenne.png',
      description: "Coopération internationale",
      website: "#"
    },
  ];

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
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                {/* Partner Name */}
                <h3 className="text-sm font-bold text-gray-900 text-center mb-2 group-hover:text-[#E05017] transition-colors duration-300">
                  {partner.name}
                </h3>

                {/* Description - visible on hover */}
                {partner.description && (
                  <p className={`text-xs text-gray-500 text-center mb-3 transition-all duration-300 ${
                    hoveredPartner === partner.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                  }`}>
                    {partner.description}
                  </p>
                )}

                {/* External Link Icon - visible on hover */}
                {/* {partner.website && (
                  <Link
                    href={partner.website}
                    className={`flex items-center gap-1 text-xs font-semibold text-[#E05017] transition-all duration-300 ${
                      hoveredPartner === partner.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <span>Visiter</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )} */}
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#E05017]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#E05017]/5 to-[#2a591d]/5 rounded-2xl p-8 border border-[#E05017]/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Devenez partenaire
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Rejoignez notre réseau de partenaires engagés pour le développement de la société civile en Côte d'Ivoire
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Nous contacter
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
