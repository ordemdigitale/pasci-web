"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function RetourDonContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [state, setState] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (status === "failed") {
      setState("failed");
    } else {
      setState("success");
    }
  }, [status]);

  if (state === "loading") {
    return (
      <section className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E05017]" />
      </section>
    );
  }

  if (state === "failed") {
    return (
      <section className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-9 h-9 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement échoué</h2>
          <p className="text-gray-600 mb-6">
            Votre paiement n'a pas pu être traité. Veuillez réessayer ou utiliser un autre moyen de paiement.
          </p>
          <a
            href="/faire-un-don"
            className="inline-block px-6 py-3 bg-[#E05017] text-white rounded-xl font-semibold hover:bg-[#c44315] transition-colors"
          >
            Réessayer
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Merci pour votre don !</h2>
        <p className="text-gray-600 mb-6">
          Votre paiement a été reçu avec succès. Votre générosité contribue au renforcement des
          organisations de la société civile en Côte d'Ivoire.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#E05017] text-white rounded-xl font-semibold hover:bg-[#c44315] transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </section>
  );
}

export default function RetourDonPage() {
  return (
    <Suspense>
      <RetourDonContent />
    </Suspense>
  );
}
