"use client";

import {use, useState, useEffect} from "react";
import { IJobs } from "@/types/api.types";
import { getJobBySlug } from "@/lib/fetch-jobs";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  Share2,
  Link as LinkIcon,
  Briefcase,
  Award,
  CheckCircle2,
  Gift,
  Home,
  Heart,
  TrendingUp,
  UtensilsCrossed,
  GraduationCap,
  Users,
  ArrowRight,
  Rocket,
  Sparkles,
  Target,
  Loader2
} from "lucide-react";

export default function PageDetailOffreEmploi({ params }: { params: Promise<{ jobSlug: string }>; }) {
  const resolvedParams = use(params);
  const jobSlug = resolvedParams.jobSlug;
  const [jobData, setJobData] = useState<IJobs | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobSlug) return;
    let isCurrent = true;

    async function fetchJob() {
      try {
        setLoading(true);
        const data = await getJobBySlug(jobSlug);
        if (isCurrent) setJobData(data);
      } catch (err: any) {
        if (isCurrent) setError(err.message || "Impossible de charger l'offre.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchJob();

    return () => {
      isCurrent = false;
    };
  }, [jobSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center font-poppins">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center font-poppins">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Erreur</p>
          <p>{error || "Offre d'emploi non trouvée"}</p>
          <Link href="/espace-collaboratif/offres-emploi" className="text-[#E05017] underline mt-4 inline-block">
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-[#f8f6f6] min-h-screen font-poppins">
      <main className="max-w-[840px] mx-auto px-6 py-12">
        {/* Job Header Card */}
        <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 mb-10 overflow-hidden relative">
          <div className="absolute -top-3 left-3 p-4">
            <span className="bg-[#E05017]/10 text-[#E05017] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {jobData.type}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* <div className="size-24 rounded-2xl bg-[#E05017] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#E05017]/20">
              <Rocket className="w-10 h-10" />
            </div> */}

            <div className="flex-1">
              {/* <p className="text-[#E05017] text-sm font-bold mb-1 uppercase tracking-widest">
                {jobData.employer}
              </p> */}
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#121714] mb-2">
                {jobData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-4 h-4" /> {jobData.employer}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4" /> {jobData.location}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-xs bg-gray-100 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3" /> {formatDate(jobData.publication_date)}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="bg-[#E05017]/10 p-2 rounded-full text-[#E05017]">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Partager</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="bg-[#E05017]/10 p-2 rounded-full text-[#E05017]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="bg-[#E05017]/10 p-2 rounded-full text-[#E05017]">
                <LinkIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Lien</span>
            </button>
          </div> */}
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Description */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-[#E05017]/10 text-[#E05017] flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Description du poste</h2>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {jobData.description}
              </p>
            </div>
          </section>

          {/* Missions */}
          {jobData.missions_list && jobData.missions_list.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-[#E05017]/10 text-[#E05017] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Missions & Responsabilités</h2>
              </div>
              <div className="grid gap-4">
                {jobData.missions_list.map((mission, index) => (
                  <div key={index} className="flex gap-5 bg-white p-6 rounded-xl border border-transparent hover:border-[#E05017]/20 transition-all">
                    <span className="text-[#E05017] font-bold text-lg leading-none mt-1">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <div>
                      <p className="text-[#121714] font-bold mb-1 text-lg">{mission.title}</p>
                      <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {jobData.requirements_list && jobData.requirements_list.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-[#E05017]/10 text-[#E05017] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Profil Recherché</h2>
              </div>
              <div className="bg-white rounded-xl p-8 border border-dashed border-[#E05017]/30">
                <ul className="space-y-4">
                  {jobData.requirements_list.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#E05017] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Benefits */}
          {jobData.benefits_list && jobData.benefits_list.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-[#E05017]/10 text-[#E05017] flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Avantages & Culture</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobData.benefits_list.map((benefit, index) => {
                  // Map icon names to components
                  const iconMap: any = {
                    Home,
                    Heart,
                    TrendingUp,
                    UtensilsCrossed,
                    GraduationCap,
                    Users,
                  };
                  const IconComponent = iconMap[benefit.icon] || Home;

                  return (
                    <div key={index} className="bg-white p-5 rounded-xl flex items-center gap-4">
                      <div className="bg-[#E05017]/20 text-[#E05017] p-3 rounded-full">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{benefit.title}</p>
                        <p className="text-xs text-gray-500">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="bg-[#E05017]/5 rounded-2xl p-8 md:p-12 text-center border border-[#E05017]/10">
            <h3 className="text-2xl font-extrabold mb-4">Découvrez d'autres opportunités</h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
              Explorez notre plateforme pour découvrir plus d'offres d'emploi et d'opportunités de collaboration au sein de l'écosystème PASCI.
            </p>
            <div className="flex justify-center">
              <Link href="/espace-collaboratif/offres-emploi">
                <button className="bg-[#E05017] text-white h-14 px-12 rounded-xl font-extrabold shadow-xl shadow-[#E05017]/30 hover:-translate-y-1 transition-all">
                  Consulter d'autres offres
                </button>
              </Link>
            </div>
          </section>
        </div>

        {/* Similar Offers */}
        {/* <div className="mt-24">
          <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#E05017]" />
            Offres similaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Link href="/espace-collaboratif/offres-emploi/analyste-donnees">
              <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#E05017] group-hover:bg-[#E05017] group-hover:text-white transition-colors">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Aujourd'hui</span>
                </div>
                <h4 className="font-bold text-lg mb-1 group-hover:text-[#E05017] transition-colors">
                  Analyste de Données Impact
                </h4>
                <p className="text-sm text-gray-600 mb-4">PASCI • Dakar, Sénégal</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-[#E05017]">CDI • Dakar</span>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#E05017] transition-colors" />
                </div>
              </div>
            </Link>

            <Link href="/espace-collaboratif/offres-emploi/coordonnateur-rse">
              <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#E05017] group-hover:bg-[#E05017] group-hover:text-white transition-colors">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Hier</span>
                </div>
                <h4 className="font-bold text-lg mb-1 group-hover:text-[#E05017] transition-colors">
                  Coordonnateur RSE Senior
                </h4>
                <p className="text-sm text-gray-600 mb-4">PASCI • Abidjan, Côte d'Ivoire</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-[#E05017]">CDI • Abidjan</span>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#E05017] transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </div> */}
      </main>
    </div>
  );
}
