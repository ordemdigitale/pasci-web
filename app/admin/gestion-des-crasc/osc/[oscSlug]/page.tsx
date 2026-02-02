"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";

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

  // Charger les données de l'OSC
  useEffect(() => {
    const fetchOsc = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8000/api/v1/crasc/osc/${oscSlug}`,
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
  }, [oscSlug]);

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
        `http://localhost:8000/api/v1/crasc/osc/${oscSlug}`,
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
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
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
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-6 h-6 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
              href="/admin/gestion-des-crasc/osc"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!osc) return null;

  return (
    <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-4 md:p-8">
      {/* En-tête */}
      <Link
        href="/admin/gestion-des-crasc/osc"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4"
      >
        ← Retour à la liste des OSC
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Détails de l'OSC</h1>
          <p className="text-gray-600 mt-1">{osc.name}</p>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Informations de l'OSC */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        {/* Logo/Image */}
        <div className="h-48 bg-gray-100 relative">
          <ImageWithFallback
            src={osc.thumbnail_url || "/images/default-osc-logo.png"}
            alt={osc.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Détails */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Nom</h3>
            <p className="text-lg font-semibold text-gray-900">{osc.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Slug</h3>
            <p className="font-mono text-sm text-gray-700">{osc.slug}</p>
          </div>

          {osc.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Description
              </h3>
              <p className="text-gray-700">{osc.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Type d'OSC
              </h3>
              <p className="text-gray-900">
                {osc.type?.name || "Non spécifié"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">CRASC</h3>
              <p className="text-gray-900">
                {osc.crasc?.name || "Non spécifié"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ville</h3>
              <p className="text-gray-900">{osc.ville || "Non spécifié"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900">
                {osc.email ? (
                  <a
                    href={`mailto:${osc.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {osc.email}
                  </a>
                ) : (
                  "Non spécifié"
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Téléphone
              </h3>
              <p className="text-gray-900">
                {osc.phone ? (
                  <a
                    href={`tel:${osc.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {osc.phone}
                  </a>
                ) : (
                  "Non spécifié"
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Adresse
              </h3>
              <p className="text-gray-900">{osc.address || "Non spécifié"}</p>
            </div>
          </div>

          {(osc.latitude || osc.longitude) && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Coordonnées GPS
              </h3>
              <p className="text-gray-700 font-mono text-sm">
                {osc.latitude}, {osc.longitude}
              </p>
            </div>
          )}

          {osc.news_items && osc.news_items.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Actualités publiées
              </h3>
              <p className="text-gray-900">{osc.news_items.length} article(s)</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/admin/gestion-des-crasc/osc/ajouter-osc?edit=${osc.slug}`}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
        >
          Modifier cette OSC
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Suppression..." : "Supprimer cette OSC"}
        </button>
      </div>

      {/* Avertissement */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 className="font-medium text-yellow-800">Attention</h3>
            <p className="text-yellow-700 text-sm mt-1">
              La suppression d'une OSC est irréversible. Toutes les actualités et
              données associées seront également affectées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
