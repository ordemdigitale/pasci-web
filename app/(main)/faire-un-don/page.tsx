"use client";

import { useState } from "react";
import { Heart, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const MONTANTS = [5000, 10000, 25000, 50000, 100000];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FaireUnDonPage() {
  const [montantChoisi, setMontantChoisi] = useState<number | null>(null);
  const [montantLibre, setMontantLibre] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    fonction: "",
    sexe: "",
    tranche_age: "",
    email: "",
    telephone: "",
    pays: "",
    lieu_residence: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const montantFinal = montantChoisi ?? (montantLibre ? parseInt(montantLibre) : null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!montantFinal || montantFinal < 1000) {
      toast.error("Veuillez indiquer un montant (minimum 1 000 FCFA).");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/dons/initier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenoms: formData.prenoms || null,
          fonction: formData.fonction || null,
          sexe: formData.sexe || null,
          tranche_age: formData.tranche_age || null,
          email: formData.email,
          telephone: formData.telephone || null,
          pays: formData.pays || null,
          lieu_residence: formData.lieu_residence || null,
          montant: montantFinal,
          message: formData.message || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Une erreur est survenue.");
      }

      const data = await res.json();

      if (data.simulated) {
        // Mode dev sans CinetPay — confirmer directement
        await fetch(`${API_BASE}/api/v1/dons/simulation/confirmer/${data.don_id}`, {
          method: "POST",
        });
        setSubmitted(true);
      } else {
        // Redirection vers CinetPay
        window.location.href = data.payment_url;
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Merci pour votre don !</h2>
          <p className="text-gray-600 mb-6">
            Votre générosité contribue au renforcement des organisations de la société civile en Côte d'Ivoire.
            Vous recevrez une confirmation par email.
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

  return (
    <section className="min-h-screen bg-gray-50 font-poppins py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-[#E05017]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-[#E05017]" />
          </div>
          <h1 className="text-4xl font-bold text-[#2a591d] mb-3">Faire un don</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Soutenez le développement de la société civile en Côte d'Ivoire. Chaque don, quel que soit son montant,
            contribue à renforcer les capacités des OSC membres du CRASC.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Formulaire de don */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Votre contribution</h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Choix du montant */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choisir un montant (FCFA)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                    {MONTANTS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setMontantChoisi(m); setMontantLibre(""); }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          montantChoisi === m
                            ? "border-[#E05017] bg-[#E05017] text-white"
                            : "border-gray-200 text-gray-700 hover:border-[#E05017]"
                        }`}
                      >
                        {m.toLocaleString("fr-FR")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1000"
                    placeholder="Autre montant..."
                    value={montantLibre}
                    onChange={(e) => { setMontantLibre(e.target.value); setMontantChoisi(null); }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  />
                </div>

                {/* Informations du donateur */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Nom & Prénoms */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" name="nom" required
                      value={formData.nom} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prénoms</label>
                    <input
                      type="text" name="prenoms"
                      value={formData.prenoms} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Vos prénoms"
                    />
                  </div>

                  {/* Fonction */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fonction</label>
                    <input
                      type="text" name="fonction"
                      value={formData.fonction} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Votre fonction"
                    />
                  </div>

                  {/* Sexe & Tranche d'âge */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sexe</label>
                    <select name="sexe" value={formData.sexe} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white">
                      <option value="">-- Sélectionner --</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tranche d&apos;âge</label>
                    <select name="tranche_age" value={formData.tranche_age} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white">
                      <option value="">-- Sélectionner --</option>
                      <option value="-18 ans">Moins de 18 ans</option>
                      <option value="18 à 35 ans">18 à 35 ans</option>
                      <option value="+35 ans">Plus de 35 ans</option>
                    </select>
                  </div>

                  {/* Email & Contact */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact (Mobile Money)</label>
                    <input
                      type="tel" name="telephone"
                      value={formData.telephone} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>

                  {/* Pays & Lieu de résidence */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pays</label>
                    <input
                      type="text" name="pays"
                      value={formData.pays} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Votre pays"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lieu de résidence</label>
                    <input
                      type="text" name="lieu_residence"
                      value={formData.lieu_residence} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Ville / Quartier"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message (optionnel)</label>
                  <textarea
                    rows={3} name="message"
                    value={formData.message} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-none"
                    placeholder="Un mot d'encouragement..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#E05017] text-white rounded-xl font-bold text-base hover:bg-[#c44315] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Traitement en cours..." : (
                    <>
                      <Heart className="w-5 h-5" />
                      Faire un don{montantFinal ? ` de ${montantFinal.toLocaleString("fr-FR")} FCFA` : ""}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            <div className="bg-[#2a591d] text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-3">Pourquoi donner ?</h3>
              <ul className="space-y-3 text-sm text-white/90">
                {[
                  "Renforcer les capacités des OSC",
                  "Financer des formations professionnelles",
                  "Soutenir les actions de plaidoyer",
                  "Favoriser le réseautage entre organisations",
                  "Contribuer au développement durable",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#E05017]" />
                Autres moyens de don
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Mobile Money :</span> 05 05 56 57 41</p>
                <p><span className="font-semibold">Email :</span> pdoc@plateforme-osci.org</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
