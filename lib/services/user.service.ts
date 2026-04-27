// lib/services/user.service.ts | User management service
import { IUser } from "@/types/api.types";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/v1`;

export interface CreateUserData {
  email: string;
  username?: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserAdminData extends UpdateUserData {
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_redacteur?: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export const userService = {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<IUser[]> {
    const response = await fetchWithAuth(`${API_URL}/users/`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<IUser> {
    const response = await fetchWithAuth(`${API_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<IUser> {
    const response = await fetchWithAuth(`${API_URL}/users/me`);
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    return await response.json();
  },

  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserData): Promise<IUser> {
    const response = await fetchWithAuth(`${API_URL}/users/`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Failed to create user",
      }));
      throw new Error(error.detail || "Failed to create user");
    }

    return await response.json();
  },

  /**
   * Update user (admin only)
   */
  async updateUser(
    id: string,
    userData: UpdateUserAdminData
  ): Promise<IUser> {
    const response = await fetchWithAuth(`${API_URL}/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Failed to update user",
      }));
      throw new Error(error.detail || "Failed to update user");
    }

    return await response.json();
  },

  /**
   * Update current user profile
   */
  async updateMyProfile(userData: UpdateUserData): Promise<IUser> {
    const response = await fetchWithAuth(`${API_URL}/users/me`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Failed to update profile",
      }));
      throw new Error(error.detail || "Failed to update profile");
    }

    return await response.json();
  },

  /**
   * Delete user (superuser only)
   */
  async deleteUser(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({
        detail: "Failed to delete user",
      }));
      throw new Error(error.detail || "Failed to delete user");
    }
  },

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/users/me/change-password`, {
      method: "POST",
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Failed to change password",
      }));
      throw new Error(error.detail || "Failed to change password");
    }
  },
};
