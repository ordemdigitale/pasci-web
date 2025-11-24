import { Facebook, Linkedin } from 'lucide-react';
import footerLogo from 'figma:asset/b43efaef04948e9d9cfc8116775c87a868a332af.png';
import { ImageWithFallback } from "@/lib/imageWithFallback"

export default function Footer() {
  return (
    <footer className="bg-[#052838] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <ImageWithFallback
              src="/images/logo.png"
              alt="CRASC Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Architecture Column */}
          <div>
            <h3 className="text-white mb-4">Architecture</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Annuaire des CRASC
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Statistiques
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Espace Collaboratif
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources Column */}
          <div>
            <h3 className="text-white mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Formation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Cours
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Vidéos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Audio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Foires Aux Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Organisation CRASC Column */}
          <div>
            <h3 className="text-white mb-4">Organisation CRASC</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Rejoignez-nous
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white mb-4">Contactez nous</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>15, avenue Jean Mermoz, Cocody, Abidjan, Côte d'Ivoire</p>
              
              <div>
                <p className="mb-1">Numéro de téléphone</p>
                <p className="text-white">(+225) 27 22 40 47 20 / 07 09 26 67 66</p>
              </div>

              <p>
                e-mail : <a href="mailto:contact@crasc.ivoire.org" className="text-white hover:underline">
                  contact@crasc.ivoire.org
                </a>
              </p>

              <div className="pt-2">
                <p className="mb-2">Suivez-Nous sur :</p>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a 
                    href="#" 
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-400">
          <p>Copyright © 2025 Projet PASCI. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Conditions Générales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
