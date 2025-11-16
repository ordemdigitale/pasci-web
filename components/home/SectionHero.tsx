import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"

export default function SectionHero() {
  return (
    <section className="bg-gradient-to-br from-[#fef5f0] via-[#fff9f5] to-[#ffe8dc] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-[#ff8c42]/10 text-[#ff8c42] px-4 py-2 rounded-full text-sm tracking-wide">
                Welcome to MOMS Community
              </span>
            </div>
            
            <h1 className="text-gray-900">
              Empowering Mothers
              <br />
              <span className="text-[#ff8c42]">Every Step of the Way</span>
            </h1>
            
            <p className="text-gray-600 text-lg max-w-xl">
              Join thousands of mothers sharing experiences, finding support, and 
              discovering resources that make parenting easier and more joyful.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#ff8c42] hover:bg-[#ff7a28] text-white rounded-full px-8 py-6 text-lg group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] rounded-full px-8 py-6 text-lg group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Video
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-[#ff8c42] text-3xl">50K+</div>
                <p className="text-gray-600 text-sm">Active Members</p>
              </div>
              <div>
                <div className="text-[#ff8c42] text-3xl">1M+</div>
                <p className="text-gray-600 text-sm">Stories Shared</p>
              </div>
              <div>
                <div className="text-[#ff8c42] text-3xl">24/7</div>
                <p className="text-gray-600 text-sm">Support Available</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1663045281813-c7407a6ec613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMG1vdGhlciUyMGNoaWxkJTIwZmFtaWx5fGVufDF8fHx8MTc2MzIyMTU3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy mother with child"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ff8c42] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#ff8c42] rounded-full opacity-20 blur-2xl"></div>
            </div>

            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-lg p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="bg-[#ff8c42]/10 p-3 rounded-full">
                  <svg className="w-6 h-6 text-[#ff8c42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900">Trusted Community</p>
                  <p className="text-gray-500 text-sm">Verified members only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
