"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/lib/imageWithFallback'
import { IPTF } from '@/types/api.types';
import Link from 'next/link';
import { Loader2, Building2, Search } from 'lucide-react';
import { useTypesPtf } from '@/lib/ptf-classification';
import TaskForcesThematiques from '@/components/ptf/TaskForcesThematiques';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PageAnnuairePTF() {
  const [ptfData, setPtfData] = useState<IPTF[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Classification par types (Institutions multilatérales, Agences spécialisées…)
  const types = useTypesPtf();
  const [typeChoisi, setTypeChoisi] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/ptf`);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const result = await response.json();
        setPtfData(result);
      } catch (err: any) {
        setError("Impossible de charger les PTF.");
        console.error("Erreur chargement PTF:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white font-poppins">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h1 className="text-[#2a591d] font-extrabold text-2xl md:text-4xl text-center">
          Annuaire des Partenaires Techniques et Financiers (PTF)
        </h1>
      </div>

      {/* Section Introduction */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Consultez la base de données des partenaires techniques et financiers sur la PdoC. <br />
                Cette base vous aide à identifier et choisir les partenaires techniques et financiers adaptés à vos besoins. Vous y découvrirez leurs spécificités, leurs domaines de financement, leurs périodes et zones d'intervention et leurs orientations stratégiques.
              </p>
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg"
                alt="Collaboration et partenariat"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PTF Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Barre de recherche */}
        {ptfData.length > 0 && (
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un partenaire par nom ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 text-sm">⚠️ {error}</p>
          </div>
        )}

        {!error && ptfData.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun partenaire disponible pour le moment.</p>
          </div>
        )}

        {ptfData.length > 0 && (() => {
          const q = searchQuery.toLowerCase();
          const filtered = ptfData.filter(ptf =>
            (!typeChoisi || (ptf.categorie || 'Autres') === typeChoisi) && (
              ptf.name.toLowerCase().includes(q) ||
              (ptf.description || '').toLowerCase().includes(q) ||
              (ptf.categorie || '').toLowerCase().includes(q)
            )
          );
          // Regroupement par type, dans l'ordre de la classification (sans type = « Autres »)
          const ordre = types.map((t) => t.nom);
          const groupes = Array.from(new Set([...ordre, ...filtered.map((p) => p.categorie || 'Autres')]))
            .map((nom) => ({ nom, ptfs: filtered.filter((p) => (p.categorie || 'Autres') === nom) }))
            .filter((g) => g.ptfs.length > 0);
          const typesAffiches = types.filter((t) => ptfData.some((p) => (p.categorie || 'Autres') === t.nom));

          const carte = (ptf: typeof ptfData[number]) => (
            <Link
              key={ptf.id}
              href={`/annuaire/annuaire-des-partenaires-techniques-et-financiers/${ptf.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#2a591d]/30 transition-all duration-300 h-full">
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-8 border-b-2 border-gray-200 group-hover:bg-gray-100 transition-colors">
                  {ptf.thumbnail_url ? (
                    <ImageWithFallback src={ptf.thumbnail_url} alt={ptf.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-16 h-16 text-gray-300" />
                  )}
                </div>
                <div className="p-6 text-center">
                  {ptf.categorie && (
                    <span className="inline-block mb-2 px-2 py-0.5 text-xs font-bold bg-[#2a591d]/10 text-[#2a591d] rounded-full">
                      {ptf.categorie}
                    </span>
                  )}
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#2a591d] transition-colors">{ptf.name}</h3>
                  {ptf.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{ptf.description}</p>
                  )}
                </div>
              </div>
            </Link>
          );

          return (
            <>
              {/* Types de PTF */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                <button
                  onClick={() => setTypeChoisi('')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${!typeChoisi ? 'bg-[#2a591d] text-white border-[#2a591d]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#2a591d]/40'}`}
                >
                  Tous ({ptfData.length})
                </button>
                {typesAffiches.map((t) => {
                  const nb = ptfData.filter((p) => (p.categorie || 'Autres') === t.nom).length;
                  return (
                    <button
                      key={t.nom}
                      onClick={() => setTypeChoisi(t.nom)}
                      title={t.description || undefined}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${typeChoisi === t.nom ? 'bg-[#2a591d] text-white border-[#2a591d]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#2a591d]/40'}`}
                    >
                      {t.nom} ({nb})
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun résultat{searchQuery ? <> pour &quot;{searchQuery}&quot;</> : null}</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {groupes.map((g) => (
                    <div key={g.nom}>
                      <h2 className="text-xl font-bold text-[#2a591d] mb-1">{g.nom}</h2>
                      {types.find((t) => t.nom === g.nom)?.description && (
                        <p className="text-sm text-gray-500 mb-5">{types.find((t) => t.nom === g.nom)?.description}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {g.ptfs.map(carte)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {/* Task forces thématiques */}
        <TaskForcesThematiques />
      </div>

    </section>
  );
}
