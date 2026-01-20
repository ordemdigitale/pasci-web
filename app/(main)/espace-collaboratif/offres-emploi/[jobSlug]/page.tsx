"use client";

import React, {use, useState, useEffect} from "react";
import { IJobs } from "@/types/api.types";
import { getJobBySlug } from "@/lib/fetch-jobs";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { Building2, MapPin } from "lucide-react";
import { getDaysSince } from "@/lib/date-utils";


export default function PageDetailOffreEmploi({ params }: { params: Promise<{ jobSlug: string }>; }) {
  const resolvedParams = use(params);
  const jobSlug = resolvedParams.jobSlug;
  const [jobData, setJobData] = useState<IJobs | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobSlug) return;
    let isCurrent = true;

    async function fetchPtf() {
      try {
        setLoading(true);
        const data = await getJobBySlug(jobSlug);
        if (isCurrent) setJobData(data);
      } catch (err: any) {
        if (!isCurrent) setError(err.message || "Impossible de charger le PTF.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchPtf();

    return () => {
      isCurrent = false;
    };
  }, [jobSlug]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-poppins">
        <p className="text-gray-600 text-4xl font-bold">{error || "Offre d'emploi non trouvée."}</p>
        <br />
        <Link href="/offres-emploi" className="text-sm hover:underline text-blue-600">
          Retour aux offres d'emploi.
        </Link>
      </div>
    );
  }

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-5xl mx-auto border border-gray-200 rounded-lg shadow-md flex flex-row items-center gap-8 p-4">

        <div>
          <p className="text-4xl font-bold">{jobData.title}</p>
        </div>
        <p>{jobData.location}</p>
        <p>{jobData.employer}</p>

      </div>


    <main className="max-w-[840px] mx-auto px-6 py-12">
      {/* <!-- Job Header Card --> */}
      <div className="bg-white dark:bg-white/5 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none p-8 mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <span className="bg-orange-500/20 text-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{jobData.type}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* <div className="size-24 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-4xl">rocket_launch</span>
        </div> */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#121714] dark:text-white mb-2">Chargé de Mission Innovation</h1>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[#678373] dark:text-gray-400">
            <span className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-lg"><Building2 /></span> PASCI Côte d'Ivoire</span>
            <span className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-lg"><MapPin /></span> Abidjan, Plateau</span>
            <span className="flex items-center gap-1.5 font-medium text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-sm">
              <MapPin /></span> Il y a 2 jours --- {jobData.publication_date}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-[#f1f4f2] dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2">
      <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
      <div className="bg-primary/10 p-2 rounded-full text-primary">
      <span className="material-symbols-outlined text-xl">share</span>
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase">Partager</span>
      </div>
      <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
      <div className="bg-primary/10 p-2 rounded-full text-primary">
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn</span>
      </div>
      <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
      <div className="bg-primary/10 p-2 rounded-full text-primary">
      <span className="material-symbols-outlined text-xl">link</span>
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase">Lien</span>
      </div>
      </div>
      <button className="bg-primary text-white h-12 px-10 rounded-xl font-extrabold text-sm shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                          POSTULER MAINTENANT
                      </button>
      </div>
      </div>
      {/* <!-- Content Sections --> */}
      <div className="space-y-12">
      {/* <!-- Missions --> */}
      <section>
      <div className="flex items-center gap-3 mb-6">
      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      <span className="material-symbols-outlined">assignment</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Missions &amp; Responsabilités</h2>
      </div>
      <div className="grid gap-4">
      <div className="flex gap-5 bg-white dark:bg-white/5 p-6 rounded-xl border border-transparent hover:border-primary/20 transition-all">
      <span className="text-primary font-bold text-lg leading-none mt-1">01.</span>
      <div>
      <p className="text-[#121714] dark:text-white font-bold mb-1 text-lg">Coordination de projets stratégiques</p>
      <p className="text-[#678373] dark:text-gray-400 leading-relaxed">Assurer le pilotage et le suivi opérationnel des initiatives d'innovation sociale au sein de l'espace collaboratif PASCI. Reporting bimensuel auprès de la direction générale.</p>
      </div>
      </div>
      <div className="flex gap-5 bg-white dark:bg-white/5 p-6 rounded-xl border border-transparent hover:border-primary/20 transition-all">
      <span className="text-primary font-bold text-lg leading-none mt-1">02.</span>
      <div>
      <p className="text-[#121714] dark:text-white font-bold mb-1 text-lg">Animation de l'écosystème</p>
      <p className="text-[#678373] dark:text-gray-400 leading-relaxed">Fédérer les partenaires institutionnels et privés autour des problématiques de développement durable et d'inclusion numérique.</p>
      </div>
      </div>
      <div className="flex gap-5 bg-white dark:bg-white/5 p-6 rounded-xl border border-transparent hover:border-primary/20 transition-all">
      <span className="text-primary font-bold text-lg leading-none mt-1">03.</span>
      <div>
      <p className="text-[#121714] dark:text-white font-bold mb-1 text-lg">Veille technologique &amp; sociale</p>
      <p className="text-[#678373] dark:text-gray-400 leading-relaxed">Identifier les tendances émergentes et proposer des solutions innovantes adaptées au contexte local ouest-africain.</p>
      </div>
      </div>
      </div>
      </section>
      {/* <!-- Requirements --> */}
      <section>
      <div className="flex items-center gap-3 mb-6">
      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      <span className="material-symbols-outlined">psychology</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Profil Recherché</h2>
      </div>
      <div className="bg-white dark:bg-white/5 rounded-xl p-8 border border-dashed border-primary/30">
      <ul className="space-y-4">
      <li className="flex items-start gap-3">
      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
      <span className="text-[#678373] dark:text-gray-300">Formation Bac+5 en Management de l'Innovation, Entrepreneuriat ou Développement durable.</span>
      </li>
      <li className="flex items-start gap-3">
      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
      <span className="text-[#678373] dark:text-gray-300">Minimum 3 ans d'expérience dans la gestion de projets multi-acteurs ou en cabinet de conseil.</span>
      </li>
      <li className="flex items-start gap-3">
      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
      <span className="text-[#678373] dark:text-gray-300">Maîtrise parfaite de l'anglais et du français (C1 minimum).</span>
      </li>
      <li className="flex items-start gap-3">
      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
      <span className="text-[#678373] dark:text-gray-300">Excellente capacité de rédaction et d'aisance oratoire devant des publics institutionnels.</span>
      </li>
      </ul>
      </div>
      </section>
      {/* <!-- Benefits --> */}
      <section>
      <div className="flex items-center gap-3 mb-6">
      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      <span className="material-symbols-outlined">redeem</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Avantages &amp; Culture</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-white/10 p-5 rounded-xl flex items-center gap-4">
      <div className="bg-primary/20 text-primary p-3 rounded-full">
      <span className="material-symbols-outlined">home_work</span>
      </div>
      <div>
      <p className="font-bold text-sm">Télétravail hybride</p>
      <p className="text-xs text-gray-500">2 jours par semaine</p>
      </div>
      </div>
      <div className="bg-white dark:bg-white/10 p-5 rounded-xl flex items-center gap-4">
      <div className="bg-primary/20 text-primary p-3 rounded-full">
      <span className="material-symbols-outlined">medical_services</span>
      </div>
      <div>
      <p className="font-bold text-sm">Couverture santé</p>
      <p className="text-xs text-gray-500">Prise en charge à 100%</p>
      </div>
      </div>
      <div className="bg-white dark:bg-white/10 p-5 rounded-xl flex items-center gap-4">
      <div className="bg-primary/20 text-primary p-3 rounded-full">
      <span className="material-symbols-outlined">trending_up</span>
      </div>
      <div>
      <p className="font-bold text-sm">Plan de carrière</p>
      <p className="text-xs text-gray-500">Formation continue annuelle</p>
      </div>
      </div>
      <div className="bg-white dark:bg-white/10 p-5 rounded-xl flex items-center gap-4">
      <div className="bg-primary/20 text-primary p-3 rounded-full">
      <span className="material-symbols-outlined">restaurant</span>
      </div>
      <div>
      <p className="font-bold text-sm">Tickets Restaurant</p>
      <p className="text-xs text-gray-500">Réseau partenaire étendu</p>
      </div>
      </div>
      </div>
      </section>
      {/* <!-- Final CTA Form --> */}
      <section className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 md:p-12 text-center border border-primary/10">
      <h3 className="text-2xl font-extrabold mb-4">Prêt à rejoindre l'aventure PASCI ?</h3>
      <p className="text-[#678373] dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">Rejoignez une équipe dynamique et contribuez à des projets qui ont un réel impact social et environnemental en Afrique de l'Ouest.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="bg-primary text-white h-14 px-12 rounded-xl font-extrabold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">Postuler Directement</button>
      <button className="bg-white dark:bg-white/5 border border-primary text-primary h-14 px-10 rounded-xl font-extrabold hover:bg-primary/5 transition-all">Consulter d'autres offres</button>
      </div>
      </section>
      </div>
      {/* <!-- Similar Offers --> */}
      <div className="mt-24">
      <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                      Offres similaires
                  </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* <!-- Similar Offer Card 1 --> */}
      <div className="group bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-[#f1f4f2] dark:border-white/5">
      <div className="flex justify-between items-start mb-4">
      <div className="size-12 rounded-lg bg-[#f1f4f2] dark:bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined">data_exploration</span>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase">Aujourd'hui</span>
      </div>
      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Analyste de Données Impact</h4>
      <p className="text-sm text-[#678373] mb-4">PASCI • Dakar, Sénégal</p>
      <div className="flex justify-between items-center pt-4 border-t border-[#f1f4f2] dark:border-white/10">
      <span className="text-xs font-bold text-primary">CDI • Dakar</span>
      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
      </div>
      </div>
      {/* <!-- Similar Offer Card 2 --> */}
      <div className="group bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-[#f1f4f2] dark:border-white/5">
      <div className="flex justify-between items-start mb-4">
      <div className="size-12 rounded-lg bg-[#f1f4f2] dark:bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined">volunteer_activism</span>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase">Hier</span>
      </div>
      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Coordonnateur RSE Senior</h4>
      <p className="text-sm text-[#678373] mb-4">PASCI • Abidjan, Côte d'Ivoire</p>
      <div className="flex justify-between items-center pt-4 border-t border-[#f1f4f2] dark:border-white/10">
      <span className="text-xs font-bold text-primary">CDI • Abidjan</span>
      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
      </div>
      </div>
      </div>
      </div>
    </main>


    </section>
  )
}