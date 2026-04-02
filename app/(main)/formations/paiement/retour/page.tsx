"use client";

/**
 * Page de retour après paiement CinetPay (succès ou échec).
 * CinetPay redirige ici après le paiement via le return_url configuré.
 */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";

function RetourContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // "success" | "failed"
  const formationSlug = searchParams.get("slug") || "";

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement confirmé !</h1>
            <p className="text-gray-600 mb-6">
              Votre inscription a bien été enregistrée. Vous recevrez un email de confirmation.
              Un certificat vous sera délivré à la fin de la formation.
            </p>
            <div className="space-y-3">
              {formationSlug && (
                <Link
                  href={`/formations/${formationSlug}`}
                  className="block w-full h-12 flex items-center justify-center bg-[#E05017] text-white rounded-xl font-bold hover:bg-[#C54415] transition-colors"
                >
                  Retour à la formation
                </Link>
              )}
              <Link
                href="/formations"
                className="block text-sm text-gray-500 hover:text-gray-700"
              >
                Voir toutes les formations
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement non abouti</h1>
            <p className="text-gray-600 mb-6">
              Votre paiement n'a pas pu être finalisé. Aucun montant n'a été débité.
              Vous pouvez réessayer à tout moment.
            </p>
            <div className="space-y-3">
              {formationSlug && (
                <Link
                  href={`/formations/${formationSlug}`}
                  className="block w-full h-12 flex items-center justify-center bg-[#E05017] text-white rounded-xl font-bold hover:bg-[#C54415] transition-colors"
                >
                  Réessayer
                </Link>
              )}
              <Link
                href="/formations"
                className="block text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="inline w-4 h-4 mr-1" />
                Toutes les formations
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RetourPaiementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    }>
      <RetourContent />
    </Suspense>
  );
}
