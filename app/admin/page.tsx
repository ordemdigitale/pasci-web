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
} from 'lucide-react';
import { ICrasc, IJobs } from '@/types/api.types';

export default function Dashboard() {
  const [crascData, setCrascData] = useState<ICrasc[] | null>(null);
  const [jobsData, setJobsData] = useState<IJobs[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch all crasc data
  useEffect(() => {
    const fetchCrascData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/v1/crasc/crasc");
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
        const response = await fetch("http://localhost:8000/api/v1/jobs");
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
  if (error) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-red-800">Erreur</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
            <Link
              href="/admin/gestion-des-crasc/type-de-osc"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <ArrowUpRight className="w-4 h-4" />
              +12%
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
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              +8%
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total OSC</p>
          <p className="text-3xl font-bold text-gray-900">3,176</p>
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
              +15%
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
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              +5%
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Utilisateurs actifs</p>
          <p className="text-3xl font-bold text-gray-900">1,245</p>
          <Link href="/admin/utilisateurs" className="text-[#2a591d] text-xs font-semibold mt-2 inline-block hover:underline">
            Gérer les utilisateurs →
          </Link>
        </div>
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
