"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Facebook, Linkedin } from 'lucide-react';
import { ImageWithFallback } from '@/lib/imageWithFallback';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
    alert('Message envoyé avec succès!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="mx-auto pt-12 font-poppins">
      
      <div className="px-4 sm:px-6 lg:px-8 bg-gray-100 pb-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h2 className="text-gray-900 font-bold text-3xl">Connectez-vous avec le projet PASCI</h2>

            <p className="text-gray-600 text-lg max-w-xl">
              Nous sommes là pour répondre à vos questions et vous fournir toute l'assistance nécessaire. N'hésitez pas à nous contacter.
            </p>

            <Button 
              variant="outline" 
              className="border border-[#E05017] bg-[#E05017] text-white hover:text-[#e05017] hover:bg-white rounded-lg"
            >
              Envoyez-nous un message
            </Button>
          </div>

          {/* Right content */}
          <div>
            <div className="">
              <ImageWithFallback
                src="/images/contact-page-thumbnail.png"
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
              <h2 className="text-gray-900 font-bold text-xl">Contactez-nous</h2>
              
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-gray-700 font-medium">
                    Votre nom
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Votre adresse e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42]"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-gray-700 font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-[#f5f5f5] border-gray-200 focus:border-[#ff8c42] focus:ring-[#ff8c42] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full border border-[#E05017] bg-[#E05017] text-white hover:text-[#e05017] hover:bg-white rounded-lg py-6"
                >
                  Envoyer le message
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
                    (+225) 27 22 40 47 20 / 07 08 26 67 68
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <h3 className="text-gray-900 font-bold">Contact par e-mail</h3>
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-[#E05017] flex-shrink-0 mt-1" />
                  <a
                    href="mailto:contact@crasc-inades.org"
                    className="text-[#E05017] hover:underline"
                  >
                    contact@crasc-inades.org
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <h3 className="text-gray-900 font-bold">Suivez-nous</h3>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.2967654076436!2d-3.9876543!3d5.3599517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMzUuOCJOIDPCsDU5JzE1LjYiVw!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="CRASC Location Map"
        />
      </section>
      
    </section>
  )
}
