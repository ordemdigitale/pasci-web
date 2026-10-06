"use client";

import { useEffect, useMemo, useState } from 'react';
import { ICrascDetail } from '@/types/api.types';
import { updateCrasc } from '@/lib/fetch-crasc';
import { API_ENDPOINTS } from '@/lib/api-config';
import { Save, X, Loader2, AlertCircle, CheckCircle, MapPin, Search } from 'lucide-react';

interface IRegion { id: number; name: string }
interface ICrascExistant { id: number; name: string; regions?: { id: number; name: string }[] }

interface EditCrascFormProps {
    crasc: ICrascDetail;
    onSuccess?: (updatedCrasc: ICrascDetail) => void;
    onCancel?: () => void;
}

export function EditCrascForm({ crasc, onSuccess, onCancel }: EditCrascFormProps) {
    const [formData, setFormData] = useState({
        name: crasc.name || '',
        description: crasc.description || '',
        email_pca: (crasc as any).email_pca || '',
    });

    // Les régions définissent la zone du CRASC : elles s'éditent ici comme
    // à la création, et une région ne peut appartenir qu'à un seul CRASC.
    const [regions, setRegions] = useState<IRegion[]>([]);
    const [crascs, setCrascs] = useState<ICrascExistant[]>([]);
    const [regionsChoisies, setRegionsChoisies] = useState<number[]>(
        (crasc.regions ?? []).map((region) => Number(region.id)),
    );
    const [recherche, setRecherche] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`${API_ENDPOINTS.region.list}?limit=200`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setRegions(Array.isArray(data) ? data : data?.items ?? []))
            .catch(() => setRegions([]));
        fetch(`${API_ENDPOINTS.crasc.list}?limit=50`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setCrascs(Array.isArray(data) ? data : []))
            .catch(() => setCrascs([]));
    }, []);

    // Régions déjà prises par un *autre* CRASC : affichées mais verrouillées.
    const crascParRegion = useMemo(() => {
        const index = new Map<number, string>();
        crascs
            .filter((autre) => Number(autre.id) !== Number(crasc.id))
            .forEach((autre) => (autre.regions ?? []).forEach((region) => index.set(Number(region.id), autre.name)));
        return index;
    }, [crascs, crasc.id]);

    const regionsFiltrees = useMemo(() => {
        const terme = recherche.trim().toLowerCase();
        return terme ? regions.filter((region) => region.name.toLowerCase().includes(terme)) : regions;
    }, [regions, recherche]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (regionsChoisies.length === 0) {
            setError('Un CRASC doit couvrir au moins une région.');
            setLoading(false);
            return;
        }

        try {
            const updated = await updateCrasc(crasc.slug, { ...formData, region_ids: regionsChoisies });
            setSuccess(true);

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess({ ...crasc, ...updated });
            }

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Modifier le CRASC</h3>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800 font-medium">CRASC mis à jour avec succès!</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom du CRASC <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E05017] focus:ring-2 focus:ring-[#E05017]/20 outline-none transition-all"
                        placeholder="Ex: CRASC SUD"
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E05017] focus:ring-2 focus:ring-[#E05017]/20 outline-none transition-all resize-none"
                        placeholder="Description du CRASC..."
                    />
                </div>

                {/* Email PCA Field */}
                <div>
                    <label htmlFor="email_pca" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email du PCA du CRASC
                    </label>
                    <input
                        type="email"
                        id="email_pca"
                        name="email_pca"
                        value={formData.email_pca}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E05017] focus:ring-2 focus:ring-[#E05017]/20 outline-none transition-all"
                        placeholder="pca-crasc@exemple.org"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Cet email recevra une copie des messages de contact envoyés via le site.
                    </p>
                </div>

                {/* Régions couvertes */}
                <div>
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Régions couvertes <span className="text-red-500">*</span>
                        </label>
                        <span className="text-sm text-gray-500">
                            {regionsChoisies.length} sélectionnée{regionsChoisies.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Filtrer les régions…"
                            className="w-full rounded-lg border-2 border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#E05017]"
                        />
                    </div>

                    <div className="max-h-64 overflow-y-auto rounded-lg border-2 border-gray-200 p-2">
                        {regionsFiltrees.length === 0 ? (
                            <p className="p-4 text-center text-sm text-gray-400">Aucune région.</p>
                        ) : (
                            <div className="grid gap-1 sm:grid-cols-2">
                                {regionsFiltrees.map((region) => {
                                    const occupeePar = crascParRegion.get(Number(region.id));
                                    return (
                                        <label
                                            key={region.id}
                                            title={occupeePar ? `Déjà rattachée à ${occupeePar}` : undefined}
                                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                                                occupeePar ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={regionsChoisies.includes(Number(region.id))}
                                                disabled={Boolean(occupeePar)}
                                                onChange={() =>
                                                    setRegionsChoisies((precedentes) =>
                                                        precedentes.includes(Number(region.id))
                                                            ? precedentes.filter((id) => id !== Number(region.id))
                                                            : [...precedentes, Number(region.id)],
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-[#E05017] focus:ring-[#E05017]"
                                            />
                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                            <span className="truncate">{region.name}</span>
                                            {occupeePar && (
                                                <span className="ml-auto flex-shrink-0 text-[11px] text-gray-400">{occupeePar}</span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Annuler
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Enregistrer
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
