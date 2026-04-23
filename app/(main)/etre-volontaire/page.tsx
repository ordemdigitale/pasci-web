"use client";

import { useState } from "react";
import { Heart, Users, CheckCircle, ArrowRight, Briefcase, Globe } from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DOMAINES = [
  "Formation & Renforcement des capacités",
  "Plaidoyer & Droits humains",
  "Environnement & Développement durable",
  "Santé & Bien-être",
  "Éducation & Jeunesse",
  "Genre & Inclusion sociale",
  "Gouvernance & Démocratie",
  "Autre",
];

export default function EtreVolontairePage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [profession, setProfession] = useState("");
  const [domaine, setDomaine] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [motivation, setMotivation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domaine) {
      toast.error("Veuillez choisir un domaine d'intervention.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/volontaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          telephone: telephone || null,
          profession: profession || null,
          domaine,
          disponibilite: disponibilite || null,
          motivation,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Une erreur est survenue.");
      }
      setSubmitted(true);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidature envoyée !</h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre engagement. Notre équipe examinera votre candidature et vous contactera dans les meilleurs délais.
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
            <Users className="w-7 h-7 text-[#E05017]" />
          </div>
          <h1 className="text-4xl font-bold text-[#2a591d] mb-3">Être volontaire</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Rejoignez notre réseau de volontaires et contribuez au renforcement de la société civile
            en Côte d'Ivoire. Vos compétences peuvent faire la différence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Votre candidature</h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Infos personnelles */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="+225 07 00 00 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Profession / Expertise
                    </label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                      placeholder="Ex : Juriste, Formateur..."
                    />
                  </div>
                </div>

                {/* Domaine */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Domaine d'intervention <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={domaine}
                    onChange={(e) => setDomaine(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white"
                  >
                    <option value="">Sélectionner un domaine...</option>
                    {DOMAINES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Disponibilité
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Temps plein", "Mi-temps", "Week-ends", "Ponctuellement"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDisponibilite(d)}
                        className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                          disponibilite === d
                            ? "border-[#E05017] bg-[#E05017] text-white"
                            : "border-gray-200 text-gray-700 hover:border-[#E05017]"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Motivation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-none"
                    placeholder="Décrivez brièvement pourquoi vous souhaitez devenir volontaire et ce que vous pouvez apporter..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#E05017] text-white rounded-xl font-bold text-base hover:bg-[#c44315] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Envoi en cours..." : (
                    <>
                      <Heart className="w-5 h-5" />
                      Envoyer ma candidature
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#2a591d] text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-3">Pourquoi s'engager ?</h3>
              <ul className="space-y-3 text-sm text-white/90">
                {[
                  "Mettre vos compétences au service de la société civile",
                  "Participer à des formations et événements",
                  "Élargir votre réseau professionnel",
                  "Contribuer au développement durable de la Côte d'Ivoire",
                  "Acquérir de nouvelles expériences terrain",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Profils recherchés</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#E05017]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase className="w-4 h-4 text-[#E05017]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Experts & Consultants</p>
                    <p>Juristes, économistes, formateurs, communicants...</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#E05017]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-[#E05017]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Acteurs du terrain</p>
                    <p>Membres d'OSC, agents de développement communautaire...</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#E05017]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-[#E05017]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Jeunes engagés</p>
                    <p>Étudiants, jeunes professionnels motivés par l'impact social...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Contact</h3>
              <p className="text-sm text-gray-600">Pour toute question sur le volontariat :</p>
              <p className="text-sm mt-2"><span className="font-semibold">Email :</span> pdoc@plateforme-osci.org</p>
              <p className="text-sm"><span className="font-semibold">Tél :</span> 05 05 56 57 41</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
