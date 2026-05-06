/* app/admin/les-crasc/[crascSlug]/page.tsx: Page detail d'une Région CRASC */
"use client";

import React, { use, useState, useEffect } from "react";
import { getCrascBySlug, deleteCrasc } from "@/lib/fetch-crasc";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { ICrascDetail } from "@/types/api.types";
import Link from "next/link";
import { EditCrascForm } from "@/components/admin/EditCrascForm";
import CrascGuard from "@/components/auth/CrascGuard";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  Building2,
  Users,
  MapPin
} from 'lucide-react';


export default function AdminCrascPage({ params }: { params: Promise<{ crascSlug: string }>; }) {
  const resolvedParams = use(params);
  const crascSlug = resolvedParams.crascSlug;
  const router = useRouter();

  const [crascData, setCrascData] = useState<ICrascDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!crascSlug) return;
    let isCurrent = true;

    async function fetchCrasc() {
      try {
        setLoading(true);
        const data = await getCrascBySlug(crascSlug);
        if (isCurrent) setCrascData(data);
      } catch (err: any) {
        if (isCurrent) setError(err.message || "Impossible de charger les données du CRASC.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchCrasc();

    return () => {
      isCurrent = false;
    };
  }, [crascSlug]);

  const handleDelete = async () => {
    if (!crascData) return;

    setDeleting(true);
    try {
      await deleteCrasc(crascData.slug);
      router.push('/admin/gestion-des-crasc');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#2A591D] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !crascData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Erreur</h2>
          <p className="text-red-700">{error || "CRASC non trouvé."}</p>
        </div>
      </div>
    );
  }

  return (
    <CrascGuard crascId={crascData?.id}>
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/gestion-des-crasc"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la gestion des CRASC
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#2A591D]" />
            {crascData.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{crascData.name}</strong>? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
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

      {/* Edit Form or View Mode */}
      {isEditing ? (
        <EditCrascForm
          crasc={crascData}
          onSuccess={(updated) => {
            setCrascData(updated);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* OSC Count */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm text-gray-700 font-semibold">OSC Membres</h3>
              </div>
              <div className="text-4xl font-bold text-blue-600">{crascData.osc_count || 0}</div>
            </div>

            {/* Regions Count */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-sm text-gray-700 font-semibold">Régions et districts couverts</h3>
              </div>
              <div className="text-4xl font-bold text-green-600">{crascData.regions?.length || 0}</div>
            </div>

            {/* News Count */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm text-gray-700 font-semibold">Actualités</h3>
              </div>
              <div className="text-4xl font-bold text-orange-600">{crascData.news?.length || 0}</div>
            </div>
          </div>

          {/* Regions List */}
          {crascData.regions && crascData.regions.length > 0 && (
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Régions et districts du {crascData.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {crascData.regions.map((region) => (
                  <div key={region.id} className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-semibold text-green-800">
                    {region.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OSCs Section */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              OSC Membres ({crascData.oscs?.length || 0})
            </h3>
            {crascData.oscs?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune OSC trouvée.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crascData.oscs?.map((osc: any) => (
                  <div key={osc.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-[#2A591D] hover:shadow-md transition-all">
                    <div className="aspect-video overflow-hidden bg-gray-200">
                      <ImageWithFallback
                        alt={osc.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">{osc.name}</h4>
                      {osc.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {osc.description}
                        </p>
                      )}
                      {osc.type && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {osc.type.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
    </CrascGuard>
  )
}
