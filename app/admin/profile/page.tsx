"use client";

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminProfilePage() {
  const { user } = useAuth();

  const roleLabel = user?.is_superuser
    ? "Superuser"
    : user?.is_staff
    ? "Staff"
    : user?.is_redacteur
    ? "Rédacteur"
    : "Utilisateur";

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    role: roleLabel,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simuler la sauvegarde
    setTimeout(() => {
      setSaving(false);
      alert('Profil mis à jour avec succès !');
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Mon Profil
        </h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-[#2a591d] to-green-700 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <User size={64} strokeWidth={1.5} />
                </div>
                <button className="absolute bottom-2 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera size={18} className="text-gray-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{formData.role}</p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Membre depuis Jan 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Actions effectuées</span>
                  <span className="text-sm font-bold text-gray-900">234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#2a591d] h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Connexions ce mois</span>
                  <span className="text-sm font-bold text-gray-900">45</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Informations personnelles
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a591d] focus:border-transparent"
                />
              </div>

              {/* Role (read-only) */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#2a591d] to-green-700 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-[#2a591d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Sécurité
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-semibold text-gray-900">Changer le mot de passe</p>
                <p className="text-sm text-gray-600">Dernière modification il y a 30 jours</p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-semibold text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
