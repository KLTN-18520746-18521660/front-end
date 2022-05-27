import { SafeHtml, SafeResourceUrl } from "@angular/platform-browser";
import Category from "./category.model";
import Tag from "./tag.model";
import User from "./user.model";

export default class Post {
  id?: number;
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
  categories?: Category[];
  owner?: User;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  approved_timestamp?: string;
  have_pending_content?: boolean;
  fromNow?: {
    created?: string;
    approved?: string;
    updated?: string;
  };
  comments?: number;
  likes?: number;
  dislikes?: number;
  tags?: Tag[];
  visited_count?: number;
  actions?: string[];
  mapAction?: {
    like: boolean;
    dislike: boolean;
    saved: boolean;
    visited: boolean;
    comment: boolean;
    follow: boolean;
    report: boolean;
  };
  new?: boolean;
}

export class PostModel {
  title?: string;
  thumbnail?: string;
  content?: string;
  short_content?: string;
  time_read?: number;
  content_type?: string;
  categories?: string[];
  tags?: string[];

  constructor(params: any) {
    this.title = params.title;
    this.thumbnail = params.thumbnail;
    this.content = params.content;
    this.short_content = params.short_content;
    this.time_read = params.time_read;
    this.content_type = params.content_type;
    this.categories = params.categories;
    this.tags = params.tags;
  }
}