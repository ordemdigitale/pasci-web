"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ShieldX, ArrowLeft, Home, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6 font-poppins">
      <div className="max-w-lg w-full text-center">

        {/* Icône */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="w-14 h-14 text-red-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">
              403
            </div>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Accès refusé
        </h1>
        <p className="text-gray-500 text-lg mb-6">
          Vous n'êtes pas autorisé à accéder aux données de ce CRASC.
        </p>

        {/* Info utilisateur */}
        {user?.is_staff && !user?.is_superuser && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  Votre accès est limité à votre CRASC
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  En tant qu'administrateur CRASC, vous ne pouvez consulter et
                  modifier que les données du CRASC qui vous est rattaché.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2a591d] text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            Tableau de bord
          </Link>
        </div>

      </div>
    </div>
  );
}
