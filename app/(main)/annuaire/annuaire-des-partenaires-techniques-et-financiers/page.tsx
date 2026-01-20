"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import { IPTF } from '@/types/api.types';
import Link from 'next/link';

export default function PageAnnuairePTF() {
  const [ptfData, setPtfData] = useState<IPTF[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/ptf');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setPtfData(result);
      } catch (error: any) {
        setError(error.message || "Impossible de charger les PTF.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ptfData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-600">
        {error || "PTF non trouvé."}
      </div>
    );
  }

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[#2a591d] font-bold text-4xl text-center mx-auto w-180 pb-[50px]">Annuaire des Partenaires Techniques et Financiers (PTF)</p>
      </div>
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 p-8 mb-10 grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#E05017] font-bold text-4xl">Ensemble, nous pouvons renforcer l&apos;impact</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Notre communauté open source est dédiée à la promotion de l'innovation et à la collaboration à travers des projets transformateurs. Nous croyons au pouvoir du partage des connaissances et des ressources pour résoudre des défis complexes.
          </p>
          <p className='font-bold text-2xl mt-6'>Notre Mission</p>
          <p className="text-gray-600 text-md max-w-xl mt-2">
            Nous nous engageons à créer des solutions durables et accessibles qui ont un impact positif sur le monde. En favorisant un environnement inclusif, nous permettons aux développeurs et aux contributeurs de tous horizons de s'épanouir, en créant des outils et des technologies qui façonnent un avenir meilleur pour tous.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Activity Cards Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {ptfData.map((ptf) => (
            <div key={ptf.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={ptf.thumbnail_url}
                  alt={ptf.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <Link href={`/annuaire/annuaire-des-partenaires-techniques-et-financiers/${ptf.slug}`}>
                  <h3 className="mb-3 text-center font-bold hover:underline">{ptf.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ptf.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}