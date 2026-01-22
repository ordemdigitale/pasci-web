"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: Implement actual password reset logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Replace with actual password reset request
      console.log('Password reset request for:', email);

      setSubmitted(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-screen py-10 bg-gray-50 font-poppins flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Email envoyé !</h1>

            <p className="text-gray-600 mb-6">
              Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
              Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Le lien expirera dans 24 heures. Si vous ne recevez pas l'email,
                vérifiez votre dossier spam ou réessayez.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full mb-3 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold"
            >
              Renvoyer l'email
            </button>

            <Link
              href="/auth/login"
              className="block text-[#E05017] hover:underline font-semibold"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-10 bg-gray-50 font-poppins flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <ImageWithFallback
            src="/images/logo.png"
            alt="PASCI Logo"
            className="w-20 h-20 object-contain mx-auto mb-4"
          />
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h1>
            <p className="text-gray-600">
              Pas de problème. Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>
          </div>

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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-[#E05017] hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Besoin d'aide ?{' '}
            <Link href="/contact" className="text-[#E05017] hover:underline font-semibold">
              Contactez-nous
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
