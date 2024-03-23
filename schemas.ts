// Data models
export enum ReleaseStatus {
  Released = 0,
  InProgress,
  Unavailable,
}

export enum GameVersion {
  COUNTER_STRIKE_1_6 = 0,
  COUNTER_STRIKE_2,
}

export type Category = {
  abbr: string;
  id: number;
  fullName: string;
};

export type Map = {
  categoryId: number;
  downloadLinks?: Array<string>;
  fullName: string;
  icon: string;
  id: number;
  images?: Array<{
    url: string;
    caption?: string;
  }>;
  maxPlayers: number;
  name: string;
  progressPercentage?: number;
  version: string;
  releaseDate: string;
  status: ReleaseStatus;
  targetGameVersion: GameVersion;
};

export type Tutorial = {
  title: string;
  hashKey: string;
  content: string;
  creationDate: string;
  lastUpdateDate: string;
  thumbnail: string;
  targetGameVersion: GameVersion;
  isDraft: boolean;
};

// API models
export type GetMapsResponse = {
  categories: Array<Category>;
  maps: Array<Partial<Map>>;
};
