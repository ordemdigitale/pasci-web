"use client";

import React, {use, useState, useEffect} from "react";
import { getNewsBySlug } from '@/localdata/helper/data';
import { INews } from '@/types/api.types';
import DOMPurify from 'dompurify';

export default function PageActu({ params, }: { params: Promise<{ newsSlug: string }>; }) {
  const resolvedParams = use(params);
  const newsSlug = resolvedParams.newsSlug;
  const [news, setNews] = useState<INews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!newsSlug) return;
    let isCurrent = true;

    async function fetchNews() {
      try {
        setLoading(true);
        const data = await getNewsBySlug(newsSlug);
        if (isCurrent) setNews(data);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        Chargement de l'actualité...
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-600">
        {error || "Actualité non trouvée"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{news.title}</h1>
      <div 
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content ?? '') }}
      />
    </div>
  );
};
