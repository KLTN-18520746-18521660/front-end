export default class Category {
  id?: number;
  parent_id?: number;
  name?: string;
  display_name?: string;
  describe?: string;
  slug?: string;
  thumbnail?: string;
  status?: string;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  actions?: string[];
  mapAction?: {
    follow: boolean;
  };

  posts?: number;
  follows?: number;
  views?: number;
}