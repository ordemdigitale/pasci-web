"use client";

import { useState } from 'react';
import { Bell, Mail, Lock, Globe, Palette, Save, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
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
