import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/lib/imageWithFallback"

interface NewsArticle {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function SectionNews() {
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      date: '23 septembre 2025',
      title: 'Laborum nisi',
      description: 'Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua sit minim',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc2MzIyMjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '#',
    },
    {
      id: 2,
      date: '3 septembre 2025',
      title: "Point sur l'avancement des travaux",
      description: 'Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua sit minim',
      image: 'https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYzMTA2NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '#',
    },
    {
      id: 3,
      date: '4 juillet 2025',
      title: "Plan d'action",
      description: 'Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua sit minim',
      image: 'https://images.unsplash.com/photo-1623177578701-2727010a3f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjB3b3JraW5nJTIwb2ZmaWNlfGVufDF8fHx8MTc2MzIyMjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '#',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-gray-900">Actualités</h2>
          <Button 
            variant="outline" 
            className="border border-[#ff8c42] text-[#ff8c42] hover:bg-[#ff8c42] hover:text-white rounded-full px-6"
          >
            Voir plus
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <div 
              key={article.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                <h3 className="text-gray-900 mb-3">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.description}
                </p>
                <a 
                  href={article.link}
                  className="text-gray-700 text-sm hover:text-[#ff8c42] transition-colors inline-flex items-center group"
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
