"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  Bell,
  FileText,
  Award,
  Briefcase,
  LogOut,
  Settings,
} from "lucide-react";

// Mock user data - À remplacer par les vraies données de l'utilisateur connecté
const mockUserData = {
  id: 1,
  firstName: "Marie",
  lastName: "KOUASSI",
  email: "marie.kouassi@exemple.com",
  phone: "+225 07 12 34 56 78",
  avatar: "/images/avatar-placeholder.jpg",
  organization: "Initiative Eau Claire",
  organizationType: "OSC (Organisation de la Société Civile)",
  city: "Abidjan",
  position: "Directrice de Projet",
  joinDate: "2024-01-15",
  bio: "Passionnée par le développement durable et l'accès à l'eau potable pour tous. Plus de 10 ans d'expérience dans la gestion de projets sociaux.",
  stats: {
    projectsParticipated: 12,
    trainingsCompleted: 8,
    hoursVolunteered: 156,
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [editedData, setEditedData] = useState(mockUserData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = () => {
    // TODO: Envoyer les données au backend
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-200">
                  <ImageWithFallback
                    src={userData.avatar}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-[#E05017] text-white p-2 rounded-full hover:bg-[#c44315] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Name */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{userData.position}</p>
                <p className="text-sm text-[#E05017] font-semibold mt-1">
                  {userData.organization}
                </p>
              </div>

              {/* Member Since */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Membre depuis {formatDate(userData.joinDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#E05017]" />
                Mes statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projets participés</span>
                  <span className="font-bold text-[#E05017]">
                    {userData.stats.projectsParticipated}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Formations suivies</span>
                  <span className="font-bold text-[#E05017]">
                    {userData.stats.trainingsCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Heures bénévoles</span>
                  <span className="font-bold text-[#E05017]">
                    {userData.stats.hoursVolunteered}h
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <Link
                  href="/profil/parametres"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">Paramètres</span>
                </Link>
                <Link
                  href="/profil/securite"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">Sécurité</span>
                </Link>
                <Link
                  href="/profil/notifications"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">Notifications</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-[#E05017]" />
                  Informations personnelles
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editedData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editedData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.phone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Ville
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={editedData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.city}</p>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    Poste
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={editedData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.position}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#E05017]" />
                Informations professionnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organisation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="organization"
                      value={editedData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{userData.organization}</p>
                  )}
                </div>

                {/* Organization Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type d'organisation
                  </label>
                  {isEditing ? (
                    <select
                      name="organizationType"
                      value={editedData.organizationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    >
                      <option>OSC (Organisation de la Société Civile)</option>
                      <option>PTF (Partenaire Technique et Financier)</option>
                      <option>Institution publique</option>
                      <option>Entreprise privée</option>
                      <option>Indépendant</option>
                      <option>Autre</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-3">{userData.organizationType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#E05017]" />
                Biographie
              </h2>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Parlez-nous de vous..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
