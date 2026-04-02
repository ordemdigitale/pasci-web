"use client";

import { useState, useEffect } from 'react';
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

interface ILesson {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface IModule {
  id: number;
  title: string;
  lessons: ILesson[];
}

// Modules statiques de présentation (pas encore dans le backend)
const defaultModules: IModule[] = [
  {
    id: 1,
    title: "Module 1 : Introduction",
    lessons: [
      { id: 1, title: "01. Présentation de la formation", type: "article", duration: "5 min", completed: false, locked: false },
      { id: 2, title: "02. Objectifs et programme", type: "article", duration: "8 min", completed: false, locked: false },
    ]
  },
  {
    id: 2,
    title: "Module 2 : Contenu principal",
    lessons: [
      { id: 3, title: "03. Concepts fondamentaux", type: "video", duration: "15 min", completed: false, locked: true },
      { id: 4, title: "04. Mise en pratique", type: "video", duration: "20 min", completed: false, locked: true },
    ]
  }
];

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
  const [loading, setLoading] = useState(true);

  // Inscription
  const [showInscription, setShowInscription] = useState(false);
  const [inscriptionName, setInscriptionName] = useState("");
  const [inscriptionEmail, setInscriptionEmail] = useState("");
  const [inscribing, setInscribing] = useState(false);
  const [inscriptionSuccess, setInscriptionSuccess] = useState(false);
  const [inscriptionError, setInscriptionError] = useState("");

  // Certificat
  const [certCode, setCertCode] = useState("");
  const [certResult, setCertResult] = useState<any>(null);
  const [certError, setCertError] = useState("");
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    getFormationBySlug(formationSlug)
      .then(setFormation)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [formationSlug]);

  async function handleInscription(e: React.FormEvent) {
    e.preventDefault();
    setInscribing(true);
    setInscriptionError("");
    try {
      if (formation?.type === "payante") {
        // Formation payante → initier paiement CinetPay
        const paiement = await initierPaiement(formationSlug, inscriptionName, inscriptionEmail);
        // Construire l'URL de redirection avec l'ID inscription pour la simulation
        const redirectUrl = paiement.cinetpay_configured
          ? paiement.payment_url
          : `${paiement.payment_url}&iid=${paiement.inscription_id}`;
        window.location.href = redirectUrl;
      } else {
        // Formation gratuite → inscription directe
        await inscrireFormation(formationSlug, inscriptionName, inscriptionEmail);
        setInscriptionSuccess(true);
      }
    } catch (err: any) {
      setInscriptionError(err.message);
    } finally {
      setInscribing(false);
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

  const canRegister = !formation.is_completed && !formation.is_full &&
    (!formation.registration_deadline || new Date(formation.registration_deadline) > new Date());

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-10 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 text-[#E05017]">
              <ImageWithFallback
                src="/images/logo.png"
                alt="PASCI Logo"
                className="w-8 h-8"
              />
              <h2 className="text-lg font-bold">PASCI Education</h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-9">
              <Link href="/formations" className="text-sm font-medium hover:text-[#E05017]">Formations</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="w-10 h-10 bg-[#E05017] rounded-full flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

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
            <div className="flex flex-col gap-6">
              {defaultModules.map((module) => (
                <div key={module.id}>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3 text-gray-500">
                    {module.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left hover:bg-gray-100"
                      >
                        {lesson.locked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : lesson.type === 'article' ? (
                          <FileText className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-600" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{lesson.title}</p>
                          <p className="text-[10px] text-gray-500">
                            {lesson.locked ? 'Inscription requise' : `${lesson.type === 'video' ? 'Vidéo' : 'Lecture'} • ${lesson.duration}`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* S'inscrire button */}
          <div className="p-4 border-t border-gray-200">
            {canRegister ? (
              <button
                onClick={() => setShowInscription(!showInscription)}
                className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315] transition-colors"
              >
                <Maximize className="w-4 h-4" />
                S'inscrire à cette formation
              </button>
            ) : (
              <div className="text-center text-sm text-gray-500">
                {formation.is_completed ? "Formation terminée" : formation.is_full ? "Formation complète" : "Inscriptions closes"}
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
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-gray-200 text-sm font-bold hover:bg-gray-50">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>

            {/* Thumbnail */}
            <div className="mb-8">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-200">
                <ImageWithFallback
                  src={formation.thumbnail_url}
                  alt={formation.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Inscription form (inline) */}
            {showInscription && canRegister && (
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
