/* app/(main)/annuaire/annuaire-des-crasc/[crascSlug]/page.tsx: Page detail d'une Région CRASC */
"use client";

import React, { use, useState, useEffect } from "react";
import { getCrascBySlug, fetchEvenements, fetchCrascVideos } from "@/lib/fetch-crasc";
import { fetchAllNews } from "@/lib/fetch-news";
import Link from "next/link";
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { ICrascDetail, INews, IEvenement, ICrascVideo } from "@/types/api.types";
import { domainesIntervention } from "../page";
import {
  MapPin,
  Users,
  ArrowLeft,
  Calendar,
  CalendarDays,
  MapPin as LocationPin,
  Loader2,
  Target,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Mail,
  Send,
  CheckCircle,
} from 'lucide-react';


function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const vid =
        u.searchParams.get("v") ||
        (u.hostname === "youtu.be" ? u.pathname.slice(1) : null) ||
        u.pathname.split("/").pop();
      if (vid) return `https://www.youtube.com/embed/${vid}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const vid = u.pathname.split("/").filter(Boolean).pop();
      if (vid) return `https://player.vimeo.com/video/${vid}`;
    }
  } catch {}
  return null;
}

const CRASC_ZONE_COLORS: Record<string, { color: string; darkColor: string }> = {
  'crasc-nord':   { color: '#F59E42', darkColor: '#ff8c42' },
  'crasc-est':    { color: '#FF6B8A', darkColor: '#ff5577' },
  'crasc-centre': { color: '#5A7D5A', darkColor: '#4a6d4a' },
  'crasc-ouest':  { color: '#4FC3DC', darkColor: '#3ab3cc' },
  'crasc-sud':    { color: '#2E86C1', darkColor: '#2574a9' },
};
const DEFAULT_ZONE_COLORS = { color: '#E05017', darkColor: '#d04010' };
const EVENT_STATUS_META: Record<string, { label: string; className: string }> = {
  realise: { label: 'Réalisé', className: 'bg-green-100 text-green-700' },
  en_cours: { label: 'En cours', className: 'bg-blue-100 text-blue-700' },
  non_realise: { label: 'Non réalisé', className: 'bg-red-100 text-red-700' },
};

export default function CrascRegionPage({ params }: { params: Promise<{ crascSlug: string }>; }) {
  const resolvedParams = use(params);
  const crascSlug = resolvedParams.crascSlug;
  const zoneColors = CRASC_ZONE_COLORS[crascSlug] || DEFAULT_ZONE_COLORS;
  const [crascData, setCrascData] = useState<ICrascDetail | null>(null);
  const [evenements, setEvenements] = useState<IEvenement[]>([]);
  const [videos, setVideos] = useState<ICrascVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [oscSearch, setOscSearch] = useState('');
  const [oscPage, setOscPage] = useState(1);
  const OSC_PER_PAGE = 6;
  const [videoPage, setVideoPage] = useState(1);
  const VIDEOS_PER_PAGE = 6;

  // Contact form state
  const [contactForm, setContactForm] = useState({ nom: '', email: '', telephone: '', objet: '', message: '' });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactSending(true);
    setContactError(null);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE}/api/v1/crasc/crasc/${crascSlug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: contactForm.nom,
          email: contactForm.email,
          telephone: contactForm.telephone || null,
          objet: contactForm.objet,
          message: contactForm.message,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Une erreur est survenue.');
      }
      setContactSent(true);
      setContactForm({ nom: '', email: '', telephone: '', objet: '', message: '' });
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setContactSending(false);
    }
  }

  useEffect(() => {
    if (!crascSlug) return;
    let isCurrent = true;

    async function fetchCrasc() {
      try {
        setLoading(true);
        const data = await getCrascBySlug(crascSlug);
        if (isCurrent) {
          setCrascData(data);

          if (data.id) {
            const [newsData, evtData, videoData] = await Promise.all([
              fetchAllNews({ crasc_id: parseInt(data.id) }),
              fetchEvenements(parseInt(data.id), false),
              fetchCrascVideos(parseInt(data.id)),
            ]);
            if (isCurrent) {
              setCrascData(prev => prev ? { ...prev, news: newsData } : prev);
              setEvenements(evtData);
              setVideos(videoData);
            }
          }
        }
      } catch {
        if (isCurrent) setError("Impossible de charger les données du CRASC.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchCrasc();

    return () => {
      isCurrent = false;
    };
  }, [crascSlug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: zoneColors.color }} />
          <p className="text-gray-600">Chargement des détails du CRASC...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !crascData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Erreur</h2>
            <p className="text-red-700 mb-6">{error || 'CRASC non trouvé'}</p>
            <Link
              href="/annuaire/annuaire-des-crasc"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: zoneColors.color }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;annuaire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
      <style>{`
        .zone-card:hover { border-color: ${zoneColors.color} !important; }
        .zone-card:hover .zone-title { color: ${zoneColors.color} !important; }
      `}</style>
      {/* Hero Section */}
      <div className="text-white py-16" style={{ background: `linear-gradient(to right, ${zoneColors.color}, ${zoneColors.darkColor})` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/annuaire/annuaire-des-crasc"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;annuaire
          </Link>
          
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-md">
                <ImageWithFallback
                  src={`/images/logos-crasc/${crascSlug}.jpg`}
                  alt={`Logo ${crascData.name}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                {crascData.name}
              </h1>
              {crascData.osc_count !== undefined && (
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {crascData.osc_count} OSC{crascData.osc_count > 1 ? 's' : ''} membre{crascData.osc_count > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Régions Card */}
              {crascData.regions && crascData.regions.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Régions/Districts couverts</h3>
                  </div>
                  <div className="space-y-2">
                    {crascData.regions.map((region) => (
                      <div
                        key={region.id}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {region.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Domaines Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Domaines d&apos;Intervention</h3>
                </div>
                <div className="space-y-2">
                  {domainesIntervention.slice(0, 5).map((domaine, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      {domaine}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OSC Members Section */}
            {crascData.oscs !== undefined && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                {/* Header avec recherche */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        OSC Membres <span className="text-gray-400 font-semibold">({crascData.oscs.length})</span>
                      </h2>
                      <p className="text-xs text-gray-500">
                        {crascData.oscs.filter(o => o.name.toLowerCase().includes(oscSearch.toLowerCase())).length} / {crascData.oscs.length} organisation{crascData.oscs.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une OSC..."
                      value={oscSearch}
                      onChange={(e) => { setOscSearch(e.target.value); setOscPage(1); }}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#E05017] focus:ring-1 focus:ring-[#E05017]"
                    />
                  </div>
                </div>

                {(() => {
                  const filtered = crascData.oscs!.filter(o =>
                    o.name.toLowerCase().includes(oscSearch.toLowerCase())
                  );
                  const totalPages = Math.ceil(filtered.length / OSC_PER_PAGE);
                  const paginated = filtered.slice((oscPage - 1) * OSC_PER_PAGE, oscPage * OSC_PER_PAGE);

                  return (
                    <>
                      {filtered.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                          <p className="font-medium">Aucune OSC trouvée pour &quot;{oscSearch}&quot;</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          {paginated.map((osc) => (
                            <Link
                              key={osc.id}
                              href={`/annuaire/annuaire-des-osc/${osc.slug}`}
                              className="zone-card group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all"
                            >
                              <div className="aspect-video overflow-hidden bg-gray-200">
                                <ImageWithFallback
                                  alt={osc.name}
                                  src={osc?.thumbnail_url}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="zone-title font-bold text-gray-900 transition-colors mb-2 line-clamp-1">
                                  {osc.name}
                                </h3>
                                {osc.description && (
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{osc.description}</p>
                                )}
                                {osc.type && (
                                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    {osc.type.name}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-100 flex-wrap">
                          <button
                            onClick={() => setOscPage(p => Math.max(1, p - 1))}
                            disabled={oscPage === 1}
                            className="p-2 rounded-lg border border-gray-200 hover:border-[#E05017] hover:text-[#E05017] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page =>
                              page === 1 ||
                              page === totalPages ||
                              (page >= oscPage - 1 && page <= oscPage + 1)
                            )
                            .reduce<(number | '...')[]>((acc, page, idx, arr) => {
                              if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('...');
                              acc.push(page);
                              return acc;
                            }, [])
                            .map((item, idx) =>
                              item === '...' ? (
                                <span key={`ellipsis-${idx}`} className="w-8 text-center text-gray-400 text-sm">…</span>
                              ) : (
                                <button
                                  key={item}
                                  onClick={() => setOscPage(item as number)}
                                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                                    item === oscPage
                                      ? 'bg-[#E05017] text-white'
                                      : 'border border-gray-200 text-gray-700 hover:border-[#E05017] hover:text-[#E05017]'
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            )}
                          <button
                            onClick={() => setOscPage(p => Math.min(totalPages, p + 1))}
                            disabled={oscPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 hover:border-[#E05017] hover:text-[#E05017] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}

                {crascData.oscs.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">Aucune OSC ajoutée pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* News Section */}
            {crascData.news && crascData.news.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Actualités Récentes
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {crascData.news.map((news: INews) => (
                    <Link
                      key={news.id}
                      href={`/actualites/${news.slug}`}
                      className="zone-card group block bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all"
                    >
                      {news.thumbnail_url && (
                        <div className="aspect-video overflow-hidden bg-gray-200">
                          <ImageWithFallback
                            src={news.thumbnail_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="zone-title font-bold text-gray-900 transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h3>
                        {news.created_at && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(news.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(!crascData.news || crascData.news.length === 0) && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center shadow-sm">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucune actualité ajoutée pour le moment.</p>
              </div>
            )}

            {/* ── Vidéos Section ── */}
            {videos.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${zoneColors.color}20` }}>
                    <Video className="w-5 h-5" style={{ color: zoneColors.color }} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Vidéos <span className="text-gray-400 font-semibold text-lg">({videos.length})</span>
                  </h2>
                </div>
                {(() => {
                  const totalVideoPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
                  const paginatedVideos = videos.slice((videoPage - 1) * VIDEOS_PER_PAGE, videoPage * VIDEOS_PER_PAGE);
                  return (
                    <>
                      <div className="grid sm:grid-cols-2 gap-6 mb-4">
                        {paginatedVideos.map((video) => {
                          const embedUrl = getEmbedUrl(video.url);
                          return (
                            <div key={video.id} className="space-y-2">
                              <div className="rounded-xl overflow-hidden aspect-video bg-gray-100">
                                {embedUrl ? (
                                  <iframe
                                    src={embedUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Video className="w-10 h-10 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <p className="font-semibold text-gray-900 text-sm">{video.titre}</p>
                              {video.description && (
                                <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {totalVideoPages > 1 && (
                        <div className="flex items-center justify-center gap-1 pt-4 border-t border-gray-100 flex-wrap">
                          <button
                            onClick={() => setVideoPage(p => Math.max(1, p - 1))}
                            disabled={videoPage === 1}
                            className="p-2 rounded-lg border border-gray-200 hover:border-current disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            style={{ color: zoneColors.color }}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          {Array.from({ length: totalVideoPages }, (_, i) => i + 1)
                            .filter(page =>
                              page === 1 ||
                              page === totalVideoPages ||
                              (page >= videoPage - 1 && page <= videoPage + 1)
                            )
                            .reduce<(number | '...')[]>((acc, page, idx, arr) => {
                              if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('...');
                              acc.push(page);
                              return acc;
                            }, [])
                            .map((item, idx) =>
                              item === '...' ? (
                                <span key={`vellipsis-${idx}`} className="w-8 text-center text-gray-400 text-sm">…</span>
                              ) : (
                                <button
                                  key={item}
                                  onClick={() => setVideoPage(item as number)}
                                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                                    item === videoPage
                                      ? 'text-white'
                                      : 'border border-gray-200 text-gray-700 hover:border-current'
                                  }`}
                                  style={item === videoPage ? { backgroundColor: zoneColors.color } : { color: item !== videoPage ? undefined : zoneColors.color }}
                                >
                                  {item}
                                </button>
                              )
                            )}
                          <button
                            onClick={() => setVideoPage(p => Math.min(totalVideoPages, p + 1))}
                            disabled={videoPage === totalVideoPages}
                            className="p-2 rounded-lg border border-gray-200 hover:border-current disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            style={{ color: zoneColors.color }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* ── Agenda Section ── */}
            <div id="agenda" className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${zoneColors.color}20` }}>
                  <CalendarDays className="w-5 h-5" style={{ color: zoneColors.color }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
              </div>

              {evenements.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CalendarDays className="w-14 h-14 mx-auto mb-3 opacity-30" />
                  <p className="text-lg">Aucun événement à venir.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evenements
                    .sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime())
                    .map((evt) => {
                      const debut = new Date(evt.date_debut);
                      const isPast = debut < new Date();
                      const status = EVENT_STATUS_META[evt.statut || 'en_cours'] ?? EVENT_STATUS_META.en_cours;
                      return (
                        <div
                          key={evt.id}
                          className={`flex gap-4 p-4 rounded-xl border-l-4 ${isPast ? 'bg-gray-50 border-gray-300 opacity-70' : 'bg-white border-l-4'}`}
                          style={!isPast ? { borderLeftColor: zoneColors.color, background: `${zoneColors.color}08` } : {}}
                        >
                          {/* Date badge */}
                          <div
                            className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-sm"
                            style={{ backgroundColor: isPast ? '#9ca3af' : zoneColors.color }}
                          >
                            <span className="text-xl leading-none">
                              {debut.toLocaleDateString('fr-FR', { day: '2-digit' })}
                            </span>
                            <span className="text-xs uppercase">
                              {debut.toLocaleDateString('fr-FR', { month: 'short' })}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 line-clamp-1">{evt.title}</h3>
                            {evt.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{evt.description}</p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {debut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                {evt.date_fin && (
                                  <> – {new Date(evt.date_fin).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</>
                                )}
                              </span>
                              {evt.lieu && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <LocationPin className="w-3 h-3" />
                                  {evt.lieu}
                                </span>
                              )}
                              {evt.date_fin && new Date(evt.date_fin).toDateString() !== debut.toDateString() && (
                                <span className="text-xs text-gray-400">
                                  au {new Date(evt.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0 self-start">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* ── Formulaire de contact ── */}
            <div id="contact-crasc" className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${zoneColors.color}20` }}>
                  <Mail className="w-5 h-5" style={{ color: zoneColors.color }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contacter le {crascData.name}</h2>
              </div>

              {contactSent ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</p>
                  <p className="text-gray-600 mb-6">Votre message a bien été transmis. Vous recevrez une confirmation par email.</p>
                  <button
                    onClick={() => setContactSent(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white transition-colors"
                    style={{ backgroundColor: zoneColors.color }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {contactError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{contactError}</div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
                      <input
                        type="text" required
                        value={contactForm.nom}
                        onChange={e => setContactForm({ ...contactForm, nom: e.target.value })}
                        placeholder="Votre nom"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email" required
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="votre@email.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        value={contactForm.telephone}
                        onChange={e => setContactForm({ ...contactForm, telephone: e.target.value })}
                        placeholder="+225 XX XX XX XX XX"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Objet <span className="text-red-500">*</span></label>
                      <input
                        type="text" required
                        value={contactForm.objet}
                        onChange={e => setContactForm({ ...contactForm, objet: e.target.value })}
                        placeholder="Objet de votre message"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                    <textarea
                      rows={4} required
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Votre message..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={contactSending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white disabled:opacity-50 transition-all hover:shadow-md"
                    style={{ background: `linear-gradient(to right, ${zoneColors.color}, ${zoneColors.darkColor})` }}
                  >
                    {contactSending ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Envoyer le message</>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Votre message sera transmis à l&apos;équipe PdoC et au responsable du {crascData.name}.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Statistiques
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">OSC Membres</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {crascData.osc_count || crascData.oscs?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Régions et districts</span>
                  <span className="text-2xl font-bold text-green-600">
                    {crascData.regions?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Actualités</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {crascData.news?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Événements agenda</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {evenements.length}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <a
                  href="#agenda"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 font-semibold rounded-lg hover:shadow-md transition-all"
                  style={{ borderColor: zoneColors.color, color: zoneColors.color }}
                >
                  <CalendarDays className="w-4 h-4" />
                  Voir l&apos;agenda
                </a>
                <a
                  href="#contact-crasc"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  style={{ background: `linear-gradient(to right, ${zoneColors.color}, ${zoneColors.darkColor})` }}
                >
                  <Mail className="w-4 h-4" />
                  Contacter le CRASC
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
