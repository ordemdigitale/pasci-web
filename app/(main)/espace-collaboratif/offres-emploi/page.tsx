"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import {
  Search,
  ChevronDown,
  Briefcase,
  MapPin
} from "lucide-react";
import { IJobs } from '@/types/api.types';
import Link from "next/link";

interface IJobItem {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
}

// Mock data de fallback
const mockJobs: IJobs[] = [
  {
    id: "1",
    title: 'Chargé de Mission Innovation',
    description: 'Rejoignez notre équipe dynamique pour piloter des initiatives stratégiques au sein de l\'espace collaboratif PASCI. Vous serez au cœur de l\'innovation sociale et environnementale en Afrique de l\'Ouest.',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'CDI',
    slug: 'charge-mission-innovation',
    employer: 'PASCI Côte d\'Ivoire',
    publication_date: new Date().toISOString()
  },
  {
    id: "2",
    title: 'Responsable Communication Digitale',
    description: 'Nous recherchons un(e) Responsable Communication Digitale passionné(e) pour développer et animer notre présence en ligne. Vous serez en charge de la stratégie digitale et de l\'engagement de nos communautés.',
    location: 'Dakar, Sénégal',
    type: 'CDD',
    slug: 'responsable-communication-digitale',
    employer: 'PASCI Sénégal',
    publication_date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    title: 'Chef de Projet Développement Durable',
    description: 'Pilotez des projets d\'envergure dans le domaine du développement durable et de la responsabilité sociétale. Vous coordonnerez des initiatives multi-partenaires et contribuerez à l\'impact positif de PASCI.',
    location: 'Ouagadougou, Burkina Faso',
    type: 'CDI',
    slug: 'chef-projet-developpement-durable',
    employer: 'PASCI Burkina Faso',
    publication_date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "4",
    title: 'Analyste de Données Impact',
    description: 'Transformez les données en insights stratégiques pour mesurer et optimiser l\'impact de nos programmes. Vous développerez des outils d\'analyse et de reporting pour nos partenaires.',
    location: 'Dakar, Sénégal',
    type: 'CDI',
    slug: 'analyste-donnees-impact',
    employer: 'PASCI Sénégal',
    publication_date: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "5",
    title: 'Coordonnateur RSE Senior',
    description: 'Accompagnez les entreprises dans leur démarche RSE et favorisez les partenariats stratégiques. Vous serez l\'interface entre le secteur privé et les organisations de la société civile.',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'CDI',
    slug: 'coordonnateur-rse-senior',
    employer: 'PASCI Côte d\'Ivoire',
    publication_date: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: "6",
    title: 'Assistant(e) de Direction',
    description: 'Apportez votre soutien à l\'équipe de direction dans la gestion quotidienne et la coordination des activités de PASCI. Un rôle polyvalent au cœur de notre organisation.',
    location: 'Lomé, Togo',
    type: 'CDD',
    slug: 'assistant-direction',
    employer: 'PASCI Togo',
    publication_date: new Date(Date.now() - 432000000).toISOString()
  },
];

const faqCategories = [
  { id: 1, title: 'Comment puis-je postuler à une offre d\'emploi ?', answer: "Pour postuler à une offre d'emploi, veuillez consulter les offres disponibles sur notre site et cliquez sur le bouton Postuler", isOpen: false },
  { id: 2, title: 'Quel est le processus de recrutement chez PASCI ?', answer: "Le processus de recrutement chez PASCI comprend plusieurs étapes : l\'analyse de votre profil, un entretien technique, un entretien RH et enfin une proposition d\'embauche.", isOpen: false },
  { id: 3, title: 'Puis-je envoyer une candidature spontanée ?', answer: "Oui, vous pouvez envoyer une candidature spontanée à travers notre formulaire en ligne ou par email à contact@pasci.fr.", isOpen: false },
  { id: 4, title: 'Proposez-vous des stages ou des alternances ?', answer: "Oui, PASCI propose des stages et des alternances dans divers domaines techniques et administratifs. Consultez nos offres spécifiques pour plus d'informations.", isOpen: false },
  { id: 5, title: 'Comment savoir si ma candidature a été reçue ?', answer: "Vous recevrez un email de confirmation dès que votre candidature aura été reçue. Si vous ne recevez pas cet email dans les 24 heures suivantes, veuillez nous contacter.", isOpen: false },
  { id: 6, title: 'Quelles sont les valeurs du projet PASCI ?', answer: "Les valeurs du projet PASCI incluent l'innovation technologique, la collaboration interdisciplinaire et le respect de l'environnement.", isOpen: false }
];

export default function PageOffreEmploi() {
  const router = useRouter();
  const [jobs, setJobs] = useState<IJobs[]>(mockJobs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Timeout de 3 secondes pour l'appel API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:8000/api/v1/jobs', {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result && result.length > 0) {
          setJobs(result);
          setError(null);
        }
      } catch (error: any) {
        console.log("Erreur lors du chargement des offres:", error);
        if (error.name === 'AbortError') {
          setError("Le serveur met trop de temps à répondre. Affichage des données de démonstration.");
        } else {
          setError("Impossible de charger les offres depuis le serveur. Affichage des données de démonstration.");
        }
        // On garde les données mock en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Categories data */
  const categories = [
    "Gestion de projet",
    "Administration",
    "Développement",
    "Marketing",
    "Desing",
    "Ressources Humaines"
  ];

  const toggleFaq = (id: number) => {
    setOpenFaqs(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 p-8 mb-10 grid lg:grid-cols-2 gap-6">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Rejoignez l'équipe</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Découvrez les opportunités de carrière passionnantes et faites partie de notre mission de transformer l'avenir. Chez PASCI, nous construisons des solutions innovantes avec des talents exceptionnels.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/offre-emploi-page/4c9598b7-96fa-4ba1-bae8-5be6202c4bd6.jpg"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mb-2">
        <h2 className="text-gray-900 font-bold text-3xl">Nos Offres d'Emploi</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search bar + filters area*/}
      <div className="p-6 mb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-6 md:grid-cols-6 gap-4 items-end">
            {/* search bar */}
            <div className="relative col-span-3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un emploi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              />
            </div>

            {/* filters */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">
                  Catégorie
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Type de contrat</option>
                <option value="type1">Tous</option>
                <option value="type2">CDI</option>
                <option value="type3">CDD</option>
                <option value="type4">Stage</option>
              </select>
            </div>

            <div>
              <select
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section offres d'emploi */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {jobs?.map((job) => (
              <div key={job.id} className="p-6 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="">
                  <h4 className="font-bold text-lg mb-2">{job.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{job.description.substring(0, 200)}...</p>
                  <div className="flex flex-row items-center gap-2 text-gray-700 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className='text-sm'>{job.location}</span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2 text-gray-700 text-sm mb-8">
                    <Briefcase className="w-4 h-4" />
                    <span className='inline-block px-3 py-1 rounded-full text-xs text-white bg-[#E05017]'>{job.type}</span>
                  </div>
                </div>
                <Link href={`/espace-collaboratif/offres-emploi/${job.slug}`}>
                  <button className="px-4 py-2 border border-transparent hover:border hover:border-[#E05017] rounded-3xl bg-[#E05017] hover:bg-transparent text-white hover:text-[#E05017] transition-all">
                    Détails de l'offre
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section FAQ */}
        <div>
          <div className="flex justify-center items-center mb-8">
            <h2 className="text-gray-900 font-bold text-3xl mb-2">Foire Aux Questions</h2>
          </div>
          {/* search bar */}
          <div className="relative max-w-3xl mx-auto mb-10">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
            />
          </div>

          <div className="max-w-4xl mx-auto mb-26">
            {/* FAQ content */}
            {faqCategories.map((category) => (
              <div key={category.id} className="border-b border-b-gray-300 mb-4">
                <button
                  onClick={() => toggleFaq(category.id)}
                  className="w-full flex items-center justify-between pb-4 text-left cursor-pointer"
                >
                  <span className="text-gray-800">{category.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      openFaqs.includes(category.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqs.includes(category.id) && (
                  <div className="p-4 pt-0 text-gray-600 text-sm">
                    {category.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
