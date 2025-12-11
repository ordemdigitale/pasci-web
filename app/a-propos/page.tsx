import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'

import ActualitiesEvents from '@/components/aboutpage/ActuEvents';

interface PasciTeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
}

const teamMembers: PasciTeamMember[] = [
  {
    id: 1,
    name: 'Laborum nisi',
    position: 'Chef de Projet',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc2MzIyMjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Laborum nisi',
    position: 'Architecte Logiciel',
    image: 'https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYzMTA2NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Laborum nisi',
    position: 'Spécialiste Cybersécurité',
    image: 'https://images.unsplash.com/photo-1623177578701-2727010a3f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjB3b3JraW5nJTIwb2ZmaWNlfGVufDF8fHx8MTc2MzIyMjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'Laborum nisi',
    position: 'Responsable Communication',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc2MzIyMjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 5,
    name: 'Laborum nisi',
    position: 'Développeur Principal',
    image: 'https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYzMTA2NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 6,
    name: 'Laborum nisi',
    position: "Analyste Support",
    image: 'https://images.unsplash.com/photo-1623177578701-2727010a3f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjB3b3JraW5nJTIwb2ZmaWNlfGVufDF8fHx8MTc2MzIyMjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

interface IItems {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default async function AboutPage() {
  /* const response = await fetch("http://localhost:8000/api/v1/items");
  const data: IItems[] = await response.json();
  console.log("Items data fetched from fastapi :", data); */
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Les CRASC pensent social pour l'avenir</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Les CRASC (Centre Régional d'Appui à la Société Civile) est une initiative avant-gardiste visant à transformer les services numériques grâce à l'intelligence artificielle et l'apprentissage automatique. Nous développons des solutions innovantes pour optimiser les interactions utilisateurs, automatiser les processus complexes et fournir des analyses prédictives fiables.
          </p>
          <h2 className="text-gray-900 font-bold text-xl mt-6">Contexte</h2>
          <p className="text-gray-600 text-sm max-w-xl">
            Dans un monde où la numérisation s'accélère, les organisations font face à des défis croissants en matière de gestion de données, d'efficacité opérationnelle et de personnalisation de l'expérience client. PASCI répond à ces besoins en offrant une infrastructure robuste et des outils intelligents pour naviguer dans cet écosystème numérique en constante évolution.
          </p>
          <h2 className="text-gray-900 font-bold text-xl mt-6">Objectifs</h2>
          <p className="text-gray-600 text-sm max-w-xl">
            Nos principaux objectifs incluent l'amélioration de l'engagement client, la réduction des coûts opérationnels, la sécurisation des échanges de données, et l'autonomisation des entreprises à travers des insights basés sur l'IA. Nous visons à créer un écosystème numérique plus intelligent, plus intuitif et plus sûr pour tous.
          </p>
          <h2 className="text-gray-900 font-bold text-xl mt-6">Mission</h2>
          <p className="text-gray-600 text-sm max-w-xl">
            La mission de PASCI est de démocratiser l'accès aux technologies d'IA avancées, permettant à chaque entreprise, quelle que soit sa taille, de tirer pleinement parti de la révolution numérique. Nous nous engageons à construire des outils éthiques, transparents et performants qui redéfinissent les standards de l'innovation et de l'impact social.
          </p>
          <Button className="mt-12 border border-[#E05017] bg-[#E05017] text-white hover:text-[#E05017] hover:bg-white rounded-lg px-6">Explorer toutes les actualités</Button>
        </div>
        

        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/about-page-thumb-1.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="">
            <ImageWithFallback
              src="/images/about-page-thumb-2.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Équipe PASCI */}
      <div className="bg-gray-100 py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Équipe PASCI</p>
        <div className="max-w-5xl mx-auto">
          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover-shadow-lg transition-shadow bg-white items-center justify-center flex flex-col py-6"
              >
                {/* Image */}
                <div className="">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 object-cover hover:scale-105 transition-transform duration-300 rounded-full"
                  />
                </div>
                {/* Name and Role */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm font-medium bg-gray-100 text-gray-600 rounded-full px-3 py-1 inline-block">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actualités et Événements */}
      <div></div>
      <ActualitiesEvents />

      {/* <div>
      <p>Hello World Page</p>
      <ul className="events">
        {data.map((d)=>(
          <li key={d.id}>
            <p>{d.name}</p>
            <p>{d.description}</p>
            <p>{d.price}</p>
          </li>
        ))}
      </ul>
    </div> */}

    </section>
  )
}
