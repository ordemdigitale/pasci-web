import Link from 'next/link';
import { Facebook, Linkedin } from 'lucide-react';
import footerLogo from 'figma:asset/b43efaef04948e9d9cfc8116775c87a868a332af.png';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import VisiteCounter from "./VisiteCounter";

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
            <h3 className="text-white mb-4 font-bold">Architecture</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-white text-sm transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/annuaire/annuaire-des-crasc" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Annuaire des OSC
                </Link>
              </li>
              <li>
                <Link href="/annuaire/annuaire-des-partenaires-techniques-et-financiers" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Annuaire des PTF
                </Link>
              </li>
              <li>
                <Link href="/espace-collaboratif/pole-concertation" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Pôle de concertation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources Column */}
          <div>
            <h3 className="text-white mb-4 font-bold">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/formations" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Formation
                </Link>
              </li>
              <li>
                <Link href="/ressources" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Documentation & Fiches
                </Link>
              </li>
              <li>
                <Link href="/espace-collaboratif/offres-emploi" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Offres d'emploi
                </Link>
              </li>
              <li>
                <Link href="/offre-projets" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Offres de projets
                </Link>
              </li>
            </ul>
          </div>

          {/* Organisation CRASC Column */}
          <div>
            <h3 className="text-white mb-4 font-bold">Organisation CRASC</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-white text-sm transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/rejoindre" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Adhérer au CRASC
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link href="/numeros-utiles" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Numéros utiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white mb-4 font-bold">Nous contacter</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>15, avenue Jean Mermoz, Cocody, Abidjan, Côte d'Ivoire</p>
              
              <div>
                <p className="mb-1">Numéro de téléphone</p>
                <p className="text-white">05 05 56 57 41</p>
              </div>

              <p>
                e-mail : <a href="mailto:pdoc@plateforme-osci.org" className="text-white hover:underline">
                  pdoc@plateforme-osci.org
                </a>
              </p>

              <div className="pt-2">
                <p className="mb-2">Nous suivre sur :</p>
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
        <div className="flex flex-col md:flex-col justify-center items-center gap-4 text-sm text-gray-300">
          <p>Copyright © 2026 PdoC. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>

            <Link href="/conditions-generales" className="hover:text-white transition-colors">
              Conditions Générales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
