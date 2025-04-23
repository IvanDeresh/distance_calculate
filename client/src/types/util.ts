export interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  class?: string;
  type?: string;
  importance?: number;
  address?: {
    country?: string;
    state?: string;
    [key: string]: string | undefined;
  };
  [key: string]: any;
}
