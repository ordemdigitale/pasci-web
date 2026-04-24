import Link from 'next/link'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import { Building2, Users } from 'lucide-react'

export default function AnnuairePage() {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg p-8 mb-10">
        <div className="pb-6">
          <h2 className="text-[#2a591d] font-bold text-3xl pb-2">Annuaires</h2>
          <p className="mb-3">
            Explorez notre base de données complète regroupant les Centres Régionaux d'Appui à la Société Civile (CRASC),
            les Organisations de la Société Civile (OSC) et les Partenaires Techniques et Financiers (PTF).
          </p>
          <p className="mb-3">
            Ces annuaires vous permettent d'accéder rapidement aux informations de contact, domaines d'intervention et
            zones de couverture de chaque acteur, facilitant ainsi la collaboration et le partage d'expériences.
          </p>
        </div>
      </div>

      {/* Annuaires Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="font-bold text-3xl mb-8 text-center">Choisir un annuaire</h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Annuaire des CRASC */}
          <Link href="/annuaire/annuaire-des-crasc">
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src="/images/page-annuaire-crasc/crasc-building.jpg"
                  alt="Annuaire des CRASC"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Annuaire des CRASC</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Découvrir les 5 Centres Régionaux d'Appui à la Société Civile répartis sur tout le territoire ivoirien.
                  Chaque CRASC accompagne les OSC de sa zone géographique.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#E05017] font-semibold group-hover:underline">
                    Explorer les CRASC →
                  </span>
                  <span className="text-sm text-gray-500">5 CRASC</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Annuaire des OSC */}
          <Link href="/annuaire/annuaire-des-osc">
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src="/images/page-annuaire-crasc/osc-group.jpg"
                  alt="Annuaire des OSC"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Annuaire des OSC</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Consultez le répertoire complet des Organisations de la Société Civile membres des CRASC.
                  Trouvez des partenaires et collaborez sur des projets communs.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#E05017] font-semibold group-hover:underline">
                    Explorer les OSC →
                  </span>
                  <span className="text-sm text-gray-500">OSC actives</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Annuaire des PTF */}
          <Link href="/annuaire/annuaire-des-partenaires-techniques-et-financiers">
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group cursor-pointer md:col-span-2">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <ImageWithFallback
                    src="/images/page-annuaire-crasc/partners.jpg"
                    alt="Annuaire des PTF"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:hidden">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">Annuaire des Partenaires Techniques et Financiers</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="hidden md:flex items-center gap-3 mb-4">
                    <Building2 className="w-8 h-8 text-[#2a591d]" />
                    <h3 className="text-2xl font-bold text-gray-900">Annuaire des Partenaires Techniques et Financiers</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Accédez à la liste des Partenaires Techniques et Financiers qui soutiennent les initiatives de la société civile.
                    Identifiez des opportunités de financement et d'appui technique pour vos projets.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#E05017] font-semibold group-hover:underline">
                      Explorer les PTF →
                    </span>
                    <span className="text-sm text-gray-500">Partenaires actifs</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="bg-[#E05017] rounded-lg py-12 px-8 text-center text-white">
          <h3 className="font-bold text-3xl mb-4">Vous ne trouvez pas ce que vous cherchez ?</h3>
          <p className="max-w-2xl mx-auto mb-6">
            Nous contacter pour obtenir plus d'informations ou pour ajouter votre organisation à nos annuaires.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#E05017] rounded-lg transition-colors font-semibold"
          >
            Nous Contacter
          </Link>
        </div>
      </div>

    </section>
  )
}
