"use client";

import { useEffect, useState } from 'react';
import { ImageWithFallback } from '@/lib/imageWithFallback'
import {
  Users,
  FileText,
  GraduationCap,
  PenLine,
  CalendarCheck,
  Speech,
  Info,
  ChevronDown,
  Search
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


interface IService {
  id: number;
  icon: React.ReactNode;
  name: string;
  //content: string;
}

const services: IService[] = [
  {
    id: 1,
    icon: <Speech size={24} color="#E05017" />,
    name: "Conseil",
    //content: "Des conseils stratégiques pour des décisions éclairées et une croissance durable."
  },
  {
    id: 2,
    icon: <Users size={24} color="#E05017" />,
    name: "Accompagnement",
    //content: "Un soutien personnalisé à chaque étape de la mise en œuvre de vos projets."
  },
  {
    id: 3,
    icon: <FileText size={24} color="#E05017" />,
    name: "Soutien Administratif",
    //content: "Formalisation et mise en conformité pour une structure solide et transparente."
  },
  {
    id: 4,
    icon: <PenLine size={24} color="#E05017" />,
    name: "Rédaction",
    //content: "Rédaction de documents professionnels : statuts, règlements, projets, manuels."
  },
  {
    id: 5,
    icon: <GraduationCap size={24} color="#E05017" />,
    name: "Formation",
    //content: "un processus d'apprentissage structuré qui permet à un individu ou à un groupe d'acquérir des connaissances."
  },
  {
    id: 6,
    icon: <CalendarCheck size={24} color="#E05017" />,
    name: "Suivi-évaluation",
    //content: "Mise en place d’outils et d’indicateurs de performance pour mesurer l’avancement et l’impact des actions menées."
  },
  {
    id: 7,
    icon: <Info size={24} color="#E05017" />,
    name: "Information",
    //content: "Nous vous donnons des informations sur les opportunités de financements, de formation et de réseautage."
  },
];

interface IFaqItem {
  id: number;
  question: string;
  answer: string;
}

const fallbackFaqItems: IFaqItem[] = [
  { id: 1, question: "Comment puis-je postuler à une offre d'emploi ?", answer: "Pour postuler à une offre d'emploi, veuillez consulter les offres disponibles sur notre site et cliquez sur le bouton Postuler." },
  { id: 2, question: "Quel est le processus de recrutement chez PASCI ?", answer: "Le processus de recrutement chez PASCI comprend plusieurs étapes : l'analyse de votre profil, un entretien technique, un entretien RH et enfin une proposition d'embauche." },
  { id: 3, question: "Puis-je envoyer une candidature spontanée ?", answer: "Oui, vous pouvez envoyer une candidature spontanée à travers notre formulaire en ligne ou par email à pdoc@plateforme-osci.org." },
  { id: 4, question: "Proposez-vous des stages ou des alternances ?", answer: "Oui, PASCI propose des stages et des alternances dans divers domaines techniques et administratifs. Consultez nos offres spécifiques pour plus d'informations." },
  { id: 5, question: "Comment savoir si ma candidature a été reçue ?", answer: "Vous recevrez un email de confirmation dès que votre candidature aura été reçue. Si vous ne recevez pas cet email dans les 24 heures suivantes, veuillez nous contacter." },
  { id: 6, question: "Quelles sont les valeurs du projet PASCI ?", answer: "Les valeurs du projet PASCI incluent l'innovation technologique, la collaboration interdisciplinaire et le respect de l'environnement." },
];

export default function ServicesPage() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqItems, setFaqItems] = useState<IFaqItem[]>(fallbackFaqItems);

  useEffect(() => {
    async function loadFaq() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/faq/`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) {
          setFaqItems(data);
        }
      } catch {
        // On garde la FAQ statique tant que l'API n'est pas disponible.
      }
    }
    loadFaq();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenFaqs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredFaq = faqItems.filter(f =>
    f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-4xl text-[#2a591d] leading-tight">
            DES SERVICES STRATÉGIQUES POUR LE SUCCÈS DE VOTRE PROJET
          </h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Un accompagnement sur mesure, du conseil à la rédaction de documents complexes. <br />
            Au CRASC, nous garantissons la conformité et l&apos;efficacité de vos initiatives.

          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/page-service/aa9d2f8c-6d73-497b-ba42-99c54f91cc24.jpg"
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
                {service.icon}
                {/* Name and Role */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  {/* <p className="text-sm font-medium text-gray-600 py-1 inline-block">{service.content}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Conseil */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Conseil</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] p-6 sm:px-6 lg:px-8 border border-gray-200 rounded-lg space-y-6">
          <p>
            Nous venons vous expliquer comment déposer vos demandes de financement et quelles sont les conditions pour être accepté. On insiste aussi sur les erreurs à éviter pour mettre toutes les chances de votre côté.
          </p>
        </div>
      </div>

      {/* Accompagnement */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Accompagnement</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>
            Au CRASC, on ne se limite pas aux conseils. On reste à vos côtés pour mettre en pratique vos idées. Cela peut être du coaching, des formations pour vos équipes, du mentorat pour vos responsables, ou même la prise en charge de certaines tâches importantes. Le but : vous aider à devenir autonomes.
          </p>
        </div>
      </div>
      
      {/* Soutien Administratif */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Soutien Administratif</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] p-6 sm:px-6 lg:px-8 border border-gray-200 rounded-lg space-y-6">
          <p>
            On vous aide à rédiger vos statuts, vos règlements et à respecter les règles légales. L&apos;objectif est que votre organisation fonctionne correctement et en toute sécurité.
          </p>
        </div>
      </div>

      {/* Formation */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Formation</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>
            Nos formations ne servent pas seulement à apprendre des notions. Elles développent aussi l'esprit critique, l'autonomie et la capacité à appliquer ce qu'on a appris dans la vraie vie. On encourage aussi le partage d&pos;expériences entre participants.
          </p>
        </div>
      </div>
      
      {/* Suivi-évaluation */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Suivi-Évaluation</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] p-6 sm:px-6 lg:px-8 border border-gray-200 rounded-lg space-y-6">
          <p>
            Ce n&apos;est pas juste mesurer des résultats. C&apos;est un outil pour prendre de bonnes décisions, ajuster vos actions en cours de route et améliorer l&apos;impact de vos projets. Cela garantit aussi plus de transparence et de responsabilité.
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Information</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>
            Nous partageons avec vous les opportunités de financement, de formation et de réseautage. En diffusant ces infos, nous vous aidons à saisir les bonnes occasions et à renforcer vos actions sur le terrain.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-8">
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-gray-900 font-bold text-3xl">Foire Aux Questions</h2>
        </div>
        <div className="relative max-w-3xl mx-auto mb-10 px-4">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a591d]/30 focus:border-transparent"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 mb-10">
          {filteredFaq.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucune question trouvée.</p>
          ) : (
            filteredFaq.map((item) => (
              <div key={item.id} className="border-b border-gray-300 mb-4">
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex items-center justify-between pb-4 text-left cursor-pointer"
                >
                  <span className="text-gray-800 font-medium">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${openFaqs.includes(item.id) ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaqs.includes(item.id) && (
                  <div className="px-4 pb-4 text-gray-600 text-sm">
                    {item.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </section>
  )
}
