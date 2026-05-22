"use client";

import { useState } from 'react';
import { ICrascDetail } from '@/types/api.types';
import { updateCrasc } from '@/lib/fetch-crasc';
import { Save, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface EditCrascFormProps {
    crasc: ICrascDetail;
    onSuccess?: (updatedCrasc: ICrascDetail) => void;
    onCancel?: () => void;
}

export function EditCrascForm({ crasc, onSuccess, onCancel }: EditCrascFormProps) {
    const [formData, setFormData] = useState({
        name: crasc.name || '',
        description: crasc.description || '',
        osc_count: crasc.osc_count || 0,
        email_pca: (crasc as any).email_pca || '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updated = await updateCrasc(crasc.slug, formData);
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
            [name]: name === 'osc_count' ? parseInt(value) || 0 : value
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

                {/* OSC Count Field */}
                <div>
                    <label htmlFor="osc_count" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre d'OSC membres
                    </label>
                    <input
                        type="number"
                        id="osc_count"
                        name="osc_count"
                        value={formData.osc_count}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E05017] focus:ring-2 focus:ring-[#E05017]/20 outline-none transition-all"
                        placeholder="0"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Ce nombre sera automatiquement calculé en fonction des OSC associées
                    </p>
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
