export interface Tag {
  id?: number;
  tag?: string;
  name?: string;
  describe?: string;
  status?: string;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  actions?: string[];
  mapAction?: {
    follow: boolean;
    used: boolean;
    visited: boolean;
  };

  posts?: number;
  likes?: number;
  views?: number;
  is_new?: boolean;
}