"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Facebook, Linkedin, CheckCircle, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '@/lib/imageWithFallback';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const emptyForm = {
  categorie_acteur: '',
  nom: '',
  prenoms: '',
  fonction: '',
  sexe: '',
  tranche_age: '',
  email: '',
  contact: '',
  pays: '',
  lieu_residence: '',
  motif: '',
  message: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categorie_acteur: formData.categorie_acteur || null,
          fonction: formData.fonction || null,
          sexe: formData.sexe || null,
          tranche_age: formData.tranche_age || null,
          contact: formData.contact || null,
          pays: formData.pays || null,
          lieu_residence: formData.lieu_residence || null,
          message: formData.message || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Erreur lors de l\'envoi.');
      }
      setSuccess(true);
      setFormData(emptyForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <section className="mx-auto pt-12 font-poppins">
      
      <div className="px-4 sm:px-6 lg:px-8 bg-gray-100 pb-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h2 className="text-[#2a591d] font-bold text-5xl">Nous contacter</h2>

            <p className="text-gray-600 text-lg max-w-xl">
              Nous sommes là pour répondre à vos questions et vous fournir toute l'assistance nécessaire. Ne pas hésiter à nous contacter.
            </p>
          </div>

          {/* Right content */}
          <div>
            <div className="">
              <ImageWithFallback
                src="/images/contact-page/ef1309d0-dff3-4721-9bc8-0155ac89e0cb.jpg"
                alt="image"
                className="w-full h-[300px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form and Info Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - Contact Form */}
            <div className="space-y-6 border border-gray-200 rounded-lg p-8">
              <h2 className="text-gray-900 font-bold text-xl">Nous contacter</h2>
              
              <p className="text-gray-600">
                Remplir le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Catégorie d'acteurs */}
                <div className="space-y-2">
                  <label htmlFor="categorie_acteur" className="text-gray-700 font-medium">Catégorie d&apos;acteurs</label>
                  <select
                    id="categorie_acteur"
                    name="categorie_acteur"
                    value={formData.categorie_acteur}
                    onChange={handleChange}
                    className="w-full bg-[#f5f5f5] border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ff8c42] focus:ring-1 focus:ring-[#ff8c42]"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Organisation de la Société Civile OSC">Organisation de la Société Civile OSC</option>
                    <option value="Acteurs étatiques">Acteurs étatiques</option>
                    <option value="Partenaires Techniques et Financiers PTF">Partenaires Techniques et Financiers (PTF)</option>
                    <option value="Grand public">Grand public</option>
                  </select>
                </div>

                {/* Nom & Prénoms */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="nom" className="text-gray-700 font-medium">Nom <span className="text-red-500">*</span></label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="prenoms" className="text-gray-700 font-medium">Prénoms <span className="text-red-500">*</span></label>
                    <Input
                      id="prenoms"
                      name="prenoms"
                      type="text"
                      placeholder="Vos prénoms"
                      value={formData.prenoms}
                      onChange={handleChange}
                      required
                      className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                    />
                  </div>
                </div>

                {/* Fonction */}
                <div className="space-y-2">
                  <label htmlFor="fonction" className="text-gray-700 font-medium">Fonction</label>
                  <Input
                    id="fonction"
                    name="fonction"
                    type="text"
                    placeholder="Votre fonction"
                    value={formData.fonction}
                    onChange={handleChange}
                    className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                  />
                </div>

                {/* Sexe & Tranche d'âge */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="sexe" className="text-gray-700 font-medium">Sexe</label>
                    <select
                      id="sexe"
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleChange}
                      className="w-full bg-[#f5f5f5] border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ff8c42] focus:ring-1 focus:ring-[#ff8c42]"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tranche_age" className="text-gray-700 font-medium">Tranche d&apos;âge</label>
                    <select
                      id="tranche_age"
                      name="tranche_age"
                      value={formData.tranche_age}
                      onChange={handleChange}
                      className="w-full bg-[#f5f5f5] border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ff8c42] focus:ring-1 focus:ring-[#ff8c42]"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="-18 ans">Moins de 18 ans</option>
                      <option value="18 à 35 ans">18 à 35 ans</option>
                      <option value="+35 ans">Plus de 35 ans</option>
                    </select>
                  </div>
                </div>

                {/* Email & Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact" className="text-gray-700 font-medium">Contact</label>
                    <Input
                      id="contact"
                      name="contact"
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      value={formData.contact}
                      onChange={handleChange}
                      className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                    />
                  </div>
                </div>

                {/* Pays & Lieu de résidence */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="pays" className="text-gray-700 font-medium">Pays</label>
                    <Input
                      id="pays"
                      name="pays"
                      type="text"
                      placeholder="Votre pays"
                      value={formData.pays}
                      onChange={handleChange}
                      className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lieu_residence" className="text-gray-700 font-medium">Lieu de résidence</label>
                    <Input
                      id="lieu_residence"
                      name="lieu_residence"
                      type="text"
                      placeholder="Ville / Quartier"
                      value={formData.lieu_residence}
                      onChange={handleChange}
                      className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                    />
                  </div>
                </div>

                {/* Motif (obligatoire) */}
                <div className="space-y-2">
                  <label htmlFor="motif" className="text-gray-700 font-medium">Motif <span className="text-red-500">*</span></label>
                  <select
                    id="motif"
                    name="motif"
                    value={formData.motif}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f5f5f5] border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ff8c42] focus:ring-1 focus:ring-[#ff8c42]"
                  >
                    <option value="">-- Sélectionner un motif --</option>
                    <option value="Renseignement">Renseignement</option>
                    <option value="Formation">Formation</option>
                    <option value="Bénévolat">Bénévolat</option>
                    <option value="Recherche">Recherche</option>
                    <option value="Adhésion">Adhésion</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-gray-700 font-medium">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Écrire votre message ici"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full border border-[#E05017] bg-[#E05017] text-white hover:text-[#e05017] hover:bg-white rounded-lg py-6 disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
                    </span>
                  ) : 'Envoyer le message'}
                </Button>
              </form>
            </div>

            {/* Right - Contact Information */}
            <div className="space-y-8 border border-gray-200 rounded-lg p-8">
              <h2 className="text-gray-900 font-bold text-xl">Nos coordonnées</h2>

              {/* Address */}
              <div className="space-y-3">
                <h3 className="text-gray-900 font-bold">Adresse du bureau</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-[#E05017] flex-shrink-0 mt-1" />
                  <p className="text-gray-600">
                    15, avenue Jean-Mermoz, Cocody Abidjan, Côte d'Ivoire
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="space-y-3">
                <h3 className="text-gray-900 font-bold">Numéro de téléphone</h3>
                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-[#E05017] flex-shrink-0 mt-1" />
                  <p className="text-gray-600">
                    05 05 56 57 41
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <h3 className="text-gray-900 font-bold">Contact par e-mail</h3>
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-[#E05017] flex-shrink-0 mt-1" />
                  <a
                    href="mailto:pdoc@plateforme-osci.org"
                    className="text-[#E05017] hover:underline"
                  >
                    pdoc@plateforme-osci.org
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <h3 className="text-gray-900 font-bold">Nous suivre</h3>
                <div className="flex gap-4">
                  <a
                    href="#facebook"
                    className="size-10 rounded-full bg-gray-100 hover:bg-[#E05017] flex items-center justify-center transition-colors group"
                    aria-label="Facebook"
                  >
                    <Facebook className="size-5 text-gray-700 group-hover:text-white" />
                  </a>
                  <a
                    href="#linkedin"
                    className="size-10 rounded-full bg-gray-100 hover:bg-[#E05017] flex items-center justify-center transition-colors group"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="size-5 text-gray-700 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* Map Section */}
      <section className="w-full h-[400px] lg:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15890.01803822938!2d-4.000601!3d5.339672!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb77cd9cd065%3A0x9ecf98221f1475c8!2sCERAP!5e0!3m2!1sfr!2sci!4v1764181760882!5m2!1sfr!2sci"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="CERAP-Location"
        />
      </section>
      
    </section>
  )
}
