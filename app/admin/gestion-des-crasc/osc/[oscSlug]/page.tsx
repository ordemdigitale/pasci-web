"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Tag,
  Trash2,
  Edit,
  AlertTriangle,
  Newspaper,
} from "lucide-react";

interface IOscDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string;
  thumbnail_path: string;
  type?: {
    id: number;
    name: string;
    slug: string;
  };
  crasc?: {
    id: number;
    name: string;
    slug: string;
  };
  ville: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  news_items?: any[];
}

export default function OscDetailPage() {
  const router = useRouter();
  const params = useParams();
  const oscSlug = params.oscSlug as string;

  const [loading, setLoading] = useState(true);
  const [osc, setOsc] = useState<IOscDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Charger les données de l'OSC
  useEffect(() => {
    const fetchOsc = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("OSC non trouvée");
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setOsc(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    if (oscSlug) {
      fetchOsc();
    }
  }, [oscSlug, API_BASE_URL]);

  // Supprimer l'OSC
  const handleDelete = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette OSC ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        router.push("/admin/gestion-des-crasc/osc");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.detail || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur réseau lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !osc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
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
                href="/admin/gestion-des-crasc/osc"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour à la liste
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!osc) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec breadcrumb */}
        <Link
          href="/admin/gestion-des-crasc/osc"
          className="inline-flex items-center gap-2 text-sm text-[#2a591d] hover:text-[#1f4315] mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des OSC
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm flex-shrink-0 border-2 border-white/30">
              <ImageWithFallback
                src={osc.thumbnail_url || "/images/default-osc-logo.png"}
                alt={osc.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{osc.name}</h1>
              {osc.description && (
                <p className="text-white/90 text-sm leading-relaxed">{osc.description}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                {osc.type && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {osc.type.name}
                  </span>
                )}
                {osc.crasc && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {osc.crasc.name}
                  </span>
                )}
                {osc.ville && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {osc.ville}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Informations de contact */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Informations de contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  {osc.email ? (
                    <a
                      href={`mailto:${osc.email}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {osc.email}
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm">Non spécifié</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </div>
                  {osc.phone ? (
                    <a
                      href={`tel:${osc.phone}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {osc.phone}
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm">Non spécifié</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </div>
                  <p className="text-gray-900">{osc.address || "Non spécifié"}</p>
                </div>

                {(osc.latitude || osc.longitude) && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                      <Globe className="w-4 h-4" />
                      Coordonnées GPS
                    </div>
                    <p className="text-gray-700 font-mono text-sm">
                      {osc.latitude}, {osc.longitude}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="space-y-6">
            {/* Carte Type */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Type d'OSC</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {osc.type?.name || "Non spécifié"}
              </p>
            </div>

            {/* Carte CRASC */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-[#2a591d]" />
                </div>
                <h3 className="font-bold text-gray-900">CRASC</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {osc.crasc?.name || "Non spécifié"}
              </p>
            </div>

            {/* Carte Actualités */}
            {osc.news_items && osc.news_items.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Newspaper className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Actualités</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {osc.news_items.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">article(s) publié(s)</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link
            href={`/admin/gestion-des-crasc/osc/${osc.slug}/modifier`}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Modifier cette OSC
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            {deleting ? "Suppression..." : "Supprimer cette OSC"}
          </button>
        </div>

        {/* Avertissement */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Attention</h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                La suppression d'une OSC est irréversible. Toutes les actualités et
                données associées seront également affectées. Assurez-vous de bien
                vérifier avant de procéder à la suppression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
