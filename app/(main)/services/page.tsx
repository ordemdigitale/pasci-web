import { ImageWithFallback } from '@/lib/imageWithFallback'


interface IService {
  id: number;
  icon: string;
  name: string;
  content: string;
}

const services: IService[] = [
  {
    id: 1,
    icon: "/icons/icon-appui-conseil.png",
    name: "Appui-Conseil",
    content: "Des conseils stratégiques pour des décisions éclairées et une croissance durable."
  },
  {
    id: 2,
    icon: "/icons/icon-accompagnement.png",
    name: "Accompagnement",
    content: "Un soutien personnalisé à chaque étape de la mise en œuvre de vos projets."
  },
  {
    id: 3,
    icon: "/icons/icon-soutien-administratif.png",
    name: "Soutien Administratif",
    content: "Formalisation et mise en conformité pour une structure solide et transparente."
  },
  {
    id: 4,
    icon: "/icons/icon-redaction.png",
    name: "Rédaction",
    content: "Rédaction de documents professionnels : statuts, règlements, projets, manuels."
  },
  {
    id: 5,
    icon: "/icons/icon-formation.png",
    name: "Formation",
    content: "un processus d'apprentissage structuré qui permet à un individu ou à un groupe d'acquérir des connaissances."
  },
  {
    id: 6,
    icon: "/icons/icon-suivi-evaluation.png",
    name: "Suivi-évaluation",
    content: "Mise en place d'outils et d'indicateurs de performance pour mesurer l’avancement et l’impact des actions menées."
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-5xl text-[#2a591d] leading-tight">Des Services Stratégiques <br />pour le Succès de <br /> Votre Projet</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Au CRASC, nous vous offrons un accompagnement sur mesure, de l'appui-conseil à la rédaction de documents complexes, pour garantir la conformité et l'efficacité de vos initiatives.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/page-service/aa9d2f8c-6d73-497b-ba42-99c54f91cc24.jpg"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-[50px]">Nos Services</p>
        <div className="max-w-5xl mx-auto">
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover-shadow-lg transition-shadow bg-white py-4 px-5"
              >
                {/* Image */}
                <div className="">
                  <ImageWithFallback
                    src={service.icon}
                    alt={service.name}
                    className="w-15 h-15"
                  />
                </div>
                {/* Name and Role */}
                <div className="pl-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm font-medium text-gray-600 py-1 inline-block">{service.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Service Appui-Conseil */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Appui-Conseil</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] p-6 sm:px-6 lg:px-8 border border-gray-200 rounded-lg space-y-6">
          <p>Dans le cadre des appuis et conseils, le CERAP organisé une tournée d&apos;explication sur processus de soumission et les conditions d&apos;éligibilité aux microfinancements et aux subventions. À cette occasion, les équipes ont mis l’accent sur les erreurs à éviter.</p>
        </div>
      </div>

      {/* Service Accompagnement */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Accompagnement</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>L'accompagnement de PASCI va au-delà du simple conseil. Nous marchons à vos côtés pour la mise en œuvre concrète de vos plans d'action. Cet accompagnement peut prendre la forme de coaching d'équipes, de renforcement des capacités, de mentorat pour les leaders ou de gestion déléguée de certaines fonctions clés. Notre objectif est de transférer des compétences et de garantir l'autonomie de vos structures à long terme.</p>          
        </div>
      </div>
      
      {/* Service Soutien Administratif */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Soutien Administratif</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] p-6 sm:px-6 lg:px-8 border border-gray-200 rounded-lg space-y-6">
          <p>Nous vous assistons dans la formalisation de vos statuts, la rédaction de vos règlements intérieurs et la mise en conformité avec les exigences légales et réglementaires. Notre objectif est de structurer votre organisation pour qu'elle opère en toute légalité et efficacité, en minimisant les risques.</p>
        </div>
      </div>

      {/* Service Formation */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Formation</p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg py-8 space-y-6">
          <p>En s'appuyant sur une démarche structurée, ce type d'apprentissage permet non seulement de transmettre des connaissances, mais aussi de développer l'esprit critique, l'autonomie et la capacité à appliquer les acquis dans des contextes réels. Il favorise également l'apprentissage collectif, en encourageant le partage d'expériences et la collaboration entre les participants.</p>
        </div>
      </div>
      
      {/* Service Suivi-évaluation */}
      <div className="py-8">
        <p className="font-bold text-4xl text-center pb-4">Suivi-Évaluation</p>
        <div className="max-w-5xl mx-auto bg-[#f0f9ff] p-6 sm:px-6 lg:px-8 border border-gray-200 rounded-lg space-y-6">
          <p>Au-delà de la mesure, le suivi-évaluation constitue un véritable outil d'aide à la décision. Il permet d'ajuster les stratégies en temps réel, d'optimiser l'utilisation des ressources et de renforcer l'impact des interventions. En assurant une traçabilité des résultats et une évaluation rigoureuse des effets produits, ce service contribue à la transparence, à la redevabilité et à l&apos;amélioration continue des actions menées.</p>
        </div>
      </div>

    </section>
  )
}
