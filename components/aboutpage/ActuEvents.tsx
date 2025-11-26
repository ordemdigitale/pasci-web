"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"

interface Article {
  id: number;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  date: string;
  description: string;
}

interface NewsItem {
  id: number;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  date: string;
  likes: number;
  comments: number;
}

const articles: Article[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwZmllbGR8ZW58MXx8fHwxNzY0MDg2MjYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Projets',
    categoryColor: 'bg-green-600',
    title: 'Lancement du Projet Alpha : Innover pour l\'avenir',
    date: '15 avril 2024',
    description: 'RASCO annonce le démarrage officiel du Projet Alpha, une initiative ambitieuse visant à développer des solutions d\'énergie'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1627215750463-3386c8ed92ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGhvbGRpbmclMjBnbG9iZXxlbnwxfHx8fDE3NjQxNjIxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Partenariats',
    categoryColor: 'bg-blue-600',
    title: 'Nouveau Partenariat avec EcoSolutions pour une',
    date: '10 avril 2024',
    description: 'RASCO et EcoSolutions unissent leurs forces pour un avenir plus durable. Ce partenariat stratégique marque'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596513057932-4ac7206d3152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwcGlnZ3klMjBiYW5rfGVufDF8fHx8MTc2NDE2MjE5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Financement',
    categoryColor: 'bg-orange-500',
    title: 'Financement record pour nos initiatives de développement',
    date: '5 avril 2024',
    description: 'RASCO a obtenu un financement substantiel qui accélérera nos programmes de recherche et de mise en œuvre dans le domaine de la'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1573165231977-3f0e27806045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NjQxNTYwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Conférences',
    categoryColor: 'bg-gray-700',
    title: 'Conférence Annuelle 2024',
    date: '1 avril 2024',
    description: 'Notre conférence annuelle rassemble les leaders de l\'industrie'
  }
];

const newsItems: NewsItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1640125346217-e4bb9313d6bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmb3Jlc3R8ZW58MXx8fHwxNzY0MTYyMTk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Projets',
    categoryColor: 'bg-green-600',
    title: 'Innovations technologiques : Les drones au service de',
    date: '20 avril 2024',
    likes: 75,
    comments: 15
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWZ8ZW58MXx8fHwxNzY0MTQ3ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Partenariats',
    categoryColor: 'bg-blue-600',
    title: 'Collaboration internationale pour la protection des océans',
    date: '18 avril 2024',
    likes: 60,
    comments: 10
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1595500383097-2ac105c5f705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZ2xhc3N8ZW58MXx8fHwxNzY0MTYyMTk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Financement',
    categoryColor: 'bg-orange-500',
    title: 'Nouveaux investissements pour la recherche en biotechnologie',
    date: '17 avril 2024',
    likes: 88,
    comments: 18
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1707944745860-4615eb585a41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwcmVzZWFyY2h8ZW58MXx8fHwxNzY0MTYwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Événements',
    categoryColor: 'bg-purple-600',
    title: 'Webinaire "L\'avenir de l\'agriculture durable"',
    date: '15 avril 2024',
    likes: 50,
    comments: 8
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1667757526327-dbe1edd781d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBhcmslMjB0cmVlc3xlbnwxfHx8fDE3NjQwNzMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Projets',
    categoryColor: 'bg-green-600',
    title: 'Projet "Villes Vertes" : Des parcs urbains pour tous',
    date: '12 mars 2024',
    likes: 92,
    comments: 20
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1513886693575-1c091ac6b586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2lnbmluZ3xlbnwxfHx8fDE3NjQxNjIxOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Partenariats',
    categoryColor: 'bg-blue-600',
    title: 'Signature d\'un protocole d\'accord avec l\'Université',
    date: '8 mars 2024',
    likes: 110,
    comments: 25
  }
];

export default function ActualitiesEvents() {
  const [activeTab, setActiveTab] = useState('Tous');

  const tabs = ['Tous', 'Annonces', 'Événements', 'Articles'];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-center text-[#2a591d] font-bold text-3xl mb-8">Actualités et Événements</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-12 bg-gray-200 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-lg transition-all ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-[#E05107] hover:text-orange-600'
              }`}
              style={activeTab === tab ? { backgroundColor: '#E05107' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Articles Section */}
        <div className="mb-16">
          <h3 className="text-gray-800 text-xl font-bold mb-6">Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 ${article.categoryColor} text-white text-xs px-3 py-1 rounded`}>
                    {article.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-gray-800 mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-gray-500 text-sm mb-3">{article.date}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
                  <button className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
                    Lire la suite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News Section */}
        <div>
          <h3 className="text-gray-800 text-xl font-bold mb-6">Dernières Actualités</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 ${item.categoryColor} text-white text-xs px-3 py-1 rounded`}>
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-gray-800 mb-2 line-clamp-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm mb-4">{item.date}</p>
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{item.comments}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}