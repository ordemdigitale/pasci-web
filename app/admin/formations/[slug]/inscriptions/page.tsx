"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Award,
  Mail,
  Loader2,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Inscription {
  id: number;
  formation_id: number;
  participant_name: string;
  participant_nom: string | null;
  participant_prenoms: string | null;
  participant_email: string;
  participant_phone: string | null;
  categorie_acteur: string | null;
  is_completed: boolean;
  completed_at: string | null;
  certificate_issued: boolean;
  payment_status: string;
  payment_transaction_id: string | null;
  payment_amount: number | null;
  payment_date: string | null;
  payment_operator: string | null;
  created_at: string;
}

interface Certificat {
  id: number;
  code: string;
  formation_title: string;
  participant_name: string;
  participant_email: string;
  issued_at: string;
}

export default function InscriptionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [certEmise, setCertEmise] = useState<Certificat | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Inscription | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadInscriptions = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}/inscriptions`);
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setInscriptions(data);
    } catch (e) {
      setError("Impossible de charger les inscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInscriptions();
  }, [slug]);

  const marquerComplete = async (inscription: Inscription) => {
    if (inscription.is_completed) return;
    setActionLoading(inscription.id);
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/inscriptions/${inscription.id}/completer`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error();
      setInscriptions((prev) =>
        prev.map((i) =>
          i.id === inscription.id
            ? { ...i, is_completed: true, completed_at: new Date().toISOString() }
            : i
        )
      );
      showToast(`${inscription.participant_name} marqué comme complété.`, "success");
    } catch {
      showToast("Erreur lors de la mise à jour.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const delivrerCertificat = async (inscription: Inscription) => {
    if (!inscription.is_completed || inscription.certificate_issued) return;
    setActionLoading(inscription.id);
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/inscriptions/${inscription.id}/certifier`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur");
      }
      const cert: Certificat = await res.json();
      setCertEmise(cert);
      setInscriptions((prev) =>
        prev.map((i) =>
          i.id === inscription.id ? { ...i, certificate_issued: true } : i
        )
      );
      showToast(`Certificat délivré et envoyé à ${inscription.participant_email}.`, "success");
    } catch (e: any) {
      showToast(e.message || "Erreur lors de l'émission du certificat.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const supprimerInscription = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/inscriptions/${confirmDelete.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setInscriptions((prev) => prev.filter((i) => i.id !== confirmDelete.id));
      showToast(`${confirmDelete.participant_name} a été désinscrit.`, "success");
    } catch {
      showToast("Erreur lors de la désinscription.", "error");
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(null);
    }
  };

  const paymentBadge = (status: string) => {
    switch (status) {
      case "gratuite":
        return (
          <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
            Gratuite
          </span>
        );
      case "confirmed":
      case "paid":
        return (
          <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
            Payée
          </span>
        );
      case "pending":
        return (
          <span style={{ background: "#fef9c3", color: "#854d0e", padding: "2px 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
            En attente
          </span>
        );
      default:
        return (
          <span style={{ background: "#f3f4f6", color: "#374151", padding: "2px 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const completed = inscriptions.filter((i) => i.is_completed).length;
  const withCert = inscriptions.filter((i) => i.certificate_issued).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: toast.type === "success" ? "#15803d" : "#dc2626",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: 380,
          }}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span style={{ fontSize: 14 }}>{toast.message}</span>
        </div>
      )}

      {/* Modal certificat émis */}
      {certEmise && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setCertEmise(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              maxWidth: 420,
              width: "100%",
              margin: "0 16px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Award size={48} color="#E05017" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Certificat émis !</h3>
            <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>
              Un email a été envoyé à{" "}
              <strong>{certEmise.participant_email}</strong> avec le code de vérification.
            </p>
            <div
              style={{
                background: "#f3f4f6",
                borderRadius: 8,
                padding: "12px 16px",
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#111827",
                marginBottom: 20,
              }}
            >
              {certEmise.code}
            </div>
            <button
              onClick={() => setCertEmise(null)}
              style={{
                background: "#E05017",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => !deleteLoading && setConfirmDelete(null)}
        >
          <div
            style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 400, width: "100%", margin: "0 16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={40} color="#dc2626" style={{ margin: "0 auto 16px", display: "block" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Désinscrire ce participant ?</h3>
            <p style={{ color: "#6b7280", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
              <strong>{confirmDelete.participant_name}</strong> ({confirmDelete.participant_email}) sera supprimé de cette formation. Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleteLoading}
                style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontWeight: 500, fontSize: 14 }}
              >
                Annuler
              </button>
              <button
                onClick={supprimerInscription}
                disabled={deleteLoading}
                style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", cursor: deleteLoading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, opacity: deleteLoading ? 0.7 : 1 }}
              >
                {deleteLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={14} />}
                Désinscrire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link
            href={`/admin/formations`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 14, textDecoration: "none", marginBottom: 8 }}
          >
            <ArrowLeft size={16} /> Retour aux formations
          </Link>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Gestion des inscriptions</h1>
              <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 0" }}>Formation : {slug}</p>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{inscriptions.length}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>inscrits</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#15803d" }}>{completed}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>complétés</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#E05017" }}>{withCert}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>certifiés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#E05017" }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 80, color: "#dc2626" }}>
            <AlertCircle size={32} style={{ marginBottom: 8 }} />
            <p>{error}</p>
          </div>
        ) : inscriptions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6b7280" }}>
            <Users size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>Aucune inscription pour cette formation.</p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 1000, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Participant
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Catégorie
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Contact
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Inscription
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Paiement
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Statut
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Certificat
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((inscription, index) => (
                  <tr
                    key={inscription.id}
                    style={{
                      borderBottom: index < inscriptions.length - 1 ? "1px solid #f3f4f6" : "none",
                      background: "#fff",
                    }}
                  >
                    {/* Participant */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>
                        {inscription.participant_nom && inscription.participant_prenoms
                          ? `${inscription.participant_nom} ${inscription.participant_prenoms}`
                          : inscription.participant_name}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                        <Mail size={12} />
                        {inscription.participant_email}
                      </div>
                    </td>

                    {/* Catégorie d'acteur */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        {inscription.categorie_acteur || <span style={{ color: "#d1d5db" }}>—</span>}
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        {inscription.participant_phone || <span style={{ color: "#d1d5db" }}>—</span>}
                      </div>
                    </td>

                    {/* Date d'inscription */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#6b7280", fontSize: 13 }}>
                        <Clock size={13} />
                        {formatDate(inscription.created_at)}
                      </div>
                    </td>

                    {/* Paiement */}
                    <td style={{ padding: "14px 16px" }}>
                      <div>{paymentBadge(inscription.payment_status)}</div>
                      {inscription.payment_amount && (
                        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          <CreditCard size={11} />
                          {inscription.payment_amount.toLocaleString()} XOF
                        </div>
                      )}
                    </td>

                    {/* Statut complétion */}
                    <td style={{ padding: "14px 16px" }}>
                      {inscription.is_completed ? (
                        <div>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                            <CheckCircle size={12} /> Complété
                          </span>
                          <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>
                            {formatDate(inscription.completed_at)}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: 13 }}>En cours</span>
                      )}
                    </td>

                    {/* Certificat */}
                    <td style={{ padding: "14px 16px" }}>
                      {inscription.certificate_issued ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                          <Award size={12} /> Émis
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: 13 }}>Non émis</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {/* Marquer complété */}
                        {!inscription.is_completed && (
                          <button
                            onClick={() => marquerComplete(inscription)}
                            disabled={actionLoading === inscription.id}
                            title="Marquer comme complété"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "7px 14px",
                              background: "#f0fdf4",
                              color: "#15803d",
                              border: "1px solid #bbf7d0",
                              borderRadius: 7,
                              cursor: actionLoading === inscription.id ? "not-allowed" : "pointer",
                              fontSize: 13,
                              fontWeight: 500,
                              opacity: actionLoading === inscription.id ? 0.6 : 1,
                            }}
                          >
                            {actionLoading === inscription.id ? (
                              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Compléter
                          </button>
                        )}

                        {/* Désinscrire */}
                        <button
                          onClick={() => setConfirmDelete(inscription)}
                          disabled={actionLoading === inscription.id}
                          title="Désinscrire ce participant"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 14px",
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: 7,
                            cursor: actionLoading === inscription.id ? "not-allowed" : "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                            opacity: actionLoading === inscription.id ? 0.6 : 1,
                          }}
                        >
                          <Trash2 size={14} />
                          Désinscrire
                        </button>

                        {/* Délivrer certificat */}
                        <button
                          onClick={() => delivrerCertificat(inscription)}
                          disabled={
                            !inscription.is_completed ||
                            inscription.certificate_issued ||
                            actionLoading === inscription.id
                          }
                          title={
                            !inscription.is_completed
                              ? "Compléter d'abord la formation"
                              : inscription.certificate_issued
                              ? "Certificat déjà émis"
                              : "Délivrer le certificat"
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 14px",
                            background:
                              inscription.certificate_issued
                                ? "#fef3c7"
                                : inscription.is_completed
                                ? "#E05017"
                                : "#f3f4f6",
                            color:
                              inscription.certificate_issued
                                ? "#92400e"
                                : inscription.is_completed
                                ? "#fff"
                                : "#9ca3af",
                            border: inscription.certificate_issued
                              ? "1px solid #fde68a"
                              : inscription.is_completed
                              ? "none"
                              : "1px solid #e5e7eb",
                            borderRadius: 7,
                            cursor:
                              !inscription.is_completed || inscription.certificate_issued || actionLoading === inscription.id
                                ? "not-allowed"
                                : "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                            opacity: actionLoading === inscription.id ? 0.6 : 1,
                          }}
                        >
                          {actionLoading === inscription.id ? (
                            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                          ) : (
                            <Award size={14} />
                          )}
                          {inscription.certificate_issued ? "Émis" : "Certifier"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
