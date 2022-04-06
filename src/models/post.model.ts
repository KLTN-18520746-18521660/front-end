import Category from "./category.model";
import Tag from "./tag.model";
import User from "./user.model";

export default class Post {
  id: string;
  title?: string;
  slug?: string;
  thumbnail?: string;
  views?: number;
  time_read?: number;
  status?: string;
  content?: string;
  content_type?: string;
  short_content?: string;
  content_search?: string;
  category?: Category;
  owner?: User;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  fromNow?: {
    created?: string;
    updated?: string;
  };
  comments?: number;
  likes?: number;
  tags?: Tag[];
}