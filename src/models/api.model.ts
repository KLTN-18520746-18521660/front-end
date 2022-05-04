import { PublicConfig } from "./appconfig";
import Category from "./category.model";
import Post from "./post.model";
import Tag from "./tag.model";
import User from "./user.model";
import Comment from "./comment.model";
import Notification from "./notification.model";

export default interface ApiResult {
  status?: number;
  message?: string;
  data?: {
    url: string;
    posts?: Post[];
    post?: Post;
    categories?: Category[];
    category?: Category;
    tags?: Tag[];
    tag?: Tag;
    users?: User[];
    user?: User;
    session?: Session;
    comments?: Comment[];
    comment?: Comment;
    notifications: Notification[];
    notification: Notification;
    configs?: PublicConfig;
    total_size?: number;
    // [key: string]: any;
  }
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
}

export interface ApiParams {
  start?: number;
  size?: number;
  search_term?: string;
  /**s
   * 'view','like'
   */
  order?: string;
  /**
   * true,fale
   */
  desc?: string;
}
export interface Session {
  created_timestamp: string;
  data: any;
  last_interaction_time: string;
  saved: boolean;
  session_token: string;
}