export interface CategorySendModel {
  parent_id?: number;
  name?: string;
  display_name?: string;
  describe?: string;
  thumbnail?: string;
  status?: string;
}

export interface TagSendModel {
  tag?: string;
  name?: string;
  describe?: string;
  status?: string;
}