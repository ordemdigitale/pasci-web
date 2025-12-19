import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/lib/imageWithFallback"

interface NewsArticle {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  link: string;
  crasc: string;
}

export default function SectionNews() {
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      date: '23 septembre 2025',
      title: 'Tournées d\'information',
      description: "Processus de soumission et les conditions d'éligibilité aux microfinancements et aux subventions",
      image: '/images/actualites/eda7c908-6e5a-4137-9b1e-ae6754146371.jpg',
      link: '#',
      crasc: "CRASC NORD"
    },
    {
      id: 2,
      date: '3 septembre 2025',
      title: "Activités de supervision conjointe OCD",
      description: "Dans le cadre des activités de supervision conjointe OCD pour l'appui aux CRASC",
      image: '/images/actualites/359a7b7d-c126-4fdf-934d-9038c01df7e0.jpg',
      link: '#',
      crasc: "CRASC OUEST"
    },
    {
      id: 3,
      date: '4 juillet 2025',
      title: "Rapport préliminaire sur l'observation du scrutin présidentiel",
      description: "rapport préliminaire dans le cadre du projet d'observation citoyenne des élections",
      image: '/images/actualites/433ece92-1b86-441e-b78a-8382fcf60a00.jpg',
      link: '#',
      crasc: "CRASC CENTRE"
    },
    {
      id: 4,
      date: '23 septembre 2025',
      title: "Atelier des membres du CRASC-Est",
      description: "L'élaboration de stratégies cohérentes s'inscrit dans une logique de professionnalisation de l'action des OSC",
      image: '/images/actualites/99aff270-1397-4fe0-97df-b9c49415ceb1.jpg',
      link: '#',
      crasc: "CRASC EST"
    },
    {
      id: 5,
      date: '3 septembre 2025',
      title: "Formation des OSC",
      description: "Ce fut une rencontre riche en partage, orientation et proposition",
      image: '/images/actualites/13bf15a5-0f87-415a-a05d-e3775879560d.jpg',
      link: '#',
      crasc: "CRASC SUD"
    },
    {
      id: 6,
      date: '4 juillet 2025',
      title: "Séance de simulation des formateurs ce jour",
      description: "Lors de la formation des pools formateurs",
      image: '/images/actualites/4a89463f-f2e9-466f-93bd-03a25b381999.jpg',
      link: '#',
      crasc: "RI-CRASC"
    },
  ];

  return (
    <section className="py-10 bg-white font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-gray-900 font-bold text-3xl">Actualités</h2>
          {/* <Button 
            variant="outline" 
            className="border border-[#E05017] text-[#E05017] hover:bg-[#E05017] hover:text-white rounded-lg px-6"
          >
            Voir plus
          </Button> */}
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <div 
              key={article.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-gray-800 mb-2">{article.crasc}</p>
                <h3 className="text-gray-900 mb-3 font-bold">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {article.description}
                </p>
                <a 
                  href={article.link}
                  className="absolute bottom-0 left-0 right-0 p-4 text-[#2a591d] underline text-sm transition-colors inline-flex items-center group"
                >
                  Lire l'article
                  <svg 
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
