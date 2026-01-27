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
  crasc_id: string;
  crasc_region: ICrasc;
}

export interface IOsc {
  id: string;
  name: string;
  description: string;
  crascRegionId: string;
  crasc: ICrasc;
  type: IOscType;
}

// Interface for Crasc region by slug with OSCs and Region CIVs
export interface ICrascDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  osc_count?: number;
  oscs?: IOsc[];
  regions?: IRegionCiv[];
  news?: INews[];
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

export interface IJobs {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  slug: string;
  employer: string;
  publication_date: string,
  /* 
  "is_expired": false,
  "created_at": "2026-01-15T06:23:07.506Z",
  "updated_at":
  */
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