"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, Mail, Lock, Globe, Palette, Save, Shield, Image as ImageIcon, X } from 'lucide-react';
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formationImage, setFormationImage] = useState<string | null>(null);
  const [newFormationImage, setNewFormationImage] = useState<File | null>(null);
  const [formationPreview, setFormationPreview] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/config`)
      .then((r) => r.ok ? r.json() : {})
      .then((cfg: Record<string, string>) => {
        if (cfg.formation_default_image) setFormationImage(cfg.formation_default_image);
      })
      .catch(() => {});
  }, []);

  const handleImageFile = (file: File) => {
    setNewFormationImage(file);
    setFormationPreview(URL.createObjectURL(file));
  };

  const saveFormationImage = async () => {
    if (!newFormationImage) return;
    setSavingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", newFormationImage);
      const res = await fetchWithAuth(`${API_BASE}/api/v1/config/upload/formation_default_image`, { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormationImage(data.value);
        setNewFormationImage(null);
        setFormationPreview(null);
        setImageSaved(true);
        setTimeout(() => setImageSaved(false), 2000);
      }
    } finally {
      setSavingImage(false);
    }
  };
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
    monthlyReports: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
    language: 'fr',
    theme: 'light'
  });

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings]
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      alert('Paramètres enregistrés avec succès !');
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image générique formations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-[#E05017]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Image générique des formations</h2>
              <p className="text-sm text-gray-600">Affichée pour toutes les formations sans vignette personnalisée</p>
            </div>
          </div>

          <div className="max-w-sm">
            {(formationPreview || formationImage) && (
              <div className="relative rounded-lg overflow-hidden aspect-video mb-3 bg-gray-100">
                <img src={formationPreview || formationImage || ""} alt="Image générique" className="w-full h-full object-cover" />
                {formationPreview && (
                  <button type="button" onClick={() => { setNewFormationImage(null); setFormationPreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
            {!formationPreview && (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#E05017] hover:bg-orange-50 transition-colors mb-3">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">{formationImage ? "Changer l'image" : "Choisir une image"}</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
            {formationPreview && (
              <button type="button" onClick={saveFormationImage} disabled={savingImage}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-medium hover:bg-[#c94510] disabled:opacity-50">
                <Save className="w-4 h-4" />
                {imageSaved ? "Enregistré ✓" : savingImage ? "Enregistrement..." : "Enregistrer l'image"}
              </button>
            )}
          </div>
        </div>
        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Gérez vos préférences de notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Notifications par email</p>
                <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-[#2a591d]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Notifications push</p>
                <p className="text-sm text-gray-600">Recevoir des notifications dans le navigateur</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-[#2a591d]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Reports */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Rapports hebdomadaires</p>
                <p className="text-sm text-gray-600">Recevoir un résumé chaque semaine</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('weeklyReports')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyReports ? 'bg-[#2a591d]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Monthly Reports */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-gray-900">Rapports mensuels</p>
                <p className="text-sm text-gray-600">Recevoir un bilan chaque mois</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('monthlyReports')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.monthlyReports ? 'bg-[#2a591d]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.monthlyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
              <p className="text-sm text-gray-600">Paramètres de sécurité du compte</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Two Factor Auth */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-600">Sécurisez votre compte avec 2FA</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? 'bg-[#2a591d]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Session Timeout */}
            <div className="py-3">
              <label className="block font-semibold text-gray-900 mb-2">
                Délai d'expiration de session
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Durée avant déconnexion automatique (en minutes)
              </p>
              <select
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="120">2 heures</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apparence</h2>
              <p className="text-sm text-gray-600">Personnalisez l'interface</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Language */}
            <div className="py-3 border-b border-gray-200">
              <label className="block font-semibold text-gray-900 mb-2">
                Langue
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Choisissez la langue de l'interface
              </p>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Theme */}
            <div className="py-3">
              <label className="block font-semibold text-gray-900 mb-2">
                Thème
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Sélectionnez le thème de l'interface
              </p>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#2a591d] to-green-700 text-white font-bold py-3 px-8 rounded-lg hover:from-green-700 hover:to-[#2a591d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={20} />
                Enregistrer les paramètres
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
