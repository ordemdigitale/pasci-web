"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllRegion, deleteRegion } from "@/lib/fetch-crasc";
import { IRegionCivWithCrascName } from "@/localdata/helper/data";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Loader2,
  AlertTriangle,
  Building2
} from 'lucide-react';

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<IRegionCivWithCrascName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; region: IRegionCivWithCrascName | null }>({
    show: false,
    region: null
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      setLoading(true);
      const data = await fetchAllRegion();
      setRegions(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des régions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.region) return;

    setDeleting(true);
    try {
      await deleteRegion(deleteModal.region.slug);
      await loadRegions();
      setDeleteModal({ show: false, region: null });
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto font-poppins bg-slate-50 py-8 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#2A591D] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto font-poppins bg-slate-50 py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-green-600" />
              Gestion des Régions
            </h1>
            <p className="text-gray-600 mt-2">Gérez les régions administratives de Côte d'Ivoire</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/gestion-des-crasc"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              Retour
            </Link>
            <Link
              href="/admin/gestion-des-crasc/ajouter-region"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une région
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total des régions</p>
              <p className="text-3xl font-bold text-gray-900">{regions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Regions Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
        {regions.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune région</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter une région administrative</p>
            <Link
              href="/admin/gestion-des-crasc/ajouter-region"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter la première région
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Région
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    CRASC Associé
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regions.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">{region.region_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {region.crasc_region_name ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900">{region.crasc_region_name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {region.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/gestion-des-crasc/regions/${region.slug}/modifier`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                          title="Modifier la région"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Modifier
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, region })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                          title="Supprimer la région"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.region && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la région <strong>{deleteModal.region.region_name}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, region: null })}
                disabled={deleting}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
