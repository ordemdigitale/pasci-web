"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  X,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Loader2,
} from "lucide-react";
import { userService } from "@/lib/services/user.service";
import { IUser } from "@/types/api.types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import AddUserModal from "@/components/admin/AddUserModal";
import EditUserModal from "@/components/admin/EditUserModal";

const PAGE_SIZE = 25;

export default function UtilisateursPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      user.email.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower);

    const matchStatus = !selectedStatus ||
      (selectedStatus === "active" && user.is_active) ||
      (selectedStatus === "inactive" && !user.is_active);

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleViewUser = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      toast.success("Utilisateur supprimé avec succès");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleToggleStatus = async (user: IUser) => {
    try {
      await userService.updateUser(user.id, {
        is_active: !user.is_active,
      });
      toast.success(
        user.is_active ? "Utilisateur désactivé" : "Utilisateur activé"
      );
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getUserInitials = (user: IUser) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  const getUserFullName = (user: IUser) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#2a591d]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Gérez tous les utilisateurs de la plateforme PASCI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-[#2a591d]/10 p-3 rounded-lg">
                <User className="w-6 h-6 text-[#2a591d]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter((u) => u.is_active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Utilisateurs Inactifs</p>
                <p className="text-3xl font-bold text-orange-600">
                  {users.filter((u) => !u.is_active).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Administrateurs</p>
                <p className="text-3xl font-bold text-blue-600">
                  {users.filter((u) => u.is_staff || u.is_superuser).length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a591d] focus:border-[#2a591d]"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>

          {currentUser?.is_staff && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#2a591d] text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
              >
                <Plus className="w-5 h-5" />
                Ajouter un utilisateur
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2a591d] rounded-full flex items-center justify-center text-white font-bold">
                          {getUserInitials(user)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {getUserFullName(user)}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.is_superuser && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            Superuser
                          </span>
                        )}
                        {user.is_staff && !user.is_superuser && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            Admin CRASC
                          </span>
                        )}
                        {(user as { is_redacteur?: boolean }).is_redacteur && !user.is_staff && !user.is_superuser && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                            Rédacteur
                          </span>
                        )}
                        {!user.is_staff && !user.is_superuser && !(user as { is_redacteur?: boolean }).is_redacteur && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                            Utilisateur
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {user.is_active ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {user.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.date_joined)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {currentUser?.is_staff && (
                          <>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-[#2a591d] hover:bg-green-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                                user.is_active ? "text-orange-600" : "text-green-600"
                              }`}
                              title={user.is_active ? "Désactiver" : "Activer"}
                            >
                              {user.is_active ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                        {currentUser?.is_superuser && user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold">
                  Aucun utilisateur trouvé
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Affichage de {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredUsers.length)}–{Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} sur {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Précédent
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                    .reduce<(number | string)[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '…' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={`px-3 py-2 text-sm border rounded-lg ${currentPage === p ? 'bg-[#2a591d] text-white border-[#2a591d]' : 'border-gray-300 hover:bg-gray-100'}`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de l'utilisateur
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar & Name */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#2a591d] rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                    {getUserInitials(selectedUser)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {getUserFullName(selectedUser)}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedUser.is_superuser
                      ? "Superuser"
                      : selectedUser.is_staff
                      ? "Admin CRASC"
                      : selectedUser.is_redacteur
                      ? "Rédacteur"
                      : "Utilisateur"}
                  </p>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#2a591d] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                  </div>

                  {selectedUser.username && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-[#2a591d] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Username
                        </p>
                        <p className="text-gray-900">{selectedUser.username}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-[#2a591d] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Statut</p>
                      <p className="text-gray-900">
                        {selectedUser.is_active ? "Actif" : "Inactif"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#2a591d] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date d'inscription
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedUser.date_joined)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {currentUser?.is_staff && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleEditUser(selectedUser);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2a591d] text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                    >
                      <Edit className="w-5 h-5" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        handleToggleStatus(selectedUser);
                        setIsModalOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                    >
                      {selectedUser.is_active ? (
                        <>
                          <Lock className="w-5 h-5" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Unlock className="w-5 h-5" />
                          Activer
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {isAddModalOpen && (
          <AddUserModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => {
              fetchUsers();
              setIsAddModalOpen(false);
            }}
          />
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && selectedUser && (
          <EditUserModal
            isOpen={isEditModalOpen}
            user={selectedUser}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              fetchUsers();
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
