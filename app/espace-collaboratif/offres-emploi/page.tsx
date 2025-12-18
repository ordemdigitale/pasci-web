import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import OffreEmploiFAQ from '@/components/offreemploi/OffreEmploiFAQ'

export default function PageOffreEmploi() {
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 p-8 mb-10 grid lg:grid-cols-2 gap-6">
        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-4xl">Rejoignez l'équipe</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Découvrez les opportunités de carrière passionnantes et faites partie de notre mission de transformer l'avenir. Chez PASCI, nous construisons des solutions innovantes avec des talents exceptionnels.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/offre-emploi-page/4c9598b7-96fa-4ba1-bae8-5be6202c4bd6.jpg"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <OffreEmploiFAQ/>
    </section>
  )
}
