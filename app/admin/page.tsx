"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Map,
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  FileText,
  Briefcase,
  TrendingUp,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Newspaper,
  FolderOpen,
  Eye,
  Edit3,
  UserCircle,
  Target,
  Heart,
} from 'lucide-react';
import { ICrasc, IJobs, IOscDetail } from '@/types/api.types';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/lib/auth';

interface DashboardStats {
  crasc: { total: number };
  regions: { total: number };
  osc: { total: number; types: number };
  news: { total: number; recent_30_days: number };
  jobs: { total: number; active: number; recent_30_days: number };
  users: { total: number };
}

interface VisiteStats {
  total: number;
  visiteurs_uniques: number;
  aujourd_hui: number;
  hier: number;
  "7_jours": number;
  "30_jours": number;
  top_pages: { path: string; visites: number }[];
  par_jour: { date: string; visites: number }[];
}

function OscDashboard() {
  const { user } = useAuth();
  const [osc, setOsc] = useState<IOscDetail | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/api/v1/crasc/osc/me`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setOsc(data); })
      .catch(() => {});
  }, []);

  const Stat = ({ label, value, color }: { label: string; value: any; color: string }) => (
    <div className={`p-4 rounded-xl ${color}`}>
      <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
    </div>
  );

  return (
    <div className="p-6 font-poppins space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 text-white shadow-xl">
        <p className="text-white/70 text-sm mb-1">Bienvenue,</p>
        <h1 className="text-2xl font-extrabold mb-1">{osc?.name || user?.email}</h1>
        {osc?.crasc && (
          <p className="text-white/70 text-sm">{osc.crasc.name}</p>
        )}
      </div>

      {/* Stats OSC */}
      {osc && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2A591D]" /> Aperçu de votre OSC
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label="Membres total" value={osc.nb_membres} color="bg-blue-50" />
            <Stat label="Femmes membres" value={osc.nb_femmes_membres} color="bg-pink-50" />
            <Stat label="Membres jeunes" value={osc.nb_membres_jeunes} color="bg-yellow-50" />
            <Stat label="Personnes engagées" value={osc.nb_personnes_engagees} color="bg-green-50" />
            <Stat label="Bénéficiaires" value={osc.nb_beneficiaires} color="bg-purple-50" />
            <Stat label="Activités réalisées" value={osc.nb_activites} color="bg-orange-50" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-col gap-3">
          <Link
            href="/admin/mon-osc"
            className="flex items-center gap-3 px-4 py-3 bg-green-50 text-[#2A591D] rounded-xl hover:bg-[#2A591D] hover:text-white transition-all group"
          >
            <Building2 className="w-5 h-5" />
            <span className="font-semibold">Voir mon profil OSC</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/admin/mon-osc/modifier"
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all group"
          >
            <Edit3 className="w-5 h-5" />
            <span className="font-semibold">Modifier mon profil</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          {osc?.slug && (
            <Link
              href={`/annuaire/annuaire-des-osc/${osc.slug}`}
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all group"
            >
              <Eye className="w-5 h-5" />
              <span className="font-semibold">Voir mon profil public</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isOscUser = !!user?.osc_id && !user?.is_staff && !user?.is_superuser;

  const [crascData, setCrascData] = useState<ICrasc[] | null>(null);
  const [jobsData, setJobsData] = useState<IJobs[] | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [visiteStats, setVisiteStats] = useState<VisiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  if (isOscUser) return <OscDashboard />;

  // fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/stats/dashboard`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setDashboardStats(result);
      } catch (err) {
        console.log("Error fetching dashboard stats:", err);
      }
    };
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/visites/stats`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setVisiteStats(data); })
      .catch(() => {});
  }, []);

  // fetch all crasc data
  useEffect(() => {
    const fetchCrascData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/crasc/crasc`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        setCrascData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrascData();
  }, [])

  // fetch job offers
  useEffect(() => {
    const fetchJobsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/jobs`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        setJobsData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobsData();
  }, [])

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue sur votre espace d'administration PASCI
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats CRASC */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Map className="w-6 h-6 text-[#2a591d]" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <Activity className="w-4 h-4" />
              {dashboardStats?.regions.total || 0} régions et districts
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Nombre de CRASC</p>
          <p className="text-3xl font-bold text-gray-900">{crascData?.length || 0}</p>
          <Link href="/admin/gestion-des-crasc" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Voir détails →
          </Link>
        </div>

        {/* Stats OSC */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
              <Activity className="w-4 h-4" />
              {dashboardStats?.osc.types || 0} types
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total OSC</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardStats?.osc.total.toLocaleString() || 0}</p>
          <Link href="/admin/gestion-des-crasc/osc" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Gérer les OSC →
          </Link>
        </div>

        {/* Stats Emplois */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              {dashboardStats?.jobs.recent_30_days ? `+${dashboardStats.jobs.recent_30_days}` : '+0'}
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Offres d'emploi</p>
          <p className="text-3xl font-bold text-gray-900">{jobsData?.length || 0}</p>
          <Link href="/admin/emplois" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Gérer les offres →
          </Link>
        </div>

        {/* Stats Utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm font-semibold">
              <Activity className="w-4 h-4" />
              Actifs
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Utilisateurs</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardStats?.users.total.toLocaleString() || 0}</p>
          <Link href="/admin/utilisateurs" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Gérer les utilisateurs →
          </Link>
        </div>
      </div>

      {/* Visites */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Eye className="w-5 h-5 text-[#E05017]" />
          <h2 className="text-xl font-bold text-gray-900">Visites de la plateforme</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#E05017]/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Aujourd'hui</p>
            <p className="text-2xl font-bold text-[#E05017]">{(visiteStats?.aujourd_hui ?? 0).toLocaleString("fr-FR")}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">7 derniers jours</p>
            <p className="text-2xl font-bold text-gray-900">{(visiteStats?.["7_jours"] ?? 0).toLocaleString("fr-FR")}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">30 derniers jours</p>
            <p className="text-2xl font-bold text-gray-900">{(visiteStats?.["30_jours"] ?? 0).toLocaleString("fr-FR")}</p>
          </div>
          <div className="bg-[#2a591d]/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total visites</p>
            <p className="text-2xl font-bold text-[#2a591d]">{(visiteStats?.total ?? 0).toLocaleString("fr-FR")}</p>
            <p className="text-xs text-gray-400 mt-1">{(visiteStats?.visiteurs_uniques ?? 0).toLocaleString("fr-FR")} visiteurs uniques</p>
          </div>
        </div>

        {/* Histogramme 7 jours */}
        {(visiteStats?.par_jour?.length ?? 0) > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Visites par jour (7 jours)</p>
            <div className="flex items-end gap-2 h-16">
              {visiteStats!.par_jour.map((j) => {
                const max = Math.max(...visiteStats!.par_jour.map((x) => x.visites), 1);
                const pct = Math.round((j.visites / max) * 100);
                return (
                  <div key={j.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">{j.visites}</span>
                    <div
                      className="w-full bg-[#E05017] rounded-t-md"
                      style={{ height: `${Math.max(pct, 4)}%`, minHeight: "4px" }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {new Date(j.date).toLocaleDateString("fr-FR", { weekday: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top pages */}
        {(visiteStats?.top_pages?.length ?? 0) > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Pages les plus visitées</p>
            <div className="space-y-2">
              {visiteStats!.top_pages.map((p, i) => {
                const max = visiteStats!.top_pages[0].visites;
                const pct = Math.round((p.visites / max) * 100);
                return (
                  <div key={p.path} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-sm text-gray-700 truncate">{p.path || "/"}</span>
                        <span className="text-sm font-semibold text-gray-900 ml-2">{p.visites}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2a591d] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!visiteStats && (
          <p className="text-sm text-gray-400 text-center py-4">Chargement des statistiques…</p>
        )}
      </div>

      {/* CRASC Overview Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Aperçu des CRASC</h2>
          <Link
            href="/admin/gestion-des-crasc"
            className="text-[#2a591d] text-sm font-semibold hover:underline flex items-center gap-1"
          >
            Voir tous
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {crascData && crascData.map((crasc) => (
            <div
              key={crasc.id}
              className="p-4 bg-gradient-to-br from-green-50 to-white border border-gray-200 rounded-lg hover:border-[#2a591d] hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-[#2a591d] transition-colors">
                  <Map className="w-4 h-4 text-[#2a591d] group-hover:text-white transition-colors" />
                </div>
              </div>
              <p className="text-gray-900 font-semibold text-sm mb-2">{crasc.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-xs">OSC</p>
                <p className="text-[#2a591d] font-bold text-lg">{crasc.osc_count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2a591d]" />
              Activités récentes
            </h2>
            <button className="text-[#2a591d] text-sm font-semibold hover:underline">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="w-4 h-4 text-[#2a591d]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Nouvelle OSC enregistrée</p>
                <p className="text-gray-600 text-sm">Association pour le Développement Rural a été ajoutée</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="text-gray-400 text-xs">Il y a 2 heures</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Offre d'emploi publiée</p>
                <p className="text-gray-600 text-sm">Coordinateur de projet - Save The Children</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="text-gray-400 text-xs">Il y a 3 heures</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Newspaper className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Actualité publiée</p>
                <p className="text-gray-600 text-sm">Lancement du nouveau programme de formation CRASC 2026</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="text-gray-400 text-xs">Il y a 5 heures</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Nouvel utilisateur</p>
                <p className="text-gray-600 text-sm">Jean-Baptiste KOFFI a créé un compte</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="text-gray-400 text-xs">Il y a 1 jour</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FolderOpen className="w-4 h-4 text-[#2a591d]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Ressource ajoutée</p>
                <p className="text-gray-600 text-sm">Guide de rédaction de propositions de projets (PDF)</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="text-gray-400 text-xs">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
          <div className="flex flex-col space-y-3">
            <Link
              href="/admin/gestion-des-crasc/osc/ajouter-osc"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 text-[#2a591d] rounded-lg hover:from-[#2a591d] hover:to-green-700 hover:text-white transition-all group"
            >
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Ajouter une OSC</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/admin/actualites"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all group"
            >
              <Newspaper className="w-5 h-5" />
              <span className="font-medium">Poster une actualité</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/admin/emplois"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-700 hover:text-white transition-all group"
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Poster une offre d'emploi</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/admin/ressources"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-600 hover:to-orange-700 hover:text-white transition-all group"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Ajouter une ressource</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/admin/projets"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 rounded-lg hover:from-teal-600 hover:to-teal-700 hover:text-white transition-all group"
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Créer un projet</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
