"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search, Mail, Phone, Globe } from 'lucide-react';

interface IPTF {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  country: string;
  active: boolean;
}

// Mock data - À remplacer par un vrai fetch API
const mockPTFs: IPTF[] = [
  {
    id: 1,
    name: "Union Européenne",
    slug: "union-europeenne",
    type: "Organisation Internationale",
    description: "Partenaire majeur dans le financement de projets de développement",
    email: "contact@eu-ci.org",
    phone: "+225 XX XX XX XX",
    website: "www.eu-ci.org",
    country: "International",
    active: true
  },
  {
    id: 2,
    name: "Banque Mondiale",
    slug: "banque-mondiale",
    type: "Institution Financière",
    description: "Financement de projets d'infrastructure et de développement social",
    email: "contact@worldbank-ci.org",
    phone: "+225 XX XX XX XX",
    website: "www.worldbank.org",
    country: "International",
    active: true
  },
  {
    id: 3,
    name: "AFD - Agence Française de Développement",
    slug: "afd",
    type: "Agence de Développement",
    description: "Appui au développement durable en Côte d'Ivoire",
    email: "contact@afd-ci.org",
    phone: "+225 XX XX XX XX",
    website: "www.afd.fr",
    country: "France",
    active: true
  },
  {
    id: 4,
    name: "USAID",
    slug: "usaid",
    type: "Agence de Développement",
    description: "Agence américaine pour le développement international",
    email: "contact@usaid-ci.org",
    website: "www.usaid.gov",
    country: "États-Unis",
    active: false
  }
];

export default function GestionPTFPage() {
  const [ptfs, setPtfs] = useState<IPTF[]>(mockPTFs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(false);

  const filteredPTFs = ptfs.filter(ptf => {
    const matchesSearch = ptf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ptf.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ptf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && ptf.active) ||
                         (filterStatus === 'inactive' && !ptf.active);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce PTF ?')) {
      setPtfs(ptfs.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setPtfs(ptfs.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des PTF</h1>
              <p className="text-gray-600 mt-1">Gérez les Partenaires Techniques et Financiers</p>
            </div>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Ajouter un PTF
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total des PTF</p>
                <p className="text-3xl font-bold text-gray-900">{ptfs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {ptfs.filter(p => p.active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactifs</p>
                <p className="text-3xl font-bold text-gray-600">
                  {ptfs.filter(p => !p.active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un PTF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* PTF List */}
        <div className="space-y-4">
          {filteredPTFs.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun PTF trouvé</p>
            </div>
          ) : (
            filteredPTFs.map((ptf) => (
              <div key={ptf.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{ptf.name}</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                            {ptf.type}
                          </span>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            ptf.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ptf.active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{ptf.description}</p>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      {ptf.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${ptf.email}`} className="hover:text-[#E05017]">
                            {ptf.email}
                          </a>
                        </div>
                      )}
                      {ptf.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${ptf.phone}`} className="hover:text-[#E05017]">
                            {ptf.phone}
                          </a>
                        </div>
                      )}
                      {ptf.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a
                            href={`https://${ptf.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#E05017]"
                          >
                            {ptf.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-4 h-4 flex items-center justify-center text-gray-400">🌍</span>
                        <span>{ptf.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Link
                      href={`/annuaire/annuaire-des-partenaires-techniques-et-financiers/${ptf.slug}`}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(ptf.id)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                        ptf.active
                          ? 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                          : 'border border-green-300 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {ptf.active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(ptf.id)}
                      className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← Retour au tableau de bord
          </Link>
        </div>

      </div>
    </div>
  );
}
