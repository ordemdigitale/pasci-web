"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Send, Loader2, CheckCircle, Clock, XCircle, ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth, getStoredUser } from "@/lib/auth";
import type { IUser } from "@/types/api.types";
import { messageErreurApi } from "@/lib/erreurs-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MaNews {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  statut_publication: string;
  est_archivee?: boolean;
}

const ETATS: Record<string, { libelle: string; classe: string; icone: React.ReactNode }> = {
  en_attente: { libelle: "En attente de validation", classe: "bg-amber-100 text-amber-700", icone: <Clock className="w-3.5 h-3.5" /> },
  publie: { libelle: "Publiée", classe: "bg-green-100 text-green-700", icone: <CheckCircle className="w-3.5 h-3.5" /> },
  rejete: { libelle: "Refusée", classe: "bg-red-100 text-red-700", icone: <XCircle className="w-3.5 h-3.5" /> },
};

/** Désactivation automatique proposée à 3 mois, comme dans l'admin. */
function dansTroisMois() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().slice(0, 10);
}

const CHAMP = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-transparent";

export default function PublierMonActualitePage() {
  const { user: userContexte, loading } = useAuth();
  const pathname = usePathname();
  // Le compte réellement connecté (celui dont le jeton part vers l'API) : la
  // page de connexion ne met pas toujours à jour le contexte avant la redirection
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    setUser(getStoredUser() ?? userContexte ?? null);
  }, [userContexte]);
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [dateExpiration, setDateExpiration] = useState(dansTroisMois);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);
  const [mesActualites, setMesActualites] = useState<MaNews[]>([]);

  const chargerMesActualites = useCallback(() => {
    fetchWithAuth(`${API_BASE_URL}/api/v1/news/mon-osc`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMesActualites(Array.isArray(data) ? data : []))
      .catch(() => setMesActualites([]));
  }, []);

  useEffect(() => {
    if (user?.osc_id) chargerMesActualites();
  }, [user?.osc_id, chargerMesActualites]);

  async function publier(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setSucces(false);
    if (!titre.trim() || !texte.trim()) {
      setErreur("Le titre et le texte sont obligatoires.");
      return;
    }
    setEnvoi(true);
    try {
      const fd = new FormData();
      fd.append("title", titre.trim());
      fd.append("content", texte.trim());
      fd.append("date_expiration", dateExpiration);
      if (image) fd.append("thumbnail", image);
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/news/mon-osc`, { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(messageErreurApi(data.detail) || "La publication a échoué.");
      }
      setSucces(true);
      setTitre("");
      setTexte("");
      setImage(null);
      setDateExpiration(dansTroisMois());
      chargerMesActualites();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "La publication a échoué.");
    } finally {
      setEnvoi(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 font-poppins">
      <h1 className="text-3xl font-bold text-[#2a591d] flex items-center gap-3 mb-2">
        <Newspaper className="w-8 h-8 text-[#E05017]" /> Publier mon actualité
      </h1>
      <p className="text-gray-600 mb-8">
        Partagez les activités de votre OSC. Votre actualité est relue par votre CRASC, puis publiée sur la PdoC et
        sur le profil de votre OSC.
      </p>

      {!user ? (
        <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-4">Connectez-vous avec le compte de votre OSC pour publier une actualité.</p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
            className="inline-block px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415]"
          >
            Se connecter
          </Link>
        </div>
      ) : !user.osc_id ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800">
          Votre compte n&apos;est rattaché à aucune OSC. Seules les OSC membres de la PdoC peuvent publier leurs actualités.
        </div>
      ) : (
        <>
          <form onSubmit={publier} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
            {succes && (
              <p className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                <CheckCircle className="w-4 h-4" /> Actualité envoyée : elle sera publiée après validation par votre CRASC.
              </p>
            )}
            {erreur && <p className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{erreur}</p>}

            <div>
              <label htmlFor="titre" className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
              <input id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} className={CHAMP} maxLength={200} required />
            </div>
            <div>
              <label htmlFor="texte" className="block text-sm font-semibold text-gray-700 mb-2">Texte de l&apos;actualité *</label>
              <textarea id="texte" value={texte} onChange={(e) => setTexte(e.target.value)} rows={8} className={CHAMP} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                  <ImageIcon className="inline w-4 h-4 mr-1" /> Image (facultative)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-600"
                />
              </div>
              <div>
                <label htmlFor="date_expiration" className="block text-sm font-semibold text-gray-700 mb-2">
                  Retirer du site le
                </label>
                <input
                  id="date_expiration"
                  type="date"
                  value={dateExpiration}
                  onChange={(e) => setDateExpiration(e.target.value)}
                  className={CHAMP}
                />
                <p className="text-xs text-gray-500 mt-1">Ensuite, elle reste dans les archives de votre OSC.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={envoi}
              className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-full font-semibold hover:bg-[#C54415] disabled:opacity-50"
            >
              {envoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {envoi ? "Envoi…" : "Publier mon actualité"}
            </button>
          </form>

          {mesActualites.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mes actualités</h2>
              <ul className="space-y-3">
                {mesActualites.map((n) => {
                  const etat = ETATS[n.statut_publication] ?? ETATS.en_attente;
                  return (
                    <li key={n.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        {n.statut_publication === "publie" ? (
                          <Link href={`/actualites/${n.slug}`} className="font-semibold text-gray-900 hover:text-[#E05017]">{n.title}</Link>
                        ) : (
                          <p className="font-semibold text-gray-900">{n.title}</p>
                        )}
                        <p className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${etat.classe}`}>
                        {etat.icone} {n.est_archivee && n.statut_publication === "publie" ? "Archivée" : etat.libelle}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
