/**
 * lib/cinetpay.ts
 * Configuration et helpers CinetPay
 *
 * Pour activer le paiement réel :
 *   1. Récupérer l'API_KEY et le SITE_ID sur https://cinetpay.com
 *   2. Ajouter dans .env.local :
 *        NEXT_PUBLIC_CINETPAY_SITE_ID=votre_site_id
 *   3. Mettre NEXT_PUBLIC_CINETPAY_ENABLED=true dans .env.local
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const CINETPAY_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_CINETPAY_ENABLED === "true",
  siteId: process.env.NEXT_PUBLIC_CINETPAY_SITE_ID || "",
  currency: process.env.NEXT_PUBLIC_CINETPAY_CURRENCY || "XOF",
};

export interface PaiementInitierResponse {
  inscription_id: number;
  payment_url: string;
  transaction_id: string;
  amount: number;
  currency: string;
  cinetpay_configured: boolean;
}

/**
 * Initie un paiement pour une formation payante.
 * Retourne l'URL CinetPay vers laquelle rediriger l'utilisateur
 * (ou l'URL de simulation si CinetPay n'est pas encore configuré).
 */
export async function initierPaiement(
  formationSlug: string,
  participantName: string,
  participantEmail: string,
  participantPhone?: string
): Promise<PaiementInitierResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/formations/${formationSlug}/paiement/initier`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participant_name: participantName,
        participant_email: participantEmail,
        participant_phone: participantPhone || null,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Erreur lors de l'initiation du paiement.");
  }

  return response.json();
}

/**
 * Confirme un paiement en mode simulation (dev uniquement).
 * En production, cette confirmation vient du webhook CinetPay.
 */
export async function confirmerPaiementSimulation(
  inscriptionId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/formations/paiement/simulation/confirmer/${inscriptionId}`,
    { method: "POST" }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Erreur simulation paiement.");
  }
}
