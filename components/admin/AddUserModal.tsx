"use client";

import { useState, useEffect } from "react";
import { X, Loader2, User, Mail, Lock, Shield, Building2 } from "lucide-react";
import { userService, CreateUserData } from "@/lib/services/user.service";
import { ICrasc } from "@/types/api.types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllCrasc } from "@/lib/fetch-crasc";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [crascs, setCrascs] = useState<ICrasc[]>([]);
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [permissions, setPermissions] = useState({
    is_staff: false,
    is_superuser: false,
    is_redacteur: false,
    crasc_id: null as number | null,
  });

  useEffect(() => {
    if (isOpen) {
      fetchAllCrasc().then(setCrascs).catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("L'email et le mot de passe sont requis");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (permissions.is_staff && !permissions.crasc_id) {
      toast.error("Veuillez sélectionner un CRASC pour l'Admin CRASC");
      return;
    }

    setLoading(true);
    try {
      const newUser = await userService.createUser(formData);

      if (
        currentUser?.is_staff &&
        (permissions.is_staff || permissions.is_superuser || permissions.is_redacteur)
      ) {
        await userService.updateUser(newUser.id, {
          is_staff: permissions.is_staff,
          is_superuser: permissions.is_superuser,
          is_redacteur: permissions.is_redacteur,
          crasc_id: permissions.is_staff ? permissions.crasc_id : null,
        });
      }

      toast.success("Utilisateur créé avec succès");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Erreur lors de la création de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Ajouter un utilisateur
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
                    placeholder="admin@pasci.ci"
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
                  placeholder="Prénom"
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
                  placeholder="Nom de famille"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum 8 caractères</p>
            </div>
          </div>

          {/* Permissions */}
          {currentUser?.is_staff && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2a591d]" />
                Rôle et permissions
              </h3>

              <div className="space-y-3">
                {/* Admin CRASC */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.is_staff}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        is_staff: e.target.checked,
                        crasc_id: e.target.checked ? prev.crasc_id : null,
                      }))
                    }
                    className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Admin CRASC</p>
                    <p className="text-sm text-gray-600">
                      Accès à l'interface d'administration — limité à son CRASC
                    </p>
                  </div>
                </label>

                {/* Sélecteur CRASC */}
                {permissions.is_staff && (
                  <div className="ml-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#2a591d]" />
                      CRASC rattaché <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={permissions.crasc_id ?? ""}
                      onChange={(e) =>
                        setPermissions((prev) => ({
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
                    <p className="text-xs text-gray-500 mt-1">
                      Cet admin ne verra que les données de ce CRASC.
                    </p>
                  </div>
                )}

                {/* Rédacteur */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.is_redacteur}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        is_redacteur: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Rédacteur</p>
                    <p className="text-sm text-gray-600">
                      Peut créer du contenu — nécessite validation avant publication
                    </p>
                  </div>
                </label>

                {/* Superuser */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.is_superuser}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        is_superuser: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-[#2a591d] rounded focus:ring-[#2a591d]"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Superuser</p>
                    <p className="text-sm text-gray-600">
                      Accès complet à toutes les fonctionnalités
                    </p>
                  </div>
                </label>
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
                  Création...
                </>
              ) : (
                "Créer l'utilisateur"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
