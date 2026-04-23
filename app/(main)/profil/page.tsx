"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Edit,
  Save,
  X,
  Lock,
  FileText,
  LogOut,
  Loader2,
  Calendar,
  Award,
  ExternalLink,
} from "lucide-react";
import { authService, getToken, fetchWithAuth } from "@/lib/auth";
import { IUser } from "@/types/api.types";
import { API_BASE_URL } from "@/lib/api-config";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [certificats, setCertificats] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [showAllCerts, setShowAllCerts] = useState(false);

  // Changement de mot de passe
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth/login");
      return; // loading reste true → rien ne s'affiche avant la redirection
    }
    setAuthorized(true);
    authService.getCurrentUser()
      .then((u) => {
        setUser(u);
        setFirstName(u.first_name || "");
        setLastName(u.last_name || "");
        setUsername(u.username || "");
        setBio(u.bio || "");
        // Charger les certificats
        setLoadingCerts(true);
        fetchWithAuth(`${API_BASE_URL}/api/v1/formations/mes-certificats`)
          .then((r) => r.json())
          .then((data) => setCertificats(Array.isArray(data) ? data : []))
          .catch(() => {})
          .finally(() => setLoadingCerts(false));
      })
      .catch(() => router.replace("/auth/login"))
      .finally(() => setLoading(false));
  }, []);

  function handleEdit() {
    setIsEditing(true);
    setError("");
    setSuccess("");
  }

  function handleCancel() {
    setIsEditing(false);
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          username: username.trim() || null,
          bio: bio.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de la mise à jour.");
      }
      const updated: IUser = await res.json();
      setUser(updated);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (newPassword.length < 8) {
      setPwdError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/users/me/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors du changement de mot de passe.");
      }
      setPwdSuccess("Mot de passe modifié avec succès.");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setShowPwdForm(false);
      setTimeout(() => setPwdSuccess(""), 4000);
    } catch (err: any) {
      setPwdError(err.message);
    } finally {
      setPwdSaving(false);
    }
  }

  function handleLogout() {
    authService.logout();
    router.push("/auth/login");
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (!authorized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username ||
    user.email;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Mon Profil</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Avatar + nom */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#E05017]/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-[#E05017]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{displayName}</h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              {user.date_joined && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Membre depuis {formatDate(user.date_joined)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Informations personnelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#E05017]" />
                  Informations personnelles
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-semibold hover:bg-[#c44315] transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" /> Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-semibold hover:bg-[#c44315] disabled:opacity-50 transition-colors"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user.first_name || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user.last_name || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <p className="text-gray-900 py-2">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nom d'utilisateur</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user.username || "—"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mes Certificats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#E05017]" />
                  Mes Certificats
                  {certificats.length > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {certificats.length}
                    </span>
                  )}
                </h2>
              </div>
              {loadingCerts ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : certificats.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun certificat pour le moment.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(showAllCerts ? certificats : certificats.slice(0, 4)).map((cert) => (
                      <a
                        key={cert.id}
                        href={`/certificat/${cert.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg hover:border-[#E05017] hover:bg-orange-50 transition-all"
                      >
                        <div className="shrink-0 w-9 h-9 rounded-full bg-[#E05017]/10 flex items-center justify-center group-hover:bg-[#E05017]/20 transition-colors">
                          <Award className="w-4 h-4 text-[#E05017]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-xs leading-tight truncate">{cert.formation_title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(cert.issued_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            <span className="font-mono font-bold text-amber-600">{cert.code}</span>
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#E05017] shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                  {certificats.length > 4 && (
                    <button
                      onClick={() => setShowAllCerts(!showAllCerts)}
                      className="mt-3 w-full text-sm text-[#E05017] hover:underline font-medium py-1"
                    >
                      {showAllCerts ? "Voir moins" : `Voir les ${certificats.length - 4} autres certificats`}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Changer le mot de passe */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#E05017]" />
                  Mot de passe
                </h2>
                <button
                  onClick={() => { setShowPwdForm(!showPwdForm); setPwdError(""); setPwdSuccess(""); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  {showPwdForm ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  {showPwdForm ? "Annuler" : "Modifier"}
                </button>
              </div>
              {pwdSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">{pwdSuccess}</div>
              )}
              {!showPwdForm ? (
                <p className="text-sm text-gray-500">••••••••</p>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {pwdError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{pwdError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe actuel</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                      placeholder="Minimum 8 caractères"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pwdSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#E05017] text-white rounded-lg text-sm font-semibold hover:bg-[#c44315] disabled:opacity-50 transition-colors"
                  >
                    {pwdSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {pwdSaving ? "Enregistrement..." : "Mettre à jour le mot de passe"}
                  </button>
                </form>
              )}
            </div>

            {/* Biographie */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E05017]" />
                Biographie
              </h2>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#E05017] focus:outline-none"
                  placeholder="Parlez-nous de vous..."
                />
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {user.bio || "Aucune biographie renseignée."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
