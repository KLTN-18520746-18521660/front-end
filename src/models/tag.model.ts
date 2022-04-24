export default class Tag {
  id?: string;
  tag?: string;
  name?: string;
  describe?: string;
  status?: string;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  action?: string[];
  mapAction?: {
    follow: boolean;
    used: boolean;
    visited: boolean;
  }
}