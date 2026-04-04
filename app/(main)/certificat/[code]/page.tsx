"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Download, CheckCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Certificat {
  id: number;
  code: string;
  formation_title: string;
  participant_name: string;
  participant_email: string;
  issued_at: string;
}

export default function CertificatPage() {
  const { code } = useParams<{ code: string }>();
  const [cert, setCert] = useState<Certificat | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;
    fetch(`${API_BASE_URL}/api/v1/formations/certificats/verifier/${code}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => { if (data) setCert(data); })
      .finally(() => setLoading(false));
  }, [code]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  if (notFound || !cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Certificat introuvable</h1>
          <p className="text-gray-500">Le code <strong>{code}</strong> ne correspond à aucun certificat valide.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bouton impression — masqué à l'impression */}
      <div className="no-print flex justify-center gap-3 py-6 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg font-semibold hover:bg-[#c44315] transition-colors shadow"
        >
          <Download className="w-4 h-4" />
          Télécharger / Imprimer
        </button>
      </div>

      {/* Certificat */}
      <div className="certificate-wrapper min-h-screen bg-gray-100 flex items-center justify-center p-8 print:p-0 print:bg-white print:min-h-0">
        <div
          className="certificate bg-white"
          style={{
            width: "794px",
            minHeight: "562px",
            position: "relative",
            fontFamily: "Georgia, serif",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          {/* Bordure décorative extérieure */}
          <div style={{
            position: "absolute", inset: 0,
            border: "12px solid #E05017",
            pointerEvents: "none", zIndex: 10,
          }} />
          {/* Bordure intérieure */}
          <div style={{
            position: "absolute", inset: "18px",
            border: "2px solid #E05017",
            opacity: 0.4,
            pointerEvents: "none", zIndex: 10,
          }} />

          {/* Fond décoratif */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(224,80,23,0.04) 0%, transparent 70%)",
          }} />

          {/* Contenu */}
          <div style={{ position: "relative", zIndex: 5, padding: "48px 64px", textAlign: "center" }}>
            {/* Logo / Organisation */}
            <div style={{ marginBottom: 8 }}>
              <div style={{
                display: "inline-block",
                background: "#E05017",
                color: "#fff",
                fontFamily: "Arial, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "0.05em",
                padding: "6px 20px",
                borderRadius: 4,
              }}>
                PASCI
              </div>
            </div>
            <p style={{ color: "#888", fontSize: 11, fontFamily: "Arial, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", margin: "4px 0 32px" }}>
              Plateforme d'Appui à la Société Civile Ivoirienne
            </p>

            {/* Titre */}
            <h1 style={{
              fontSize: 13,
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#888",
              margin: "0 0 8px",
            }}>
              Certificat de réussite
            </h1>
            <div style={{ width: 60, height: 2, background: "#E05017", margin: "0 auto 28px" }} />

            {/* Texte principal */}
            <p style={{ color: "#555", fontSize: 15, fontFamily: "Arial, sans-serif", margin: "0 0 16px" }}>
              Ce certificat est décerné à
            </p>
            <h2 style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 24px",
              lineHeight: 1.2,
            }}>
              {cert.participant_name}
            </h2>

            <p style={{ color: "#555", fontSize: 15, fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>
              pour avoir complété avec succès la formation
            </p>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#E05017",
              margin: "0 0 32px",
              fontFamily: "Arial, sans-serif",
            }}>
              « {cert.formation_title} »
            </h3>

            {/* Date + code */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid #eee",
            }}>
              <div style={{ textAlign: "left" }}>
                <p style={{ color: "#aaa", fontSize: 11, fontFamily: "Arial, sans-serif", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Date de délivrance
                </p>
                <p style={{ color: "#333", fontSize: 14, fontFamily: "Arial, sans-serif", fontWeight: 600, margin: 0 }}>
                  {formatDate(cert.issued_at)}
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  background: "#E05017",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 4px",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p style={{ color: "#aaa", fontSize: 10, fontFamily: "Arial, sans-serif", margin: 0 }}>Certifié</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#aaa", fontSize: 11, fontFamily: "Arial, sans-serif", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Code de vérification
                </p>
                <p style={{
                  color: "#333",
                  fontSize: 18,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  margin: 0,
                }}>
                  {cert.code}
                </p>
                <p style={{ color: "#bbb", fontSize: 10, fontFamily: "Arial, sans-serif", margin: "2px 0 0" }}>
                  plateforme-osci.org
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .certificate-wrapper {
            background: white !important;
            padding: 0 !important;
            display: block !important;
          }
          .certificate {
            box-shadow: none !important;
            width: 100% !important;
            page-break-inside: avoid;
          }
        }
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
      `}</style>
    </>
  );
}
