export interface IPoleConcert {
  id: number;
  image?: string;
  poleName: string;
  sections?: string[];
  contents?: string[];
}

export const mockPoleConcert = [
  {
    id: 1,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    poleName: "Agriculture, Sylviculture et Pêche",
    sections: [
      {
        id: 1,
        sectionTitle: "Objectifs annuels du pôle",
        contents: [
          {
            id: 1,
            content: "Agir pour autonomiser les femmes et les jeunes agriculteurs"
          },
          {
            id: 2,
            content: "Maîtriser nos productions et agîr ensemble pour l'autosuffisance alimentaire"
          },
          {
            id: 3,
            content: "Partager nos expériences et transformer nos échecs individuels "
          }
        ]
      },
      {
        id: 2,
        sectionTitle: "Nombre d'OSC membres",
        contents: [
          {
            id: 1,
            content: "757 membres"
          },
          {
            id: 2,
            content: "300 membres actifs"
          },
        ]
      },
    ],
  },
   {
    id: 2,
    image: '/images/espace-collabo/63ac2eed-9ce3-4108-bad4-c7cf536795da.jpg',
    poleName: "Éducation",
    sections: [
      {
        id: 1,
        sectionTitle: "Objectifs annuels du pôle",
        contents: [],
      }
    ],
  },
/*  {
    id: 3,
    image: '/images/espace-collabo/d24228b8-f1e2-4943-a058-124e90667f40.jpg',
    poleName: "Recherche",
    sectionTitle: "Deployment",
    contents: ["Environment Variables", "Build Optimization", "Vercel Hosting"],
  }, */
];