import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import PolesAndOpportunities from '@/components/espacecollabpage/PolesAndOpportunities';

export default function CollaborativeSpacePage() {
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-6">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Améliorer la coordination</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Au nombre de 11, les pôles de concertation sont espaces de discussion, de libres échanges et de valorisation des domaines prioritaires des OSC. Ils sont les regroupements de l&apos;ensemble des OSC volontairement engagés dans la recherche des conditions de vie meilleure des acteurs du pôle. Les sujets abordés et discutés ne sauraient en aucun cas se détourner des principaux objectifs que l&apos;on s&apos;est assigné. Réservés uniquement aux OSC inscrits sur la plateforme, les partages, les échanges et les discussions s&apos;opèrent dans une dynamique de respect mutuel, de vivre ensemble et l&apos;intérêt commun des membres.
          </p>
          <Button className="mt-12 border border-[#E05017] bg-[#E05017] text-white hover:text-[#E05017] hover:bg-white rounded-lg px-6">
            Explorer les pôles
          </Button>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/espace-collab-page-thumb.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <PolesAndOpportunities/>

    </section>
  )
}
