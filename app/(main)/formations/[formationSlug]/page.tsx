"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import {
  Play,
  CheckCircle,
  Lock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Star,
  Users,
  BookOpen,
  Maximize,
  Loader2,
  Shield,
  MapPin,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { getFormationBySlug, inscrireFormation, verifierCertificat, IFormation } from '@/lib/fetch-formations';
import { initierPaiement } from '@/lib/cinetpay';
import { getStoredUser, fetchWithAuth, getToken } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ILecon {
  id: number;
  module_id: number;
  title: string;
  type: 'video' | 'pdf' | 'text';
  content: string | null;
  file_url: string | null;
  duration_minutes: number | null;
  is_preview: boolean;
  order: number;
}

interface IModule {
  id: number;
  title: string;
  description: string | null;
  order: number;
  lecons: ILecon[];
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function FormationDetailPage() {
  const params = useParams();
  const formationSlug = params.formationSlug as string;

  const [formation, setFormation] = useState<IFormation | null>(null);
  const [modules, setModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLecon, setActiveLecon] = useState<ILecon | null>(null);
  const currentUser = getStoredUser();
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // Inscription
  const [showInscription, setShowInscription] = useState(false);
  const [inscriptionName, setInscriptionName] = useState("");
  const [inscriptionEmail, setInscriptionEmail] = useState("");
  const [inscriptionPhone, setInscriptionPhone] = useState("");
  const [inscribing, setInscribing] = useState(false);
  const [inscriptionSuccess, setInscriptionSuccess] = useState(false);
  const [inscriptionError, setInscriptionError] = useState("");

  // Certificat
  const [certCode, setCertCode] = useState("");
  const [certResult, setCertResult] = useState<any>(null);
  const [certError, setCertError] = useState("");
  const [certLoading, setCertLoading] = useState(false);

  // Avis
  const [avis, setAvis] = useState<any[]>([]);
  const [monAvis, setMonAvis] = useState<any | null>(null);
  const [avisNote, setAvisNote] = useState(0);
  const [avisCommentaire, setAvisCommentaire] = useState("");
  const [avisLoading, setAvisLoading] = useState(false);
  const [avisSuccess, setAvisSuccess] = useState(false);
  const [avisError, setAvisError] = useState("");

  // Progression
  const [leconsVues, setLeconsVues] = useState<number[]>([]);
  const [progression, setProgression] = useState(0);
  const [totalLecons, setTotalLecons] = useState(0);
  const [certEmis, setCertEmis] = useState<string | null>(null);

  // Partage
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const title = formation?.title || "Formation";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const user = getStoredUser();
        const checkUrl = user
          ? `${API_BASE_URL}/api/v1/formations/${formationSlug}/check-inscription?email=${encodeURIComponent(user.email)}`
          : null;

        const [f, mods, checkResult] = await Promise.all([
          getFormationBySlug(formationSlug),
          fetch(`${API_BASE_URL}/api/v1/formations/${formationSlug}/modules`)
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
          checkUrl
            ? fetch(checkUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null)
            : Promise.resolve(null),
        ]);

        if (checkResult?.registered) setAlreadyRegistered(true);
        setFormation(f);
        const modList = Array.isArray(mods) ? mods : [];
        setModules(modList);
        // Auto-select first preview leçon if any
        const firstPreview = modList.flatMap((m: IModule) => m.lecons).find((l: ILecon) => l.is_preview);
        if (firstPreview) setActiveLecon(firstPreview);

        // Charger les avis
        fetch(`${API_BASE_URL}/api/v1/formations/${formationSlug}/avis`)
          .then((r) => r.ok ? r.json() : [])
          .then((data) => setAvis(Array.isArray(data) ? data : []))
          .catch(() => {});

        // Vérifier si l'utilisateur a déjà laissé un avis
        if (checkResult?.registered && getToken()) {
          fetch(`${API_BASE_URL}/api/v1/formations/${formationSlug}/mon-avis`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => { if (data) setMonAvis(data); })
            .catch(() => {});
        }

        // Charger la progression si l'utilisateur est inscrit et connecté
        if (checkResult?.registered && getToken()) {
          fetch(`${API_BASE_URL}/api/v1/formations/${formationSlug}/ma-progression`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
            .then((r) => r.ok ? r.json() : null)
            .then((prog) => {
              if (prog) {
                setLeconsVues(prog.lecons_vues || []);
                setProgression(prog.progression || 0);
                setTotalLecons(prog.total_lecons || 0);
                if (prog.certificat_code) setCertEmis(prog.certificat_code);
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [formationSlug]);

  async function inscrire(name: string, email: string, phone?: string) {
    setInscribing(true);
    setInscriptionError("");
    try {
      if (formation?.type === "payante") {
        const paiement = await initierPaiement(formationSlug, name, email, phone);
        const redirectUrl = paiement.cinetpay_configured
          ? paiement.payment_url
          : `${paiement.payment_url}&iid=${paiement.inscription_id}`;
        window.location.href = redirectUrl;
      } else {
        await inscrireFormation(formationSlug, name, email);
        setInscriptionSuccess(true);
        setAlreadyRegistered(true);
      }
    } catch (err: any) {
      setInscriptionError(err.message);
    } finally {
      setInscribing(false);
    }
  }

  async function handleInscriptionConnecte() {
    const user = getStoredUser();
    if (!user) return;
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || user.email;
    await inscrire(name, user.email);
  }

  async function handleInscription(e: React.FormEvent) {
    e.preventDefault();
    await inscrire(inscriptionName, inscriptionEmail, inscriptionPhone || undefined);
  }

  async function handleSoumettrAvis(e: React.FormEvent) {
    e.preventDefault();
    if (avisNote === 0) { setAvisError("Veuillez sélectionner une note."); return; }
    setAvisLoading(true);
    setAvisError("");
    try {
      const token = getToken();
      if (!token) { window.location.href = "/auth/login"; return; }
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/${formationSlug}/avis`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note: avisNote, commentaire: avisCommentaire || null }),
      });
      if (res.status === 401) { window.location.href = "/auth/login"; return; }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur");
      }
      const newAvis = await res.json();
      setAvis((prev) => [newAvis, ...prev]);
      setMonAvis(newAvis);
      setAvisSuccess(true);
    } catch (err: any) {
      setAvisError(err.message);
    } finally {
      setAvisLoading(false);
    }
  }

  async function handleSelectLecon(lecon: ILecon) {
    setActiveLecon(lecon);
    // Si inscrit et connecté → marquer comme vue
    if (alreadyRegistered && getToken()) {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/lecons/${lecon.id}/vue`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setLeconsVues(prev => prev.includes(lecon.id) ? prev : [...prev, lecon.id]);
          setProgression(data.progression || 0);
          setTotalLecons(data.total_lecons || 0);
          if (data.certificat_code) setCertEmis(data.certificat_code);
        }
      } catch {}
    }
  }

  async function handleVerifyCert(e: React.FormEvent) {
    e.preventDefault();
    setCertLoading(true);
    setCertError("");
    setCertResult(null);
    const result = await verifierCertificat(certCode.trim().toUpperCase());
    if (result) setCertResult(result);
    else setCertError("Aucun certificat trouvé avec ce code.");
    setCertLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Formation non trouvée</p>
      </div>
    );
  }

  const canRegister = !alreadyRegistered && !formation.is_completed && !formation.is_full &&
    (!formation.registration_deadline || new Date(formation.registration_deadline) > new Date());

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-200 bg-white flex-col hidden lg:flex h-[calc(100vh-64px)] sticky top-16 ml-4 lg:ml-8">
          {/* Info formation */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {formation.type === "payante" ? (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {formation.price ? `${formation.price.toLocaleString()} FCFA` : "Payante"}
                </span>
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Gratuite
                </span>
              )}
              {formation.rubrique && (
                <span
                  className="px-2 py-1 text-white text-xs font-bold rounded-full"
                  style={{ backgroundColor: formation.rubrique.color || '#E05017' }}
                >
                  {formation.rubrique.name}
                </span>
              )}
              {formation.is_completed && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">Terminée</span>
              )}
              {formation.is_full && !formation.is_completed && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">Complet</span>
              )}
            </div>

            {formation.start_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 text-[#E05017]" />
                <span>{formatDate(formation.start_date)}</span>
              </div>
            )}
            {formation.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 text-[#E05017]" />
                <span>{formation.location}</span>
              </div>
            )}
            {formation.max_participants && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{formation.current_participants} / {formation.max_participants} inscrits</span>
              </div>
            )}
          </div>

          {/* Modules */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-3 text-gray-600">
              Programme
            </h2>
            {modules.length === 0 ? (
              <p className="text-xs text-gray-400 px-3">Aucun contenu disponible.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {modules.map((module) => (
                  <div key={module.id}>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3 text-gray-500">
                      {module.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {module.lecons.map((lecon) => {
                        const canAccess = lecon.is_preview || alreadyRegistered;
                        const isActive = activeLecon?.id === lecon.id;
                        const isVue = leconsVues.includes(lecon.id);
                        return (
                          <button
                            key={lecon.id}
                            onClick={() => canAccess ? handleSelectLecon(lecon) : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${
                              isActive ? "bg-[#E05017]/10 text-[#E05017]" : "hover:bg-gray-100"
                            } ${!canAccess ? "cursor-default opacity-60" : "cursor-pointer"}`}
                          >
                            {isVue ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : !canAccess ? (
                              <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : lecon.type === 'video' ? (
                              <Play className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#E05017]" : "text-gray-600"}`} />
                            ) : lecon.type === 'pdf' ? (
                              <FileText className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#E05017]" : "text-blue-500"}`} />
                            ) : (
                              <FileText className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#E05017]" : "text-gray-600"}`} />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">{lecon.title}</p>
                              <p className="text-[10px] text-gray-500">
                                {!canAccess
                                  ? "Inscription requise"
                                  : `${lecon.type === 'video' ? 'Vidéo' : lecon.type === 'pdf' ? 'PDF' : 'Lecture'}${lecon.duration_minutes ? ` • ${lecon.duration_minutes} min` : ''}`}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barre de progression */}
          {alreadyRegistered && totalLecons > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              {certEmis && progression >= 100 ? (
                <a
                  href={`/certificat/${certEmis}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
                >
                  Télécharger mon certificat
                </a>
              ) : (
                <>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Ma progression</span>
                    <span className="font-bold text-[#E05017]">{progression}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#E05017] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progression}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 text-center">
                    {leconsVues.length} / {totalLecons} leçons vues
                  </p>
                </>
              )}
            </div>
          )}

          {/* S'inscrire button */}
          <div className="p-4 border-t border-gray-200">
            {canRegister ? (
              currentUser ? (
                <button
                  onClick={handleInscriptionConnecte}
                  disabled={inscribing}
                  className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315] transition-colors disabled:opacity-60"
                >
                  {inscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {inscribing ? "Inscription..." : "S'inscrire à cette formation"}
                </button>
              ) : (
                <button
                  onClick={() => setShowInscription(!showInscription)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315] transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                  S'inscrire à cette formation
                </button>
              )
            ) : (
              <div className="text-center text-sm">
                {alreadyRegistered ? (
                  <span className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Vous êtes inscrit
                  </span>
                ) : formation.is_completed ? (
                  <span className="text-gray-500">Formation terminée</span>
                ) : formation.is_full ? (
                  <span className="text-gray-500">Formation complète</span>
                ) : (
                  <span className="text-gray-500">Inscriptions closes</span>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-[1000px] mx-auto p-4 md:p-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#E05017] font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  {formation.rubrique?.name || "Formation"} • PASCI
                </div>
                <h1 className="text-3xl font-black leading-tight">{formation.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  {formation.trainer && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {formation.trainer}
                    </span>
                  )}
                  {formation.current_participants > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {formation.current_participants} participant{formation.current_participants > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Lien copié !" : "Partager"}
              </button>
            </div>

            {/* Active Leçon Viewer */}
            {activeLecon ? (
              <div className="mb-8">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
                    {activeLecon.type === 'video' && <Play className="w-4 h-4 text-red-500" />}
                    {activeLecon.type === 'pdf' && <FileText className="w-4 h-4 text-blue-500" />}
                    {activeLecon.type === 'text' && <BookOpen className="w-4 h-4 text-green-500" />}
                    <span className="font-semibold text-sm text-gray-800">{activeLecon.title}</span>
                    {activeLecon.duration_minutes && (
                      <span className="text-xs text-gray-400 ml-auto">{activeLecon.duration_minutes} min</span>
                    )}
                  </div>
                  <div>
                    {/* Vidéo */}
                    {activeLecon.type === 'video' && activeLecon.content && (
                      <div className="relative aspect-video bg-black">
                        <iframe
                          src={getEmbedUrl(activeLecon.content)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {activeLecon.type === 'video' && !activeLecon.content && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                        <Play className="w-10 h-10" />
                        <p className="text-sm">Aucune URL vidéo renseignée</p>
                      </div>
                    )}
                    {/* PDF de support lié à la vidéo */}
                    {activeLecon.type === 'video' && activeLecon.file_url && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 flex-1">Support de cours (PDF)</span>
                        <a
                          href={activeLecon.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </a>
                      </div>
                    )}

                    {/* PDF embarqué */}
                    {activeLecon.type === 'pdf' && activeLecon.file_url && (
                      <div className="flex flex-col">
                        <iframe
                          src={activeLecon.file_url}
                          className="w-full border-0"
                          style={{ height: '70vh', minHeight: 500 }}
                          title={activeLecon.title}
                        />
                        <div className="flex justify-end p-3 border-t border-gray-100 bg-gray-50">
                          <a
                            href={activeLecon.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        </div>
                      </div>
                    )}
                    {activeLecon.type === 'pdf' && !activeLecon.file_url && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                        <FileText className="w-10 h-10" />
                        <p className="text-sm">PDF non disponible</p>
                      </div>
                    )}

                    {/* Texte */}
                    {activeLecon.type === 'text' && activeLecon.content && (
                      <div
                        className="p-6 text-gray-700 leading-relaxed text-base"
                        style={{
                          lineHeight: '1.75',
                          fontSize: '15px',
                        }}
                        dangerouslySetInnerHTML={{ __html: activeLecon.content }}
                      />
                    )}
                    {activeLecon.type === 'text' && !activeLecon.content && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                        <BookOpen className="w-10 h-10" />
                        <p className="text-sm">Aucun contenu texte</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Thumbnail */
              <div className="mb-8">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-200">
                  <ImageWithFallback
                    src={formation.thumbnail_url}
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Message de succès pour l'utilisateur connecté */}
            {inscriptionSuccess && currentUser && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-green-800 font-medium text-sm">
                  Inscription confirmée ! Vous recevrez une confirmation par email.
                </p>
              </div>
            )}

            {/* Inscription form (inline) — uniquement pour les non-connectés */}
            {showInscription && canRegister && !currentUser && (
              <div className="mb-8 bg-white p-6 rounded-xl border border-[#E05017]/30 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#E05017]" />
                  S'inscrire à cette formation
                </h2>
                {inscriptionSuccess ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">
                      Inscription enregistrée ! Vous recevrez une confirmation par email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInscription} className="grid md:grid-cols-2 gap-4">
                    {inscriptionError && (
                      <p className="md:col-span-2 text-red-500 text-sm">{inscriptionError}</p>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={inscriptionName}
                        onChange={(e) => setInscriptionName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                        placeholder="Votre nom et prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={inscriptionEmail}
                        onChange={(e) => setInscriptionEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                        placeholder="votre@email.com"
                      />
                    </div>
                    {formation?.type === "payante" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Numéro de téléphone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={inscriptionPhone}
                          onChange={(e) => setInscriptionPhone(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                          placeholder="+225 07 00 00 00 00"
                        />
                        <p className="text-xs font-bold text-gray-500 mt-1">Renseigner l&apos;indicatif du pays, Ex : +225 07 00</p>
                        <p className="text-xs text-gray-500 mt-1">Requis pour le paiement mobile money</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        disabled={inscribing}
                        className="flex items-center gap-2 px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] disabled:opacity-50"
                      >
                        {inscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        {inscribing ? "Inscription..." : "Confirmer l'inscription"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#E05017]" />
                    À propos de cette formation
                  </h2>
                  <div className="text-gray-600 text-base leading-relaxed">
                    <p>{formation.description || "Aucune description disponible."}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Resources */}
                {(formation.registration_link || formation.materials_link) && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-[#E05017]" />
                      Ressources
                    </h2>
                    <div className="flex flex-col gap-3">
                      {formation.registration_link && (
                        <a
                          href={formation.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all group"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-blue-100">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold">Lien d'inscription</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-[#E05017]" />
                        </a>
                      )}
                      {formation.materials_link && (
                        <a
                          href={formation.materials_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all group"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-red-100">
                            <FileText className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold">Supports de formation</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-[#E05017]" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Vérification certificat */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#E05017]" />
                    Vérifier un certificat
                  </h2>
                  <form onSubmit={handleVerifyCert} className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={certCode}
                      onChange={(e) => setCertCode(e.target.value)}
                      placeholder="Code du certificat..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={certLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-lg h-9 bg-[#2A591D] text-white text-xs font-bold hover:bg-[#1e4015] disabled:opacity-50"
                    >
                      {certLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Vérifier"}
                    </button>
                  </form>
                  {certError && <p className="text-red-500 text-xs mt-2">{certError}</p>}
                  {certResult && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-xs space-y-1">
                      <p className="font-bold text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Certificat valide
                      </p>
                      <p><span className="font-medium">Participant :</span> {certResult.participant_name}</p>
                      <p><span className="font-medium">Formation :</span> {certResult.formation_title}</p>
                      <p><span className="font-medium">Délivré le :</span> {formatDate(certResult.issued_at)}</p>
                    </div>
                  )}
                </div>

                {/* Avis */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#E05017]" />
                    Avis des participants
                    {avis.length > 0 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{avis.length}</span>
                    )}
                  </h2>

                  {/* Moyenne */}
                  {avis.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-lg">
                      <span className="text-2xl font-bold text-amber-600">
                        {(avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1)}
                      </span>
                      <div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avis.reduce((sum, a) => sum + a.note, 0) / avis.length) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{avis.length} avis</p>
                      </div>
                    </div>
                  )}

                  {/* Zone avis pour les inscrits */}
                  {alreadyRegistered && (
                    monAvis ? (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Votre avis</p>
                        <div className="flex gap-0.5 mb-1">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`w-4 h-4 ${s <= monAvis.note ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        {monAvis.commentaire && <p className="text-xs text-gray-600">{monAvis.commentaire}</p>}
                      </div>
                    ) : !avisSuccess ? (
                      <form onSubmit={handleSoumettrAvis} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Donner mon avis</p>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map((s) => (
                            <button key={s} type="button" onClick={() => setAvisNote(s)}>
                              <Star className={`w-6 h-6 transition-colors ${s <= avisNote ? "text-amber-400 fill-amber-400" : "text-gray-300 hover:text-amber-300"}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={avisCommentaire}
                          onChange={(e) => setAvisCommentaire(e.target.value)}
                          placeholder="Votre commentaire (optionnel)..."
                          rows={3}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-none mb-2"
                        />
                        {avisError && <p className="text-red-500 text-xs mb-2">{avisError}</p>}
                        <button
                          type="submit"
                          disabled={avisLoading}
                          className="w-full h-8 bg-[#E05017] text-white text-xs font-bold rounded-lg hover:bg-[#c44315] disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          {avisLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Publier mon avis"}
                        </button>
                      </form>
                    ) : (
                      <div className="mb-3 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Merci pour votre avis !
                      </div>
                    )
                  )}

                  {/* Liste des avis */}
                  {avis.filter((a) => a.id !== monAvis?.id).length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">Aucun autre avis pour le moment.</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {avis.filter((a) => a.id !== monAvis?.id).map((a) => (
                        <div key={a.id} className="border-b border-gray-100 pb-3 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-800">{a.participant_name}</span>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= a.note ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                              ))}
                            </div>
                          </div>
                          {a.commentaire && <p className="text-xs text-gray-600 leading-relaxed">{a.commentaire}</p>}
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/formations">
                    <button className="w-full flex items-center justify-center gap-1 rounded-lg h-12 bg-white border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                      Retour
                    </button>
                  </Link>
                  {canRegister && (
                    <button
                      onClick={() => setShowInscription(true)}
                      className="flex items-center justify-center gap-1 rounded-lg h-12 bg-[#E05017] text-white text-xs font-black hover:bg-[#c44315] transition-all"
                    >
                      S'inscrire
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
