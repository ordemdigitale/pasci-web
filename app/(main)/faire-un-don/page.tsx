"use client";

import { useState } from "react";
import { Heart, Phone, CheckCircle, Loader2, Smartphone } from "lucide-react";

const MONTANTS = [5000, 10000, 25000, 50000, 100000];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Step = "form" | "instructions" | "done";

export default function FaireUnDonPage() {
  const [step, setStep] = useState<Step>("form");

  // Étape 1 — formulaire
  const [montantChoisi, setMontantChoisi] = useState<number | null>(null);
  const [montantLibre, setMontantLibre] = useState("");
  const [formData, setFormData] = useState({
    nom: "", prenoms: "", fonction: "", sexe: "", tranche_age: "",
    email: "", telephone: "", pays: "", lieu_residence: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Résultat étape 1
  const [donId, setDonId] = useState<number | null>(null);
  const [montantConfirme, setMontantConfirme] = useState<number>(0);

  // Étape 2 — code transaction
  const [transactionId, setTransactionId] = useState("");
  const [operateur, setOperateur] = useState("");
  const [isSoumitting, setIsSoumitting] = useState(false);
  const [soumitError, setSoumitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const montantFinal = montantChoisi ?? (montantLibre ? parseInt(montantLibre) : null);

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!montantFinal || montantFinal < 1000) {
      setFormError("Veuillez indiquer un montant (minimum 1 000 FCFA).");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/dons/creer`, {
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
      setDonId(data.don_id);
      setMontantConfirme(montantFinal);
      setStep("instructions");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSoumettreTransaction(e: React.FormEvent) {
    e.preventDefault();
    setSoumitError("");
    if (!transactionId.trim()) {
      setSoumitError("Veuillez saisir votre code de transaction.");
      return;
    }
    setIsSoumitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/dons/${donId}/soumettre-paiement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: transactionId.trim(), operateur: operateur || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Une erreur est survenue.");
      }
      setStep("done");
    } catch (err: unknown) {
      setSoumitError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSoumitting(false);
    }
  }

  // ── Étape 3 : Confirmation ──────────────────────────────────────────────────
  if (step === "done") {
    return (
      <section className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Code soumis avec succès !</h2>
          <p className="text-gray-600 mb-6">
            Votre code de transaction a bien été enregistré. Notre équipe va vérifier et confirmer votre don dans les <strong>24 heures</strong>. Vous recevrez un email de confirmation.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-[#E05017] text-white rounded-xl font-semibold hover:bg-[#c44315] transition-colors">
            Retour à l&apos;accueil
          </a>
        </div>
      </section>
    );
  }

  // ── Étape 2 : Instructions de paiement ─────────────────────────────────────
  if (step === "instructions") {
    return (
      <section className="min-h-screen bg-gray-50 font-poppins py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#2a591d] mb-2">Don enregistré !</h1>
            <p className="text-gray-600">
              Votre don de <strong>{montantConfirme.toLocaleString("fr-FR")} FCFA</strong> a bien été enregistré.
              Pour le finaliser, effectuez le paiement via Wave ou Orange Money.
            </p>
          </div>

          {/* Blocs paiement */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-900">Wave</p>
                  <p className="text-xs text-blue-600">Paiement mobile</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-900 font-mono">+225 07 07 07 07 07</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-orange-900">Orange Money</p>
                  <p className="text-xs text-orange-600">Paiement mobile</p>
                </div>
              </div>
              <p className="text-xl font-bold text-orange-900 font-mono">+225 05 05 05 05 05</p>
            </div>
          </div>

          {/* Montant à envoyer */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant à envoyer</p>
              <p className="text-2xl font-bold text-[#E05017]">{montantConfirme.toLocaleString("fr-FR")} FCFA</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Référence</p>
              <p className="font-mono font-bold text-gray-800">Don PASCI #{donId}</p>
            </div>
          </div>

          {/* Formulaire code transaction */}
          <div id="confirmer" className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Confirmer mon paiement</h2>
            <p className="text-sm text-gray-500 mb-5">Après avoir effectué le paiement, saisissez le code de transaction reçu.</p>
            <form onSubmit={handleSoumettreTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Code de transaction <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="Ex : WAVE123456789 ou OM987654321"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Opérateur</label>
                <select
                  value={operateur}
                  onChange={e => setOperateur(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                </select>
              </div>
              {soumitError && <p className="text-red-600 text-sm">{soumitError}</p>}
              <button
                type="submit"
                disabled={isSoumitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#2a591d] text-white rounded-xl font-bold hover:bg-[#1e4215] disabled:opacity-50 transition-colors"
              >
                {isSoumitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Valider mon paiement
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // ── Étape 1 : Formulaire ────────────────────────────────────────────────────
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
            Soutenez le développement de la société civile en Côte d&apos;Ivoire. Chaque don contribue à renforcer les capacités des OSC membres du CRASC.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Votre contribution</h2>
              <form onSubmit={handleSubmitForm} className="space-y-6">

                {/* Montant */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Choisir un montant (FCFA)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                    {MONTANTS.map((m) => (
                      <button key={m} type="button"
                        onClick={() => { setMontantChoisi(m); setMontantLibre(""); }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          montantChoisi === m ? "border-[#E05017] bg-[#E05017] text-white" : "border-gray-200 text-gray-700 hover:border-[#E05017]"
                        }`}>
                        {m.toLocaleString("fr-FR")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number" min="1000"
                    placeholder="Autre montant..."
                    value={montantLibre}
                    onChange={(e) => { setMontantLibre(e.target.value); setMontantChoisi(null); }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  />
                </div>

                {/* Infos obligatoires */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                    <input type="text" name="nom" required value={formData.nom} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prénoms</label>
                    <input type="text" name="prenoms" value={formData.prenoms} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Vos prénoms" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone (Mobile Money) <span className="text-red-500">*</span></label>
                    <input type="tel" name="telephone" required value={formData.telephone} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="+225 XX XX XX XX XX" />
                  </div>
                </div>

                {/* Infos optionnelles */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-[#E05017] hover:underline list-none flex items-center gap-1">
                    <span>+ En savoir plus sur vous (optionnel)</span>
                  </summary>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Fonction</label>
                      <input type="text" name="fonction" value={formData.fonction} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                        placeholder="Votre fonction" />
                    </div>
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
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Pays</label>
                      <input type="text" name="pays" value={formData.pays} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                        placeholder="Votre pays" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Lieu de résidence</label>
                      <input type="text" name="lieu_residence" value={formData.lieu_residence} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                        placeholder="Ville / Quartier" />
                    </div>
                  </div>
                </details>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message (optionnel)</label>
                  <textarea rows={3} name="message" value={formData.message} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-none"
                    placeholder="Un mot d'encouragement..." />
                </div>

                {formError && <p className="text-red-600 text-sm">{formError}</p>}

                <button type="submit" disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#E05017] text-white rounded-xl font-bold text-base hover:bg-[#c44315] disabled:opacity-50 transition-colors">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
                  {isSubmitting ? "Traitement..." : `Faire un don${montantFinal ? ` de ${montantFinal.toLocaleString("fr-FR")} FCFA` : ""}`}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
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
                Moyens de paiement
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Wave</p>
                    <p className="font-mono">+225 07 07 07 07 07</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <Smartphone className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-900">Orange Money</p>
                    <p className="font-mono">+225 05 05 05 05 05</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
