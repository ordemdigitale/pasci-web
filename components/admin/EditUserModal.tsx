"use client";

import { useState, useEffect } from "react";
import { X, Loader2, User, Mail, Shield, CheckCircle, XCircle, Building2 } from "lucide-react";
import { userService, UpdateUserAdminData } from "@/lib/services/user.service";
import { IUser, ICrasc } from "@/types/api.types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllCrasc } from "@/lib/fetch-crasc";

interface EditUserModalProps {
  isOpen: boolean;
  user: IUser;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ isOpen, user, onClose, onSuccess }: EditUserModalProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [crascs, setCrascs] = useState<ICrasc[]>([]);
  const [formData, setFormData] = useState<UpdateUserAdminData>({
    email: user.email,
    username: user.username || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
    is_active: user.is_active,
    is_staff: user.is_staff,
    is_superuser: user.is_superuser,
    is_redacteur: user.is_redacteur ?? false,
    crasc_id: user.crasc_id ?? null,
  });

  useEffect(() => {
    setFormData({
      email: user.email,
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      is_redacteur: user.is_redacteur ?? false,
      crasc_id: user.crasc_id ?? null,
    });
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      fetchAllCrasc().then(setCrascs).catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email) {
      toast.error("L'email est requis");
      return;
    }

    setLoading(true);
    try {
      await userService.updateUser(user.id, formData);
      toast.success("Utilisateur mis à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: keyof UpdateUserAdminData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Modifier l&apos;utilisateur
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#2a591d]" />
              Informations de base
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                    placeholder="admin@pasci.dz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                  placeholder="Admin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                  placeholder="PASCI"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                placeholder="Courte description de l'utilisateur..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Permissions & Status (only visible to staff) */}
          {currentUser?.is_staff && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2a591d]" />
                Permissions et statut
              </h3>

              <div className="space-y-3">
                {/* Compte actif — visible pour tous les staff */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={() => handleCheckboxChange("is_active")}
                    className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {formData.is_active ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-orange-600" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">Compte actif</p>
                      <p className="text-sm text-gray-600">
                        L&apos;utilisateur peut se connecter et accéder à la plateforme
                      </p>
                    </div>
                  </div>
                </label>

                {/* Rédacteur — visible pour tous les staff */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_redacteur ?? false}
                    onChange={() => {
                      const newIsRedacteur = !formData.is_redacteur;
                      setFormData((prev) => ({
                        ...prev,
                        is_redacteur: newIsRedacteur,
                        crasc_id: (!newIsRedacteur && !prev.is_staff) ? null : prev.crasc_id,
                      }));
                    }}
                    className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Rédacteur</p>
                    <p className="text-sm text-gray-600">
                      Peut créer du contenu — nécessite validation du staff avant publication
                    </p>
                  </div>
                </label>

                {/* Sélecteur CRASC — admin CRASC : valeur fixée, superuser : libre */}
                {(formData.is_staff || formData.is_redacteur) && (
                  <div className="ml-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#2a591d]" />
                      CRASC rattaché {currentUser.is_superuser && <span className="text-red-500">*</span>}
                    </label>
                    {currentUser.is_superuser ? (
                      <select
                        value={formData.crasc_id ?? ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            crasc_id: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d] bg-white"
                      >
                        <option value="">-- Choisir un CRASC --</option>
                        {crascs.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-700">
                        {crascs.find((c) => c.id === currentUser.crasc_id)?.name ?? `CRASC #${currentUser.crasc_id}`}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.is_staff
                        ? "Cet admin ne verra que les données de ce CRASC."
                        : "Ce rédacteur ne pourra publier que pour ce CRASC."}
                    </p>
                  </div>
                )}

                {/* Admin CRASC & Superuser — superuser uniquement */}
                {currentUser.is_superuser && (
                  <>
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.is_staff}
                        onChange={() => {
                          const newIsStaff = !formData.is_staff;
                          setFormData((prev) => ({
                            ...prev,
                            is_staff: newIsStaff,
                            crasc_id: (!newIsStaff && !prev.is_redacteur) ? null : prev.crasc_id,
                          }));
                        }}
                        className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Admin CRASC</p>
                        <p className="text-sm text-gray-600">
                          Accès à l&apos;interface d&apos;administration — limité à son CRASC
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.is_superuser}
                        onChange={() => handleCheckboxChange("is_superuser")}
                        className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Superuser</p>
                        <p className="text-sm text-gray-600">
                          Accès complet à toutes les fonctionnalités
                        </p>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2a591d] text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
