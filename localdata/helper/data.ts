import db from "@/localdata/crasc.json";
import { INews } from "@/types/api.types";

export interface ICrascRegion {
  id: string;
  crasc_region_name: string;
  slug: string;
}

export interface IRegionCiv {
  id: string;
  region_name: string;
  crascRegionId: string;
}

export interface IRegionCivWithCrascName extends IRegionCiv {
  crasc_region_name?: string;
}

export interface IOsc {
  id: string;
  name: string;
  description: string;
  crascRegionId: string;
}

export interface ICrascRegionWithOscs extends ICrascRegion {
  oscs: IOsc[];
}

// Load all Crasc Regions from local data
export function getAllCrascRegions(): ICrascRegion[] {
  return db.CrascRegion;
}
// Load all RegionCIV from local data with their respective CrascRegion Name
export function getAllRegionCivs(): IRegionCivWithCrascName[] {
  return db.RegionCiv.map((civ) => {
    const crasc = db.CrascRegion.find((r: any) => r.id === civ.crascRegionId);
    return {
      ...civ,
      crasc_region_name: crasc ? crasc.crasc_region_name : undefined,
    };
  });
}

// Load all Crasc Regions from API route
export async function fetchAllCrascRegionsFromApi(): Promise<ICrascRegion[]> {
  const response = await fetch("http://localhost:8000/api/v1/crasc/region-crasc", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Crasc Regions from API");
  }
  return response.json();
}

// Load a specific Crasc Region by ID
export function getCrascRegionById(id: string): ICrascRegion | undefined {
  return db.CrascRegion.find(region => region.id === id);
}

// Load a specific Crasc Region by slug
export function getCrascRegionBySlug(slug: string): ICrascRegion | undefined {
  return db.CrascRegion.find(crascRegion => crascRegion.slug === slug);
}
// Load a specific Crasc Region by slug from API route
/* export async function fetchSpecificCrascRegionbySlugFromApi(slug: string): Promise<ICrascRegion[]> {
  const response = await fetch(`http://localhost:8000/api/v1/crasc/region-crasc/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Crasc Region by slug from API");
  }
  return response.json();
} */

// Load all civs for a specific region
export function getCivsByRegionId(crascId: string): IRegionCiv[] {
  return db.RegionCiv.filter(civ => civ.crascRegionId === crascId);
}

// Load all civs
export function getAllCivs(): IRegionCiv[] {
  return db.RegionCiv;
}

// Get Crasc Region data with its civs (combined)
export function getCrascRegionWithCivs(id: string) {
  const region = getCrascRegionById(id);
  if (!region) return null;
  
  const civs = getCivsByRegionId(id);
  return { ...region, civs };
}

// Get Crasc Region data with its civs (combined) by slug
export function getCrascRegionWithCivsBySlug(slug: string) {
  const region = getCrascRegionBySlug(slug);
  if (!region) return null;
  const civs = getCivsByRegionId(region.id);
  return { ...region, civs };
}

// Load all OSCs for a specific Crasc Region
export function getOscsByCrascRegionId(crascId: string): IOsc[] {
  return db.Osc.filter(osc => osc.crascRegionId === crascId);
}

// Get OSCs for a Crasc Region
export function getCrascRegionOscs(id: string) {
  const crascRegion = getCrascRegionById(id);
  if (!crascRegion) return null;

  const oscs = getOscsByCrascRegionId(id);
  return { ...crascRegion, oscs };
}

// Get OSCs for a Crasc Region by slug
export function getCrascRegionOscsBySlug(slug: string) {
  const crascRegion = getCrascRegionBySlug(slug);
  if (!crascRegion) return null;
  const oscs = getOscsByCrascRegionId(crascRegion.id);
  return { ...crascRegion, oscs };
}
// Get OSCs for a Crasc Region by slug from API route
export async function fetchCrascRegionBySlugWithOscsFromApi(slug: string): Promise<ICrascRegionWithOscs> {
  const response = await fetch(`http://localhost:8000/api/v1/crasc/region-crasc/${slug}/oscs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch OSCs for this Crasc Region by slug from API");
  }
  return response.json();
}

// Mock news data for fallback
const mockNewsData: INews[] = [
  {
    id: 1,
    title: "Lancement du nouveau programme de formation pour les OSC",
    slug: "nouveau-programme-formation-osc",
    content: `
      <p>Le CRASC annonce le lancement d'un nouveau programme de formation destiné aux organisations de la société civile. Ce programme innovant vise à renforcer les capacités en gestion de projets et en gouvernance organisationnelle.</p>

      <h3>Un programme complet et structuré</h3>

      <p>Le programme s'étend sur une période de 6 mois et couvre plusieurs domaines essentiels pour le développement des OSC. Les participants bénéficieront d'une formation théorique et pratique adaptée aux réalités du terrain.</p>

      <blockquote>
        <p>"Ce programme représente une opportunité unique pour nos organisations membres de renforcer leurs capacités et d'améliorer leur impact sur le terrain."</p>
        <footer>— Directeur du CRASC SUD</footer>
      </blockquote>

      <p>Les inscriptions sont ouvertes jusqu'à la fin du mois. Les OSC intéressées peuvent se rapprocher de leur CRASC régional pour plus d'informations.</p>
    `,
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    created_at: "2025-01-15T10:00:00Z",
    tags: ["Formation", "OSC", "Renforcement des capacités"],
    crasc: {
      id: "1",
      name: "CRASC SUD",
      slug: "crasc-sud",
      osc_count: 150
    }
  },
  {
    id: 2,
    title: "Atelier de renforcement des capacités organisationnelles",
    slug: "atelier-renforcement-capacites",
    content: `
      <p>Un atelier de trois jours se tiendra du 25 au 27 janvier 2025 pour améliorer les compétences organisationnelles des membres des OSC. Cette initiative vise à renforcer la gouvernance, la planification stratégique et la mobilisation de ressources.</p>

      <h3>Programme de l'atelier</h3>

      <p>L'atelier abordera plusieurs thématiques clés :</p>

      <ul>
        <li>Gouvernance et leadership transformationnel</li>
        <li>Planification stratégique participative</li>
        <li>Mobilisation de ressources et diversification des financements</li>
        <li>Suivi-évaluation et redevabilité</li>
      </ul>

      <p>Des experts nationaux et internationaux animeront les sessions et partageront leurs expériences avec les participants.</p>

      <blockquote>
        <p>"L'excellence organisationnelle est la base d'un impact durable. Cet atelier permettra à nos membres d'acquérir les outils nécessaires pour exceller."</p>
        <footer>— Coordinateur régional</footer>
      </blockquote>
    `,
    thumbnail_url: "/images/actualites/atelier-capacites.jpg",
    created_at: "2025-01-12T14:30:00Z",
    tags: ["Atelier", "Capacités", "Gouvernance"],
    crasc: {
      id: "2",
      name: "CRASC CENTRE",
      slug: "crasc-centre",
      osc_count: 120
    }
  },
  {
    id: 3,
    title: "Assemblée générale annuelle 2025",
    slug: "assemblee-generale-2025",
    content: `
      <p>Convocation à l'assemblée générale ordinaire qui se tiendra le 15 février 2025 à 9h00 au siège du CRASC. Cette rencontre permettra de faire le bilan des activités de l'année écoulée et de définir les orientations stratégiques pour 2025.</p>

      <h3>Ordre du jour</h3>

      <p>Les points suivants seront abordés lors de cette assemblée :</p>

      <ul>
        <li>Rapport moral et d'activités 2024</li>
        <li>Rapport financier et approbation des comptes</li>
        <li>Plan d'action et budget 2025</li>
        <li>Renouvellement partiel du bureau exécutif</li>
        <li>Questions diverses</li>
      </ul>

      <p>La présence de tous les membres est vivement souhaitée pour enrichir les débats et contribuer à la définition de notre feuille de route commune.</p>

      <blockquote>
        <p>"L'assemblée générale est un moment privilégié de démocratie participative où chaque membre peut s'exprimer et contribuer à l'orientation de notre réseau."</p>
        <footer>— Président du CRASC</footer>
      </blockquote>
    `,
    thumbnail_url: "/images/actualites/assemblee-generale.jpg",
    created_at: "2025-01-10T08:00:00Z",
    tags: ["Assemblée", "Gouvernance", "Planification"],
    crasc: {
      id: "3",
      name: "CRASC NORD",
      slug: "crasc-nord",
      osc_count: 80
    }
  }
];

// Get News by slug
export async function getNewsBySlug(news_slug: string): Promise<INews> {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/crasc/news/${news_slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from API");
    }

    return response.json();
  } catch (error) {
    console.log("API non disponible, utilisation des données mock pour:", news_slug);

    // Fallback to mock data
    const mockNews = mockNewsData.find(news => news.slug === news_slug);

    if (!mockNews) {
      throw new Error(`Actualité non trouvée: ${news_slug}`);
    }

    return mockNews;
  }
}