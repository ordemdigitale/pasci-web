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
  id: string;
  title: string;
  slug: string;
  content?: string;
  thumbnail_url?: string;
  created_at?: string;
  tags?: string[];
  crasc?: ICrasc;
  osc?: IOsc
}
// Interface for Spotlight News 
export interface SpotlightNews {
  id: string;
  title: string;
  slug: string;
  content?: string;
  thumbnail_url: string;
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
  thumbnail_url?: string;
  projets?: IProjet[]
}

export interface IProjet {
  id: number;
  name?: string;
  ptf?: IPTF[]
}