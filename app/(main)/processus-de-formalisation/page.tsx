import React from "react";
import Link from "next/link";
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
    name: "Reconnaissance légale",
    content: "obtenir un statut officiel pour agir en toute légalité."
  },
  {
    id: 2,
    icon: <Handshake size={24} color="#E05017" />,
    name: "Crédibilité renforcée",
    content: "inspirer confiance aux partenaires et aux communautés."
  },
  {
    id: 3,
    icon: <Signal size={24} color="#E05017" />,
    name: "Accès aux financements",
    content: "ouvrir la porte aux subventions, dons et de partenariats et pouvoir disposer d'un compte bancaire au nom de votre organisation."
  },
  {
    id: 4,
    icon: <Users size={24} color="#E05017" />,
    name: "Solidité institutionnelle",
    content: "améliorer la gouvernance et mobiliser plus de ressources."
  },
  {
    id: 5,
    icon: <Globe size={24} color="#E05017" />,
    name: "Visibilité et influence",
    content: "accroître votre impact et participer aux prises de décisions publiques."
  },
  {
    id: 6,
    icon: <FileText size={24} color="#E05017" />,
    name: "Protection juridique",
    content: "sécuriser vos membres et vos activités contre les litiges."
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
          <h2 className="font-bold text-4xl text-[#2a591d] leading-tight">Simplifiez la formalisation de votre organisation</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            La reconnaissance légale est une étape essentielle pour toute organisation de la société civile (OSC). Le CRASC vous accompagne pas à pas pour rendre ce processus plus simple et efficace, afin de soutenir votre développement.
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
        <p className="font-bold text-4xl text-center pb-[50px]">Pourquoi formaliser son OSC</p>
        <div className="max-w-5xl mx-auto">
          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formal.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover-shadow-lg transition-shadow bg-white py-4 px-5"
              >
                {item.icon}
                {/* Name and Role */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm font-medium text-gray-600 py-1 inline-block">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="py-8">
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
                  <p></p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div> */}

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl py-4 my-4 shadow-md">
          <p className="font-bold text-4xl">
            Étapes de création et déclaration
          </p>
          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">1. Formation libre</p>
          <ul className="list-disc list-inside ml-12">
            <li>Les OSC (associations, ONG, organistation cultuelles) peuvent se constituer librement, mais elles n'acquièrent la capacité juridique qu'après déclaration préalable (art. 6).</li>
          </ul>
      
          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">2. Dépôt de la déclaration</p>
          <ul className="list-disc list-inside ml-12">
            <li>À la préfecture, sous-préfecture ou direction compétente du ministère de l'Administration du Territoire (art. 7).</li>
            <li>La déclaration doit préciser : nature, titre, objet, siège, établissements éventuels, noms et domiciles des responsables.</li>
          </ul>
        
          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">3. Pièces obligatoires (art. 10)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Preuve du paiement du droit de dépôt.</li>
            <li>Statuts et règlement intérieur (3 exemplaires).</li>
            <li>Procès-verbal de l'assemblée constitutive.</li>
            <li>Liste des membres fondateurs et dirigeants.</li>
            <li>Liste de présence légalisée.</li>
            <li>Commissaires aux comptes.</li>
            <li>Pour les représentations locales d'OSC étrangères : documents de l'organisation-mère (mandat, publication officielle, etc.).</li>
          </ul>          
        
          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">4. Contenu des statuts (art. 11)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Titre, objet, durée, siège.</li>
            <li>Conditions d'adhésion et de perte de qualité de membre.</li>
            <li>Origine des ressources financières.</li>
            <li>Organisation et fonctionnement (pouvoirs, quorum, contrôle, dissolution).</li>
            <li>Engagement de conformité à l'ordonnance.</li>
          </ul>
        
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl py-4 my-4 shadow-md">
          <p className="font-bold text-4xl">
            Contrôles et enquêtes
          </p>
          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">5. Enquête de moralité (art. 12)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Vérification de l'authenticité des pièces, probité et honorabilité des dirigeants.</li>
            <li>Réalisée par la gendarmerie ou la police, résultats transmis sous un mois.</li>
          </ul>

          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">6. Conditions d'éligibilité des dirigeants (art. 13)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Pas de condamnations pénales entraînant perte des droits civiques, sauf exceptions mineures.</li>
          </ul>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl py-4 my-4 shadow-md">
          <p className="font-bold text-4xl">
            Obtention du récépissé
          </p>

          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">7. Récépissé de déclaration (art. 14-15)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Délivré sous 23 jours si l'enquête est favorable.</li>
            <li>Publication obligatoire au Journal officiel.</li>
            <li>Transmission du dossier complet au ministère de l'Administration du Territoire.</li>
          </ul>

          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">8. Capacité juridique</p>
          <ul className="list-disc list-inside ml-12">
            <li>Une fois déclarée et publiée, l'OSC peut ester en justice, recevoir des dons, posséder des biens nécessaires à son objet, ouvrir un compte bancaire, etc. (art. 16).</li>
          </ul>         
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl py-4 my-4 shadow-md">
          <p className="font-bold text-4xl">
            Obligation post-déclaration
          </p>
        
          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">9. Mise à jour (art. 17-18)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Déclarer tout changement (dirigeants, siège, statuts, logo, etc.) dans le mois.</li>
            <li>Publication au Journal officiel.</li>
            <li>Tenue de registres cotés et paraphés.</li>
          </ul>

          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">10. Respect des lois sociales et fiscales (art. 19, 33)</p>
          <ul className="list-disc list-inside ml-12">
            <li>Déclarations fiscales obligatoires.</li>
            <li>Tenue d'un compte bancaire.</li>
          </ul>

          <p className="font-bold text-lg text-[#2a591d] pt-4 pb-2">11. Organisation interne (art. 25-31)</p>
          <ul className="list-disc list-inside ml-12">
            <li>OSC dotée d'un organe délibérant, exécutif et de contrôle.</li>
            <li>Principes de transparence et de démocratie.</li>
            <li>Manuel de procédures administratives, financières et comptables.</li>
          </ul>
        </div>

        <p className="max-w-4xl mx-auto">
          Il faut retenir que la formalisation d'une OSC en Côte d'Ivoire suit un processus structuré : <b>constitution libre - déclaration préalable avec pièces justificatives - enquête de moralité - récépissé et publication au Journal officiel - capacité juridique et obligations de fonctionnement</b>.
        </p>
        
      </div>      

      {/* Prêt à se faire accompagner */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg py-8 space-y-6 text-center text-white shadow-md border border-gray-200">
          <p className="font-bold text-4xl text-black">Prêt à se faire accompagner ?</p>
          <p className="max-w-2xl mx-auto text-gray-800">
            Nous sommes votre partenaire pour réussir votre processus de formalisation. Nous contacter pour bénéficier d'un accompagnement personnalisé et propulser votre organisation vers de nouveaux sommets.
          </p>
          <Link href="/contact" className="border border-transparent hover:border-[#E05017] text-white hover:text-[#E05017] hover:bg-transparent bg-[#E05017] rounded-lg py-2 px-5">
            Nous contacter
          </Link>
        </div>
      </div>

    </section>
  )
}
