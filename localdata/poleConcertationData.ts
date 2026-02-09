export interface IPoleConcert {
  id: number;
  image?: string;
  poleName: string;
  category: string;
  objectifs: string[];
  membres: string[];
  regions: string[];
  realisations: string[];
  agenda: string[];
}

export const mockPoleConcert: IPoleConcert[] = [
  {
    id: 1,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    poleName: "Pôle Agriculture",
    category: "Agriculture, Sylviculture et Pêche",
    objectifs: [
      "Agir pour autonomiser les femmes et les jeunes agriculteurs ;",
      "Maîtriser nos productions et agir ensemble pour l'autosuffisance alimentaire ;",
      "Partager nos expériences et transformer nos échecs individuels"
    ],
    membres: [
      "757 membres ;",
      "300 membres actifs ;"
    ],
    regions: [
      "Okèkè (115 OSC) ;",
      "Guémon (98 OSC) ;",
      "Folon (77 OSC) ;",
      "Hambol (74 OSC) ;",
      "Bafing (59 OSC) ;"
    ],
    realisations: [
      "118 OSC de jeunes et de femmes autonomes ;",
      "3000 tonnes d'igname et 6000 tonnes de manioc produits 2025 ;",
      "50 renforcements de capacités ;"
    ],
    agenda: [
      "Formation sur les types de contrats de terres rurales le 10 mai 2026 ;",
      "Journées des jeunes agriculteurs du Guémon du 2 au 5 juin 2026 ;"
    ]
  },
  {
    id: 2,
    image: '/images/espace-collabo/63ac2eed-9ce3-4108-bad4-c7cf536795da.jpg',
    poleName: "Pôle Éducation",
    category: "Education",
    objectifs: [
      "Lutter contre les fléaux (grossesse, scolisme, drogue, etc.) scolaires ;",
      "Mutualiser les forces et créer des AGR pour auto-financer les projets communs ;",
      "Renforcer les capacités techniques, structurelles et matérielles des OSC;"
    ],
    membres: [
      "472 membres ;",
      "100 membres actifs ;"
    ],
    regions: [
      "Gbêkê (69 OSC) ;",
      "Guémon (29 OSC) ;",
      "Folon (77 OSC) ;",
      "Hambol (74 OSC) ;"
    ],
    realisations: [
      "118 OSC de jeunes et de femmes autonomes ;",
      "3000 tonnes d'igname et 6000 tonnes de manioc produisent 2025 ;",
      "50 renforcements de capacités ;"
    ],
    agenda: [
      "Formation sur les types de contrats de terres rurales le 10 mai 2026 ;",
      "Journées des jeunes agriculteurs du Guémon du 2 au 5 juin 2026 ;"
    ]
  },
  {
    id: 3,
    image: '/images/espace-collabo/d24228b8-f1e2-4943-a058-124e90667f40.jpg',
    poleName: "Pôle Commerce et Tourisme",
    category: "Commerce et Tourisme",
    objectifs: [
      "Promouvoir le commerce équitable et les circuits courts ;",
      "Développer le tourisme local et valoriser le patrimoine culturel ;",
      "Renforcer les capacités des acteurs du secteur commercial et touristique ;"
    ],
    membres: [
      "385 membres ;",
      "150 membres actifs ;"
    ],
    regions: [
      "Lagunes (92 OSC) ;",
      "Montagnes (65 OSC) ;",
      "Comoé (48 OSC) ;",
      "Nzi (41 OSC) ;"
    ],
    realisations: [
      "75 OSC accompagnées dans la structuration de leurs activités commerciales ;",
      "12 circuits touristiques créés en collaboration avec les communautés locales ;",
      "40 formations sur l'entrepreneuriat et le marketing digital ;"
    ],
    agenda: [
      "Salon du commerce local et de l'artisanat le 15 mars 2026 ;",
      "Formation sur le tourisme communautaire du 20 au 22 avril 2026 ;"
    ]
  }
];