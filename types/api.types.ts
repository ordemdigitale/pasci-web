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
export interface ICrascRegionDetails {
  id: string;
  name: string;
  slug: string;
  osc_count: number;
  oscs: IOsc[];
  regions_civ: IRegionCiv[];
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
  crasc: ICrasc;
  osc: IOsc
}
// Interface for Spotlight News 
export interface SpotlightNews {
  id: string;
  title: string;
  thumbnail_url: string;
  crasc: ICrasc;
  osc?: IOsc;
}

export interface IJobs {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  /* 
  "is_expired": false,
  "publication_date": "2026-01-15T06:23:07.506Z",
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "created_at": "2026-01-15T06:23:07.506Z",
  "updated_at":
  */
}