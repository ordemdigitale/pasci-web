import React from "react";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { Button } from '@/components/ui/button'
import {
  CircleCheck, 
  Handshake,
  Signal,
  Users,
  Globe,
  FileText
} from 'lucide-react';

interface IFormal {
  id: number;
  icon: React.ReactNode;
  name: string;
  content: string;
}

interface IProcessData {
  id: number;
  name: string;
}
const formal: IFormal[] = [
  {
    id: 1,
    icon: <CircleCheck size={24} color="#E05017" />,
    name: "Reconnaissance Légale",
    content: "Obtenez un statut juridique officiel, indispensable pour opérer en toute légalité et bénéficier de protections."
  },
  {
    id: 2,
    icon: <Handshake size={24} color="#E05017" />,
    name: "Crédibilité Accrue",
    content: "Renforcez la confiance des partenaires financiers, institutionnels et des communautés que vous servez."
  },
  {
    id: 3,
    icon: <Signal size={24} color="#E05017" />,
    name: "Accès aux Financements",
    content: "Ouvrez les portes à des opportunités de subventions, de dons et de partenariats nationaux et internationaux."
  },
  {
    id: 4,
    icon: <Users size={24} color="#E05017" />,
    name: "Renforcement Institutionnel",
    content: "Améliorez votre gouvernance interne et votre capacité à mobiliser des ressources humaines et matérielles."
  },
  {
    id: 5,
    icon: <Globe size={24} color="#E05017" />,
    name: "Visibilité et Influence",
    content: "Accroissez votre impact et votre participation aux débats publics et aux processus décisionnels."
  },
  {
    id: 6,
    icon: <FileText size={24} color="#E05017" />,
    name: "Protection Juridique",
    content: "Protégez les membres et les activités de votre organisation contre les litiges et les abus."
  },
];

const processData: IProcessData[] = [
  {
    id: 1,
    name: "Rédaction des Statuts et  règlement intérieur"
  },
  {
    id: 2,
    name: "Assemblée Générale Constitutive (AGC)"
  },
  {
    id: 3,
    name: "Composition du Bureau Exécutif"
  },
  {
    id: 4,
    name: "Liste des Membres Fondateurs"
  },
  {
    id: 5,
    name: "Dépôt du Dossier"
  },
  {
    id: 6,
    name: "Réception et Enregristrement"
  },
  {
    id: 7,
    name: "Traitement du Dossier"
  },
  {
    id: 8,
    name: "Enquête de Moralité"
  },
  {
    id: 9,
    name: "Délivrance du Récépissé Définitif"
  },
  {
    id: 10,
    name: "Publication au Journal Officiel"
  }
];

export default function PageProcessusFormalisation() {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-4xl text-[#2a591d] leading-tight">Simplifiez la Formalisation de Votre Organisation</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Le processus de formalisation des Organisations de la Société Civile (OSC) est une étape cruciale pour leur reconnaissance légale et leur développement. Découvrez comment le projet PASCI vous accompagne pour naviguer efficacement dans cette démarche.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/process-formalisation-page.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Pourquoi formaliser votre OSC ? */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Pourquoi formaliser votre OSC ?</p>
        <div className="max-w-5xl mx-auto">
          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formal.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover-shadow-lg transition-shadow bg-white py-4 px-5"
              >
                {/* Image */}
                {/* <div className="">
                  <ImageWithFallback
                    
                    alt={item.name}
                    className="w-15 h-15"
                  />
                </div> */}
                {item.icon}
                {/* Name and Role */}
                <div className="pl-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm font-medium text-gray-600 py-1 inline-block">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-5xl mx-auto">
          <p className="font-bold text-4xl text-center pb-4">
            Les 10 Étapes Détaillées du Processus de Formalisation en Côte d'Ivoire
          </p>

          <div className="">
            {processData.map((item) => (
              <div key={item.id} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl py-4 my-4 shadow-md">
                <div className="flex flex-row items-center justify-between gap-8">
                  <p className="text-[#E05017] font-bold">{item.id}.</p>
                  <p className="font-bold">{item.name}</p>
                  <p>{/*  */}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* Prêt à se faire accompagner */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg py-8 space-y-6 text-center text-white shadow-md border border-gray-200">
          <p className="font-bold text-4xl text-black">Prêt à se faire accompagner ?</p>
          <p className="max-w-2xl mx-auto text-gray-800">
            Nous sommes votre partenaire pour réussir votre processus de formalisation. Contactez-nous pour bénéficier d'un accompagnement personnalisé et propulser votre organisation vers de nouveaux sommets.
          </p>
          <Button className="border border-transparent hover:border-[#E05017] text-white hover:text-[#E05017] bg-white hover:bg-transparent bg-[#E05017] rounded-lg px-6">
            Contactez-nous
          </Button>
        </div>
      </div>

    </section>
  )
}
