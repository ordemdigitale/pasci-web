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
  UserPlus,
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
  pages_vues?: number;
  aujourd_hui: number;
  hier: number;
  "7_jours": number;
  "30_jours": number;
  top_pages: { path: string; visites: number }[];
  par_jour: { date: string; visites: number }[];
}

/** Compteurs et activités récentes réels (GET /stats/back-office, limités au CRASC du compte). */
interface BackOfficeStats {
  compteurs: {
    actualites_publiees: number;
    actualites_en_attente: number;
    adhesions_en_attente: number;
    adhesions_total: number;
    offres_emploi_actives: number;
  };
  activites: { type: string; titre: string; detail: string; date: string; lien: string }[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function useBackOfficeStats(limite: number) {
  const [stats, setStats] = useState<BackOfficeStats | null>(null);
  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/stats/back-office?limite=${limite}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setStats(data); })
      .catch(() => {});
  }, [limite]);
  return stats;
}

function ilYa(date: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  const heures = Math.round(minutes / 60);
  if (heures < 24) return `Il y a ${heures} heure${heures > 1 ? "s" : ""}`;
  const jours = Math.round(heures / 24);
  if (jours < 31) return `Il y a ${jours} jour${jours > 1 ? "s" : ""}`;
  return `Le ${new Date(date).toLocaleDateString("fr-FR")}`;
}

const ICONES_ACTIVITE: Record<string, { icone: typeof Building2; fond: string; couleur: string }> = {
  osc: { icone: Building2, fond: "bg-green-100", couleur: "text-[#2a591d]" },
  adhesion: { icone: UserPlus, fond: "bg-amber-100", couleur: "text-amber-600" },
  actualite: { icone: Newspaper, fond: "bg-blue-100", couleur: "text-blue-600" },
  emploi: { icone: Briefcase, fond: "bg-purple-100", couleur: "text-purple-600" },
  utilisateur: { icone: Users, fond: "bg-orange-100", couleur: "text-orange-600" },
  ressource: { icone: FolderOpen, fond: "bg-green-100", couleur: "text-[#2a591d]" },
  formation: { icone: GraduationCap, fond: "bg-teal-100", couleur: "text-teal-600" },
};

function ActivitesRecentes({ className = "" }: { className?: string }) {
  const [toutes, setToutes] = useState(false);
  const stats = useBackOfficeStats(toutes ? 30 : 8);
  const activites = stats?.activites ?? [];
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2a591d]" />
          Activités récentes
        </h2>
        {activites.length >= 8 && (
          <button type="button" onClick={() => setToutes(!toutes)} className="text-[#2a591d] text-sm font-semibold hover:underline">
            {toutes ? "Voir moins" : "Voir tout"}
          </button>
        )}
      </div>
      {!stats ? (
        <p className="text-sm text-gray-400 text-center py-4">Chargement…</p>
      ) : activites.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Aucune activité pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {activites.map((a, i) => {
            const style = ICONES_ACTIVITE[a.type] ?? ICONES_ACTIVITE.osc;
            const Icone = style.icone;
            return (
              <Link
                key={`${a.type}-${a.date}-${i}`}
                href={a.lien}
                className={`flex items-start gap-4 pb-4 rounded-lg hover:bg-gray-50 ${i < activites.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className={`p-2 rounded-lg ${style.fond}`}>
                  <Icone className={`w-4 h-4 ${style.couleur}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium">{a.titre}</p>
                  <p className="text-gray-600 text-sm truncate">{a.detail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p className="text-gray-400 text-xs">{ilYa(a.date)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
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

function CrascAdminDashboard() {
  const { user } = useAuth();
  const [crascName, setCrascName] = useState<string | null>(null);
  const [oscCount, setOscCount] = useState<number | null>(null);
  const [formationsCount, setFormationsCount] = useState<number | null>(null);
  const backOffice = useBackOfficeStats(8);
  const compteurs = backOffice?.compteurs;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!user?.crasc_id) return;
    const crascId = user.crasc_id;

    // Fetch CRASC list to find the matching one
    fetch(`${API_BASE_URL}/api/v1/crasc/crasc`)
      .then((r) => r.ok ? r.json() : [])
      .then((list: any[]) => {
        const mine = list.find((c) => c.id === crascId || Number(c.id) === crascId);
        if (mine) {
          setCrascName(mine.name);
          setOscCount(mine.osc_count ?? null);
        }
      })
      .catch(() => {});

    // Fetch formations count for this CRASC
    fetchWithAuth(`${API_BASE_URL}/api/v1/formations?crasc_id=${crascId}&limit=100`)
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => { if (Array.isArray(data)) setFormationsCount(data.length); })
      .catch(() => {});
  }, [user?.crasc_id]);

  return (
    <div className="p-6 font-poppins space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 text-white shadow-xl">
        <p className="text-white/70 text-sm mb-1">Bienvenue,</p>
        <h1 className="text-2xl font-extrabold mb-1">{user?.first_name || user?.email}</h1>
        {crascName && <p className="text-white/70 text-sm">{crascName}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">OSC</p>
          <p className="text-3xl font-bold text-gray-900">{oscCount ?? "—"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Actualités publiées</p>
          <p className="text-3xl font-bold text-gray-900">{compteurs?.actualites_publiees ?? "—"}</p>
          {!!compteurs?.actualites_en_attente && (
            <Link href="/admin/moderation" className="text-xs text-amber-600 hover:underline">{compteurs.actualites_en_attente} en attente</Link>
          )}
        </div>
        <Link href="/admin/demandes-adhesion" className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-amber-300">
          <p className="text-xs text-gray-500 mb-1">Demandes d&apos;adhésion</p>
          <p className="text-3xl font-bold text-gray-900">{compteurs?.adhesions_en_attente ?? "—"}</p>
          <p className="text-xs text-gray-400">en attente sur {compteurs?.adhesions_total ?? "—"}</p>
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Formations</p>
          <p className="text-3xl font-bold text-gray-900">{formationsCount ?? "—"}</p>
        </div>
      </div>

      <ActivitesRecentes />

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Accès rapides</h2>
        <div className="flex flex-col gap-3">
          <Link
            href="/admin/gestion-des-crasc"
            className="flex items-center gap-3 px-4 py-3 bg-green-50 text-[#2A591D] rounded-xl hover:bg-[#2A591D] hover:text-white transition-all group"
          >
            <Map className="w-5 h-5" />
            <span className="font-semibold">Mon CRASC</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/admin/actualites"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all group"
          >
            <Newspaper className="w-5 h-5" />
            <span className="font-semibold">Actualités</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/admin/formations"
            className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-600 hover:text-white transition-all group"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-semibold">Formations</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isOscUser = !!user?.osc_id && !user?.is_staff && !user?.is_superuser;
  const isCrascAdmin = !!user?.is_staff && !user?.is_superuser && !!user?.crasc_id;

  // Un composant par profil : les hooks ne dépendent plus du compte chargé
  if (isOscUser) return <OscDashboard />;
  if (isCrascAdmin) return <CrascAdminDashboard />;
  return <SuperAdminDashboard />;
}

function SuperAdminDashboard() {
  const [crascData, setCrascData] = useState<ICrasc[] | null>(null);
  const [jobsData, setJobsData] = useState<IJobs[] | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [visiteStats, setVisiteStats] = useState<VisiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const compteurs = useBackOfficeStats(8)?.compteurs;

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
          Bienvenue sur votre espace d'administration PdoC
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          <p className="text-3xl font-bold text-gray-900">{dashboardStats?.jobs.total ?? jobsData?.length ?? 0}</p>
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

        {/* Stats Actualités */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Newspaper className="w-6 h-6 text-blue-600" />
            </div>
            {!!compteurs?.actualites_en_attente && (
              <Link href="/admin/moderation" className="flex items-center gap-1 text-amber-600 text-sm font-semibold hover:underline">
                {compteurs.actualites_en_attente} à valider
              </Link>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-1">Actualités publiées</p>
          <p className="text-3xl font-bold text-gray-900">{(compteurs?.actualites_publiees ?? 0).toLocaleString("fr-FR")}</p>
          <Link href="/admin/actualites" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Gérer les actualités →
          </Link>
        </div>

        {/* Stats Demandes d'adhésion */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm font-semibold">
              {(compteurs?.adhesions_total ?? 0).toLocaleString("fr-FR")} au total
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Demandes d&apos;adhésion en attente</p>
          <p className="text-3xl font-bold text-gray-900">{(compteurs?.adhesions_en_attente ?? 0).toLocaleString("fr-FR")}</p>
          <Link href="/admin/demandes-adhesion" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Traiter les demandes →
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
            <p className="text-xs text-gray-500 mb-1">Total connexions</p>
            <p className="text-2xl font-bold text-[#2a591d]">{(visiteStats?.total ?? 0).toLocaleString("fr-FR")}</p>
            <p className="text-xs text-gray-400 mt-1">{(visiteStats?.pages_vues ?? 0).toLocaleString("fr-FR")} pages vues</p>
            {/* Les connexions ne sont mesurées que depuis la mise en place de
                l'identifiant de session : sans ce repère, le chiffre paraît
                anormalement bas face aux pages vues cumulées depuis l'ouverture. */}
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">Connexions comptées depuis le 5 nov. 2026</p>
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
        {/* Activités récentes (réelles) */}
        <ActivitesRecentes className="lg:col-span-2" />

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
