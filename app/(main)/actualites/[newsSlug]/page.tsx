"use client";

import { use, useState, useEffect } from "react";
import { newsService } from "@/lib/services/news.service";
//import { INews } from '@/types/api.types';
import { INews } from "@/lib/services/news.service";
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import NewsCard from '@/components/ui/NewsCard';
import {
  ChevronRight,
  User,
  Bookmark,
  Share2,
  MessageCircle,
  Link as LinkIcon,
  Mail,
  Loader2,
  Calendar
} from 'lucide-react';

export default function PageActu({ params }: { params: Promise<{ newsSlug: string }>; }) {
  const resolvedParams = use(params);
  const newsSlug = resolvedParams.newsSlug;
  const [news, setNews] = useState<INews | null>(null);
  const [relatedNews, setRelatedNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!newsSlug) return;
    let isCurrent = true;

    async function fetchNews() {
      try {
        setLoading(true);
        const data = await newsService.getBySlug(newsSlug);

        if (isCurrent) {
          setNews(data);

          // Charger les actualités similaires (même CRASC)
          if (data.crasc_id) {
            const related = await newsService.getByCrasc(data.crasc_id, 4);
            // Exclure l'actualité actuelle
            setRelatedNews(related.filter(n => n.id !== data.id).slice(0, 3));
          }
        }
      } catch (err: any) {
        if (isCurrent) setError(err.message || "Impossible de charger l'actualité.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchNews();

    return () => {
      isCurrent = false;
    };
  }, [newsSlug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = news?.title || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier!');
        break;
    }
  };

  const handleSubscribe = () => {
    if (email) {
      console.log('Abonnement:', email);
      alert('Merci pour votre abonnement!');
      setEmail('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#E05017] mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'actualité...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Erreur</p>
          <p>{error || "Actualité non trouvée"}</p>
          <Link href="/actualites" className="text-[#E05017] underline mt-4 inline-block">
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="h-1 w-full bg-gray-100">
          <div className="h-full bg-[#E05017]" style={{ width: '45%' }} />
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-[#E05017] transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/actualites" className="hover:text-[#E05017] transition-colors">
            Actualités
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#E05017] truncate max-w-[200px] md:max-w-none">
            {news.title.substring(0, 50)}...
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Content */}
          <article className="lg:col-span-8 bg-white rounded-xl p-0 md:p-8 shadow-sm">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded bg-[#E05017]/10 text-[#E05017] text-xs font-bold uppercase tracking-widest mb-4">
                {news.crasc?.name || "Actualité"}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                {news.title}
              </h1>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#E05017]/20 flex items-center justify-center text-[#E05017]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Rédaction PASCI</p>
                    <p className="text-xs text-gray-500">Équipe éditoriale</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-gray-100 hidden md:block" />

                <div className="flex flex-col">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Publié le</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {news.created_at ? new Date(news.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : 'Date non disponible'}
                  </p>
                </div>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => handleShare('copy')}
                    className="size-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-[#E05017]/10 hover:text-[#E05017] transition-all"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="size-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-[#E05017]/10 hover:text-[#E05017] transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {news.thumbnail_url && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 shadow-lg">
                <ImageWithFallback
                  src={news.thumbnail_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">
                  Photo : PASCI Media
                </div>
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <div
                className="[&>p]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-12 [&>h3]:mb-4 [&>blockquote]:my-12 [&>blockquote]:py-8 [&>blockquote]:px-10 [&>blockquote]:bg-[#E05017]/5 [&>blockquote]:rounded-xl [&>blockquote]:border-l-8 [&>blockquote]:border-[#E05017] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content ?? '') }}
              />
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase py-1">Tags :</span>
                {news.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/actualites?tag=${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium hover:bg-[#E05017] hover:text-white transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Share Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#E05017]" />
                Partager l'article
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="size-12 rounded-lg bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="size-12 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center group-hover:bg-[#1DA1F2] group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="size-12 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="size-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-[#E05017] group-hover:text-white transition-all">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Copier</span>
                </button>
              </div>
            </div>

            {/* Related Articles */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Articles similaires</h3>
                  <Link href="/actualites" className="text-xs font-bold text-[#E05017] hover:underline">
                    Voir tout
                  </Link>
                </div>

                <div className="space-y-6">
                  {relatedNews.map((related) => (
                    <NewsCard key={related.id} news={related} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-[#E05017] text-white rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 bg-white/10 rounded-full blur-2xl" />
              <Mail className="w-10 h-10 mb-4 text-[#f59e0b]" />
              <h3 className="text-xl font-bold mb-2">Restez informé</h3>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">
                Recevez les dernières nouvelles directement dans votre boîte mail.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 border-none rounded-lg text-sm placeholder:text-white/60 focus:ring-[#f59e0b] py-2.5 px-4 text-white"
                  placeholder="Votre adresse email"
                />
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-[#f59e0b] text-[#E05017] font-bold py-2.5 rounded-lg text-sm hover:scale-[1.02] transition-transform"
                >
                  S'abonner
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
