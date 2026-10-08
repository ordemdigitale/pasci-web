"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Target } from "lucide-react";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { TexteFormate } from "@/lib/contenus-site";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Slide {
  id: number;
  title?: string | null;
  description?: string | null;
  image_url: string;
  objectif?: string | null;
  resume?: string | null;
  article?: string | null;
  photo1_url?: string | null;
  photo2_url?: string | null;
}

/** « Voir plus » d'une image du carrousel : descriptif de l'activité illustrée. */
export default function SlideDescriptifPage() {
  const { id } = useParams<{ id: string }>();
  const [slide, setSlide] = useState<Slide | null>(null);
  const [etat, setEtat] = useState<"chargement" | "ok" | "introuvable">("chargement");

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE}/api/v1/hero-slides/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Slide) => {
        setSlide(data);
        setEtat("ok");
      })
      .catch(() => setEtat("introuvable"));
  }, [id]);

  if (etat === "chargement") {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#E05017]" /></div>;
  }
  if (etat === "introuvable" || !slide) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 font-poppins">
        <p className="text-gray-600">Cette activité n&apos;est plus affichée.</p>
        <Link href="/" className="text-[#E05017] font-semibold hover:underline">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  const photos = [slide.photo1_url, slide.photo2_url].filter(Boolean) as string[];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-poppins">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#2a591d] mb-3">{slide.title || "Activité"}</h1>
      {slide.description && <p className="text-gray-600 mb-6">{slide.description}</p>}

      <div className="rounded-xl overflow-hidden shadow-lg mb-8 aspect-video bg-gray-100">
        <ImageWithFallback src={slide.image_url} alt={slide.title || "Activité"} className="w-full h-full object-cover" />
      </div>

      {(slide.objectif || slide.resume) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {slide.objectif && (
            <section className="bg-orange-50 border border-orange-100 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#E05017]" /> Objectif de l&apos;activité
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{slide.objectif}</p>
            </section>
          )}
          {slide.resume && (
            <section className="bg-green-50 border border-green-100 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#2a591d]" /> Résumé de l&apos;activité
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{slide.resume}</p>
            </section>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div className={`grid gap-4 mb-8 ${photos.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {photos.map((url, i) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow aspect-[4/3] bg-gray-100">
              <ImageWithFallback src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </a>
          ))}
        </div>
      )}

      {slide.article && (
        <section className="prose max-w-none">
          <h2 className="font-bold text-gray-900 text-xl mb-3">Article</h2>
          <TexteFormate texte={slide.article} className="text-gray-700 leading-relaxed" />
        </section>
      )}
    </article>
  );
}
