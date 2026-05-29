export interface Toilet {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating_avg: number | null;
  rating_count: number;
  is_accessible: boolean;
  is_free: boolean;
  opening_hours: string | null;
  created_at: string;
}

export interface Rating {
  id: string;
  toilet_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}
