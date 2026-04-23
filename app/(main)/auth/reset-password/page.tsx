"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <section className="min-h-screen py-10 bg-gray-50 font-poppins flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <p className="text-red-600 mb-4">Lien invalide ou expiré.</p>
            <Link href="/auth/forgot-password" className="text-[#E05017] hover:underline font-semibold">
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Lien invalide ou expiré.');
      }
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="min-h-screen py-10 bg-gray-50 font-poppins flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe modifié !</h1>
            <p className="text-gray-600 mb-6">
              Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la connexion…
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-[#E05017] text-white rounded-lg font-semibold hover:bg-[#c44315] transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-10 bg-gray-50 font-poppins flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <ImageWithFallback
            src="/images/logo.png"
            alt="PASCI Logo"
            className="w-20 h-20 object-contain mx-auto mb-4"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
            <p className="text-gray-600 text-sm">Choisissez un mot de passe sécurisé d'au moins 8 caractères.</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 8 caractères"
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-[#E05017] hover:underline font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
