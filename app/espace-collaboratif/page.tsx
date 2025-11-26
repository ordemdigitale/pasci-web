import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import PolesAndOpportunities from '@/components/espacecollabpage/PolesAndOpportunities';

export default function CollaborativeSpacePage() {
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Partager des idées, de communiquer facilement</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Connectez-vous, échangez et construisez ensemble l'avenir du développement social. Un lieu pour partager les idées, trouver des partenariats et obtenir des réponses
          </p>
          <Button className="mt-12 border border-[#E05017] bg-[#E05017] text-white hover:text-[#E05017] hover:bg-white rounded-lg px-6">
            Explorer les pôles
          </Button>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/contact-page-thumbnail.png"
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
