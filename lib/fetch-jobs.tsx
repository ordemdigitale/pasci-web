import { IJobs, IProjet } from "@/types/api.types";

// Mock data de fallback pour les offres d'emploi
const mockJobsData: IJobs[] = [
  {
    id: "1",
    title: 'Chargé de Mission Innovation',
    description: `Rejoignez notre équipe dynamique pour piloter des initiatives stratégiques au sein de l'espace collaboratif PASCI. Vous serez au cœur de l'innovation sociale et environnementale en Afrique de l'Ouest.

En tant que Chargé de Mission Innovation, vous jouerez un rôle clé dans le développement et la mise en œuvre de projets novateurs visant à renforcer les capacités des organisations de la société civile et à promouvoir le développement durable dans la région.`,
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'CDI',
    slug: 'charge-mission-innovation',
    employer: 'PASCI Côte d\'Ivoire',
    publication_date: new Date().toISOString(),
    is_expired: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: 'Responsable Communication Digitale',
    description: `Nous recherchons un(e) Responsable Communication Digitale passionné(e) pour développer et animer notre présence en ligne. Vous serez en charge de la stratégie digitale et de l'engagement de nos communautés.

Votre mission principale sera de renforcer la visibilité de PASCI sur les plateformes numériques, de créer du contenu engageant et de développer des campagnes de communication innovantes qui mettent en valeur nos actions et nos partenaires.`,
    location: 'Dakar, Sénégal',
    type: 'CDD',
    slug: 'responsable-communication-digitale',
    employer: 'PASCI Sénégal',
    publication_date: new Date(Date.now() - 86400000).toISOString(),
    is_expired: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    title: 'Chef de Projet Développement Durable',
    description: `Pilotez des projets d'envergure dans le domaine du développement durable et de la responsabilité sociétale. Vous coordonnerez des initiatives multi-partenaires et contribuerez à l'impact positif de PASCI.

En collaboration avec nos partenaires régionaux, vous développerez et superviserez des programmes ambitieux visant à promouvoir des pratiques durables dans les secteurs clés de l'économie ouest-africaine.`,
    location: 'Ouagadougou, Burkina Faso',
    type: 'CDI',
    slug: 'chef-projet-developpement-durable',
    employer: 'PASCI Burkina Faso',
    publication_date: new Date(Date.now() - 172800000).toISOString(),
    is_expired: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "4",
    title: 'Analyste de Données Impact',
    description: `Transformez les données en insights stratégiques pour mesurer et optimiser l'impact de nos programmes. Vous développerez des outils d'analyse et de reporting pour nos partenaires.

Votre expertise en analyse de données sera cruciale pour évaluer l'efficacité de nos interventions et identifier des opportunités d'amélioration continue dans nos programmes de développement.`,
    location: 'Dakar, Sénégal',
    type: 'CDI',
    slug: 'analyste-donnees-impact',
    employer: 'PASCI Sénégal',
    publication_date: new Date(Date.now() - 259200000).toISOString(),
    is_expired: false,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "5",
    title: 'Coordonnateur RSE Senior',
    description: `Accompagnez les entreprises dans leur démarche RSE et favorisez les partenariats stratégiques. Vous serez l'interface entre le secteur privé et les organisations de la société civile.

En tant que Coordonnateur RSE, vous développerez des programmes d'engagement des entreprises, faciliterez les collaborations multi-sectorielles et promouvrez les meilleures pratiques en matière de responsabilité sociétale.`,
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'CDI',
    slug: 'coordonnateur-rse-senior',
    employer: 'PASCI Côte d\'Ivoire',
    publication_date: new Date(Date.now() - 345600000).toISOString(),
    is_expired: false,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: "6",
    title: 'Assistant(e) de Direction',
    description: `Apportez votre soutien à l'équipe de direction dans la gestion quotidienne et la coordination des activités de PASCI. Un rôle polyvalent au cœur de notre organisation.

Vous assurerez une gestion efficace des agendas, coordonnerez les réunions stratégiques, préparerez les dossiers et veillerez au bon déroulement des opérations administratives de l'organisation.`,
    location: 'Lomé, Togo',
    type: 'CDD',
    slug: 'assistant-direction',
    employer: 'PASCI Togo',
    publication_date: new Date(Date.now() - 432000000).toISOString(),
    is_expired: false,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString()
  }
];

// Fetch single Job
export async function getJobBySlug(job_slug: string): Promise<IJobs> {
  try {
    const response = await fetch (`http://localhost:8000/api/v1/jobs/${job_slug}`, {
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
    console.log("API non disponible, utilisation des données mock pour:", job_slug);

    // Fallback to mock data
    const mockJob = mockJobsData.find(job => job.slug === job_slug);

    if (!mockJob) {
      throw new Error(`Offre d'emploi non trouvée: ${job_slug}`);
    }

    return mockJob;
  }
}