"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'


interface Service {
  id: number;
  icon: string;
  name: string;
  content: string;
}

const services: Service[] = [
  {
    id: 1,
    icon: "/icons/icon-appui-conseil.png",
    name: "Appui-Conseil",
    content: "Des conseils stratégiques pour des décisions éclairées et une croissance durable."
  },
  {
    id: 2,
    icon: "/icons/icon-accompagnement.png",
    name: "Accompagnement",
    content: "Un soutien personnalisé à chaque étape de la mise en œuvre de vos projets."
  },
  {
    id: 3,
    icon: "/icons/icon-soutien-administratif.png",
    name: "Soutien Administratif",
    content: "Formalisation et mise en conformité pour une structure solide et transparente."
  },
  {
    id: 4,
    icon: "/icons/icon-redaction.png",
    name: "Rédaction",
    content: "Rédaction de documents professionnels : statuts, règlements, projets, manuels."
  },
  {
    id: 5,
    icon: "/icons/icon-formation.png",
    name: "Formation",
    content: "un processus d'apprentissage structuré qui permet à un individu ou à un groupe d'acquérir des connaissances."
  },
];

const redactionSpecialiseeDeDocuments = [
  { id: 1, title: 'Statut et Règlement Intérieur', isOpen: false },
  { id: 2, title: 'Projets (Propositions et Rapports)', isOpen: false },
  { id: 3, title: 'Manuel de Procédures', isOpen: false },
  { id: 4, title: 'Plan d\'Action', isOpen: false }
];

export default function ServicesPage() {
  const [openRedactionSpecialiseeDeDocuments, setOpenRedactionSpecialiseeDeDocuments] = useState<number[]>([]);

  const toggleRedactionSpecialiseeDeDocuments = (id: number) => {
    setOpenRedactionSpecialiseeDeDocuments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Des Services Stratégiques pour le Succès de Votre Projet</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Au CRASC, nous vous offrons un accompagnement sur mesure, de l'appui-conseil à la rédaction de documents complexes, pour garantir la conformité et l'efficacité de vos initiatives.
          </p>
          <Button className="mt-12 border border-[#E05017] bg-[#E05017] text-white hover:text-[#E05017] hover:bg-white rounded-lg px-6">
            Découvrir Nos Services
          </Button>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/service-page-thumb.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Nos Services</p>
        <div className="max-w-5xl mx-auto">
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover-shadow-lg transition-shadow bg-white py-4 px-5"
              >
                {/* Image */}
                <div className="">
                  <ImageWithFallback
                    src={service.icon}
                    alt={service.name}
                    className="w-15 h-15"
                  />
                </div>
                {/* Name and Role */}
                <div className="pl-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm font-medium text-gray-600 py-1 inline-block">{service.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Service Appui-Conseil Stratégique */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Appui-Conseil Stratégique</p>
        <p className="text-center pb-6 max-w-xl mx-auto">Nos experts vous guident à chaque étape pour des décisions éclairées et des solutions adaptées à vos enjeux spécifiques.</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>L'appui-conseil de PASCI vous fournit une expertise pointue et des recommandations personnalisées pour optimiser votre performance et atteindre vos objectifs. Nous analysons vos besoins, identifions les leviers de croissance et élaborons des stratégies sur mesure, qu'il s'agisse de gestion de projet, d'organisation interne, de développement institutionnel ou de planification stratégique. Notre approche est collaborative, garantissant une appropriation complète des solutions proposées par vos équipes.</p>
          <p>Nous intervenons pour les audits organisationnels, les études de faisabilité, l'évaluation de projets et la mise en place de systèmes de suivi-évaluation. Avec PASCI, bénéficiez d'un partenaire qui s'engage à vos côtés pour transformer la vision en réalité, en vous dotant des outils et des connaissances nécessaires pour naviguer dans un environnement complexe.</p>
        </div>
      </div>

      {/* Service Accompagnement Personnalisé */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Accompagnement Personnalisé</p>
        <p className="text-center pb-6 max-w-xl mx-auto">Un soutien continu pour la mise en œuvre de vos projets et l'atteinte de vos objectifs avec confiance.</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>L'accompagnement de PASCI va au-delà du simple conseil. Nous marchons à vos côtés pour la mise en œuvre concrète de vos plans d'action. Cet accompagnement peut prendre la forme de coaching d'équipes, de renforcement des capacités, de mentorat pour les leaders ou de gestion déléguée de certaines fonctions clés. Notre objectif est de transférer des compétences et de garantir l'autonomie de vos structures à long terme.</p>
          <p>Nous nous impliquons activement dans la coordination, le suivi des activités et l'ajustement des stratégies en fonction des réalités du terrain. Que vous soyez une organisation naissante ou établie, notre engagement est de vous fournir un cadre propice à l'apprentissage et à l'amélioration continue, en assurant que chaque action contribue efficacement à l'atteinte de vos aspirations.</p>
        </div>
      </div>

      {/* Service Soutien Administratif et Conformité */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Soutien Administratif et Conformité</p>
        <p className="text-center pb-6 max-w-xl mx-auto">Assurez la solidité et la transparence de votre structure grâce à notre expertise en gestion administrative.</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p className="font-bold pb-10">Formalisation et mise en conformité</p>
          <p>Nous vous assistons dans la formalisation de vos statuts, la rédaction de vos règlements intérieurs et la mise en conformité avec les exigences légales et réglementaires. Notre objectif est de structurer votre organisation pour qu'elle opère en toute légalité et efficacité, en minimisant les risques.</p>
        </div>
      </div>

      {/* Service Rédaction Spécialisée et Documentaire */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Rédaction Spécialisée et Documentaire</p>
        <p className="text-center pb-6 max-w-xl mx-auto">Des documents clairs, précis et professionnels pour consolider votre fondation et vos projets.</p>
        <div className="max-w-5xl mx-auto py-8 space-y-6">
          {redactionSpecialiseeDeDocuments.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleRedactionSpecialiseeDeDocuments(item.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800 font-bold">{item.title}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openRedactionSpecialiseeDeDocuments.includes(item.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openRedactionSpecialiseeDeDocuments.includes(item.id) && (
                <div className="p-4 border-t border-gray-200">
                  <p>Contenu de la section {item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prêt à démarer votre projet */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#E05017] rounded-lg py-8 space-y-6 text-center text-white">
          <p className="font-bold text-4xl">Prêt à Démarer Votre Projet</p>
          <p className="max-w-2xl mx-auto">Contactez PASCI dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider à atteindre vos objectifs.</p>
          <Button className="border border-transparent hover:border-white text-[#E05017] hover:text-white bg-white hover:bg-transparent rounded-lg px-6">
            Prendre Contact
          </Button>
        </div>
      </div>

    </section>
  )
}
