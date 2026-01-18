export interface IOffreProjet {
  id: number;
  image?: string;
  nom: string;
  osc?: string;
  domaine?: string;
  zone?: string;
  durée?: string;
  budget?: string;
  objectif?: string;
}

export const offreProjet = [
  {
    id: 1,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Assainissement des quartiers précaires d'Abidjan",
    osc: "Initiave Eau Claire",
    domaine: "Environnement",
    zone: "Abidjan",
    durée: "18 mois",
    budget: "25 000 000 XOF",
    objectif: "Améliorer l'accès à l'eau potable et l'hygiène pour 10 000 habitants.",
  },
  {
    id: 2,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Éducation numérique pour les jeunes de Bouaké",
    osc: "Initiave Eau Claire",
    domaine: "Environnement",
    zone: "Abidjan",
    durée: "18 mois",
    budget: "25 000 000 XOF",
    objectif: "Améliorer l'accès à l'eau potable et l'hygiène pour 10 000 habitants.",
  },
  {
    id: 3,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Promotion de l'artisanat traditionnel à Yamoussoukro",
    osc: "Initiave Eau Claire",
    domaine: "Environnement",
    zone: "Abidjan",
    durée: "18 mois",
    budget: "25 000 000 XOF",
    objectif: "Améliorer l'accès à l'eau potable et l'hygiène pour 10 000 habitants.",
  },
  {
    id: 4,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Accès aux soins de santé primaires à Korhogo",
    osc: "Initiave Eau Claire",
    domaine: "Environnement",
    zone: "Abidjan",
    durée: "18 mois",
    budget: "25 000 000 XOF",
    objectif: "Améliorer l'accès à l'eau potable et l'hygiène pour 10 000 habitants.",
  },  
];