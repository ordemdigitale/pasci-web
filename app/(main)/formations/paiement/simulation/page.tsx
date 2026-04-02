"use client";

/**
 * Page de simulation de paiement CinetPay
 * Visible uniquement quand CinetPay n'est pas encore configuré.
 * En production (clés configurées), l'utilisateur est redirigé directement
 * vers la vraie page de paiement CinetPay.
 */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, CreditCard, CheckCircle, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { confirmerPaiementSimulation } from "@/lib/cinetpay";

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get("tid") || "";
  const amount = searchParams.get("amount") || "0";
  const formationSlug = searchParams.get("slug") || "";
  // inscriptionId est passé par le frontend après l'appel à initierPaiement
  const inscriptionId = searchParams.get("iid") ? parseInt(searchParams.get("iid")!) : null;

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!inscriptionId) {
      setError("ID d'inscription manquant.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await confirmerPaiementSimulation(inscriptionId);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/formations/paiement/retour?slug=${formationSlug}&status=success`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }

  function handleRefuse() {
    router.push(`/formations/paiement/retour?slug=${formationSlug}&status=failed`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-poppins">
      <div className="w-full max-w-md">
        {/* Bandeau simulation */}
        <div className="mb-4 px-4 py-2 bg-amber-100 border border-amber-300 rounded-lg flex items-center gap-2 text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Mode simulation</strong> — CinetPay non encore configuré.
            Cette page disparaîtra une fois les clés API renseignées.
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header CinetPay (style approché) */}
          <div className="bg-[#1A3C5E] px-6 py-5 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-6 h-6" />
              <span className="text-lg font-bold">CinetPay</span>
            </div>
            <p className="text-white/70 text-xs">Paiement sécurisé</p>
          </div>

          <div className="px-6 py-6">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                <p className="font-bold text-gray-800 text-lg">Paiement simulé accepté !</p>
                <p className="text-gray-500 text-sm mt-1">Redirection en cours...</p>
              </div>
            ) : (
              <>
                {/* Détails transaction */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Référence</span>
                    <span className="font-mono text-xs font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Montant</span>
                    <span className="font-bold text-gray-800 text-base">
                      {parseInt(amount).toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Devise</span>
                    <span className="font-medium">XOF</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <p className="text-xs text-gray-500 text-center mb-4">
                    Simuler un mode de paiement
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {["Orange Money", "MTN MoMo", "Wave"].map((m) => (
                      <div
                        key={m}
                        className="border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:border-[#1A3C5E] text-xs font-medium text-gray-600"
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={handlePay}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-[#1A3C5E] text-white rounded-xl font-bold hover:bg-[#122B44] disabled:opacity-50 transition-colors"
                  >
                    {processing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                    {processing ? "Traitement..." : "Simuler paiement accepté"}
                  </button>
                  <button
                    onClick={handleRefuse}
                    disabled={processing}
                    className="w-full h-10 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Simuler paiement refusé
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <Link
          href={`/formations/${formationSlug}`}
          className="flex items-center justify-center gap-1 mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Annuler et revenir à la formation
        </Link>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    }>
      <SimulationContent />
    </Suspense>
  );
}
