export interface ICrasc {
  id: string;
  name: string;
  slug: string;
  osc_count: number;

  //description
  //oscs
  //regions
  //news
}

export interface IRegionCiv {
  id: string;
  name: string;
  slug: string;
  crasc_id?: string | null;
  crasc_region?: ICrasc | null;
  created_at?: string;
  updated_at?: string;
}

export interface IOsc {
  id: string;
  name: string;
  description: string;
  crascRegionId: string;
  crasc: ICrasc;
  type: IOscType;
  slug: string;
  thumbnail_url?: string;
  thumbnail_path?: string;
  ville?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IOscDetail {
  id: number;
  name: string;
  description: string;
  thumbnail_path?: string;
  thumbnail_url?: string;
  type_id: number;
  crasc_id: number;
  latitude: number;
  longitude: number;
  ville?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
  slug: string;
  type: IOscType;
  crasc: ICrasc;
  news_items?: INews[];
  // Champs étendus
  nom_president?: string | null;
  sexe_president?: string | null;
  mode_designation_president?: string | null;
  duree_mandat_be?: string | null;
  nb_membres?: number | null;
  nb_femmes_membres?: number | null;
  nb_membres_jeunes?: number | null;
  nb_membres_be?: number | null;
  nb_personnes_engagees?: number | null;
  nb_beneficiaires?: number | null;
  nb_activites?: number | null;
  // Domaines prioritaires (legacy — remplacés par poles)
  domaine_prioritaire?: string | null;
  domaine_prioritaire_2?: string | null;
  domaine_prioritaire_3?: string | null;
  domaine_prioritaire_4?: string | null;
  // Many-to-many avec PoleConcertation
  poles?: { id: number; name: string; slug: string }[];
  categorie?: string | null;
  niveau_couverture?: string | null;
  zone_couverture?: string | null;
  date_creation?: string | null;
  numero_recepisse?: string | null;
  reseaux_sociaux?: string | null;
  secteurs_activites?: string | null;
  populations_cibles?: string | null;
  savoir_faire?: string | null;
  budget_annuel?: number | null;
  type_financement?: string | null;
  etat_cotisations?: string | null;
  montant_cotisation?: number | null;
  adhesion_crasc?: boolean | null;
  reseau_appartenance?: string | null;
  difficultes?: string | null;
  recommandations?: string | null;
  financement_cotisation?: boolean | null;
  financement_dons?: boolean | null;
  financement_legs?: boolean | null;
  financement_collectivites?: boolean | null;
  financement_fonds_propres?: boolean | null;
  financement_ong_intl?: boolean | null;
  financement_multilateral?: boolean | null;
}

// Interface for CRASC video
export interface ICrascVideo {
  id: number;
  crasc_id: number;
  titre: string;
  url: string;
  description?: string | null;
  ordre: number;
  created_at?: string;
}

// Interface for Agenda events
export interface IEvenement {
  id: number;
  title: string;
  description?: string | null;
  date_debut: string;
  date_fin?: string | null;
  lieu?: string | null;
  crasc_id?: number | null;
  created_at?: string;
}

// Interface for Crasc region by slug with OSCs and Region CIVs
export interface ICrascDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  osc_count?: number;
  email_pca?: string | null;
  oscs?: IOsc[];
  regions?: IRegionCiv[];
  news?: INews[];
  evenements?: IEvenement[];
  videos?: ICrascVideo[];
}

// Interface for OscType
export interface IOscType {
  id: string;
  name: string;
  description: string;
  slug: string;
  oscs: IOsc[]
}

// Interface for News
export interface INews {
  id: number;
  title: string;
  slug: string;
  content?: string;
  thumbnail_path?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  crasc_id?: number | null;
  osc_id?: number | null;
  tags?: string[];
  crasc?: ICrasc;
  osc?: IOsc;
}
// Interface for Spotlight News 
export interface SpotlightNews {
  id: number;
  title: string;
  slug: string;
  content?: string;
  thumbnail_path?: string;
  thumbnail_url?: string;
  created_at?: string;
  crasc?: ICrasc;
  osc?: IOsc;
}

export interface IMission {
  title: string;
  description: string;
}

export interface IBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface IJobs {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  slug: string;
  employer: string;
  publication_date: string;
  expiration_date?: string;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
  missions?: string;
  requirements?: string;
  benefits?: string;
  missions_list?: IMission[];
  requirements_list?: string[];
  benefits_list?: IBenefit[];
}

export interface IKeyStats {
  id: number;
  name: string;
  number: number;
}

export interface IPTF {
  id: number;
  name: string;
  slug: string;
  description?: string;

  // Descriptions
  mission?: string;
  vision?: string;

  // Images
  thumbnail_path?: string;
  thumbnail_url?: string;
  cover_path?: string;
  cover_url?: string;

  // Contact information
  website?: string;
  email?: string;
  phone?: string;
  address?: string;

  // General information
  pays?: string;
  date_creation?: string;
  categorie?: string;
  exigences_majeures?: string;
  nature_relations?: string;

  // Domaines (JSON string and parsed list)
  domaines?: string;
  domaines_list?: string[];

  // Relations
  projets?: IProjet[]
}

export interface IProjet {
  id: number;
  name?: string;
  ptf?: IPTF[]
}

// Authentication types
export interface IUser {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_redacteur: boolean;
  crasc_id?: number | null;
  osc_id?: number | null;
  avatar?: string;
  bio?: string;
  date_joined?: string;
}

export interface ILoginRequest {
  username: string; // Can be email or username
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  token_type: string;
}

export interface IRegisterRequest {
  email: string;
  username?: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// Forum types
export interface IPoleConcertation {
  id: number;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  image_path?: string;
  objectifs?: string;
  objectifs_list?: string[];
  objectifs_annuels?: string;
  nb_osc_membres?: number;
  regions_influence?: string;
  realisations?: string;
  agenda?: string;
  is_active: boolean;
  sujets_count: number;
  created_at: string;
}

export interface IForumSujet {
  id: number;
  title: string;
  slug: string;
  content: string;
  pole_id: number;
  author_id?: string;
  author_name?: string;
  is_pinned: boolean;
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface IForumCommentaire {
  id: number;
  content: string;
  sujet_id: number;
  author_id?: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface IForumSujetDetail extends IForumSujet {
  commentaires: IForumCommentaire[];
}

// Offre Projet types
export interface IOffreProjet {
  id: string;
  nom: string;
  slug: string;
  osc: string;
  domaine: string;
  zone: string;
  durée: string;
  budget: string;
  objectif?: string;
  description?: string;
  beneficiaires?: string;
  statut: string;
  progression: number;
  resultats_attendus?: string;
  partenaires?: string;
  resultats_attendus_list?: string[];
  partenaires_list?: string[];
  image_path?: string;
  image_url?: string;
  date_publication: string;
  created_at: string;
  updated_at: string;
  ptf_id?: number | null;
  ptf?: {
    id: number;
    name: string;
    slug?: string;
    thumbnail_url?: string;
    pays?: string;
  } | null;
}
