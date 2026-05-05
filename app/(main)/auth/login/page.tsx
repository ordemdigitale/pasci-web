"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService, setStoredUser } from '@/lib/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({ username: email, password });
      const user = await authService.getCurrentUser();
      setStoredUser(user);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-10 bg-gray-50 font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Left Side - Image/Info */}
          <div className="hidden md:block">
            <div className="bg-[#f0f9ff] rounded-lg p-8 border border-gray-200">
              <div className="mb-6">
                <ImageWithFallback
                  src="/images/logo.png"
                  alt="PASCI Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-[#2a591d] mb-4">
                Bienvenue à vous
              </h2>
              <p className="text-gray-700 mb-6">
                Se connecter pour accéder à votre espace personnel et profiter de tous les services
                du Pôle de concertation des OSC membres des CRASC notamment :
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E05017] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Participer aux discussions ;</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E05017] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Accéder aux formations en ligne ;</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E05017] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Consulter les offres d'emploi et de projets de votre domaine ;</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E05017] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Bénéficiez d'un accompagnement personnalisé.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
              <p className="text-gray-600">Se connecter à votre compte</p>
            </div>

            {justRegistered && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">Compte créé avec succès ! Se connecter.</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
{/*               <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#E05017] hover:underline font-semibold"
                >
                  Mot de passe oublié ?
                </Link>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            {/* Divider */}
            {/* <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OU</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div> */}

            {/* Register Link */}
            {/* <div className="text-center">
              <p className="text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link href="/auth/register" className="text-[#E05017] hover:underline font-semibold">
                  Créer un compte
                </Link>
              </p>
            </div> */}

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
