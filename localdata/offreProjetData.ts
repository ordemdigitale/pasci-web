export interface IOffreProjet {
  id: number;
  slug: string;
  image?: string;
  nom: string;
  osc: string;
  domaine: string;
  zone: string;
  durée: string;
  budget: string;
  offre_url?: string;
  objectif: string;
  description?: string;
  contexte?: string;
  beneficiaires?: string;
  resultats_attendus?: string[];
  partenaires?: string[];
  date_publication?: string;
  statut?: string;
}

export const offreProjet: IOffreProjet[] = [
  {
    id: 1,
    slug: "assainissement-quartiers-precaires-abidjan",
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Assainissement des quartiers précaires d'Abidjan",
    osc: "Initiative Eau Claire",
    domaine: "Environnement",
    zone: "Abidjan",
    durée: "18 mois",
    budget: "25 000 000 FCFA",
    objectif: "Améliorer l'accès à l'eau potable et l'hygiène pour 10 000 habitants.",
    description: "Ce projet vise à transformer les conditions de vie dans les quartiers précaires d'Abidjan en développant des infrastructures d'assainissement durables et en sensibilisant les populations aux bonnes pratiques d'hygiène.",
    contexte: "Les quartiers précaires d'Abidjan font face à des défis majeurs en matière d'accès à l'eau potable et à l'assainissement. Cette situation entraîne des risques sanitaires importants pour les populations vulnérables.",
    beneficiaires: "10 000 habitants des quartiers précaires d'Abidjan, dont 60% de femmes et d'enfants",
    resultats_attendus: [
      "Construction de 50 points d'eau potable",
      "Installation de 200 latrines communautaires",
      "Formation de 100 agents d'hygiène communautaires",
      "Sensibilisation de 5 000 ménages aux bonnes pratiques"
    ],
    partenaires: ["Mairie d'Abidjan", "UNICEF", "OMS"],
    date_publication: "2026-01-15",
    statut: "Ouvert"
  },
  {
    id: 2,
    slug: "education-numerique-jeunes-bouake",
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Éducation numérique pour les jeunes de Bouaké",
    osc: "Tech For Youth CI",
    domaine: "Éducation",
    zone: "Bouaké",
    durée: "24 mois",
    budget: "35 000 000 FCFA",
    objectif: "Former 500 jeunes aux compétences numériques et créer 3 centres de formation.",
    description: "Programme de formation intensive aux métiers du numérique destiné aux jeunes de Bouaké, incluant la création de centres de formation équipés et un accompagnement à l'insertion professionnelle.",
    contexte: "La ville de Bouaké présente un fort potentiel de jeunes talents mais manque cruellement d'infrastructures et de programmes de formation aux métiers du digital.",
    beneficiaires: "500 jeunes âgés de 18 à 35 ans, avec une priorité donnée aux jeunes femmes",
    resultats_attendus: [
      "Création de 3 centres de formation équipés",
      "Formation de 500 jeunes aux métiers du web",
      "Insertion professionnelle de 60% des formés",
      "Création de 50 micro-entreprises digitales"
    ],
    partenaires: ["Mairie de Bouaké", "GIZ", "Orange Digital Center"],
    date_publication: "2026-01-10",
    statut: "Ouvert"
  },
  {
    id: 3,
    slug: "promotion-artisanat-traditionnel-yamoussoukro",
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Promotion de l'artisanat traditionnel à Yamoussoukro",
    osc: "Artisans du Centre",
    domaine: "Culture & Économie",
    zone: "Yamoussoukro",
    durée: "12 mois",
    budget: "15 000 000 FCFA",
    objectif: "Valoriser le savoir-faire artisanal et créer des opportunités économiques pour 200 artisans.",
    description: "Initiative de promotion et de commercialisation de l'artisanat traditionnel ivoirien, incluant la formation des artisans, la création d'une plateforme de vente et l'organisation d'événements culturels.",
    contexte: "Le riche patrimoine artisanal de Yamoussoukro est menacé par le manque de valorisation et de débouchés commerciaux pour les artisans locaux.",
    beneficiaires: "200 artisans traditionnels de Yamoussoukro et environs",
    resultats_attendus: [
      "Formation de 200 artisans aux techniques modernes",
      "Création d'une plateforme e-commerce dédiée",
      "Organisation de 4 foires artisanales",
      "Augmentation de 40% des revenus des artisans"
    ],
    partenaires: ["Ministère de la Culture", "AFD", "Chambre des Métiers"],
    date_publication: "2026-01-08",
    statut: "Ouvert"
  },
  {
    id: 4,
    slug: "acces-soins-sante-primaires-korhogo",
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    nom: "Accès aux soins de santé primaires à Korhogo",
    osc: "Santé Pour Tous",
    domaine: "Santé",
    zone: "Korhogo",
    durée: "36 mois",
    budget: "45 000 000 FCFA",
    objectif: "Améliorer l'accès aux soins de santé pour 15 000 personnes dans les zones rurales.",
    description: "Projet intégré de renforcement du système de santé primaire dans la région de Korhogo, incluant la construction de centres de santé, la formation du personnel et des campagnes de prévention.",
    contexte: "Les zones rurales de Korhogo souffrent d'un manque criant d'infrastructures sanitaires et de personnel médical qualifié, entraînant une mortalité évitable importante.",
    beneficiaires: "15 000 habitants des zones rurales de Korhogo, principalement femmes enceintes et enfants",
    resultats_attendus: [
      "Construction de 5 centres de santé communautaires",
      "Formation de 30 agents de santé communautaires",
      "Vaccination de 3 000 enfants",
      "Réduction de 30% de la mortalité infantile"
    ],
    partenaires: ["Ministère de la Santé", "UNICEF", "Médecins Sans Frontières"],
    date_publication: "2026-01-05",
    statut: "Ouvert"
  },
];
