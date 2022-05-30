import { PublicConfig } from "./appconfig.model";
import Category from "./category.model";
import Post from "./post.model";
import { Tag } from "./tag.model";
import User from "./user.model";
import { Comment } from "./comment.model";
import Notification from "./notification.model";
import { Admin } from "./admin.model";

export interface ApiResult {
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
    sessions?: Session[];
    comments?: Comment[];
    comment?: Comment;
    notifications: Notification[];
    notification: Notification;
    configs?: PublicConfig;
    total_size?: number;
    session_id?: string;
    user_id?: string;
    // [key: string]: any;
  }
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
}

export interface ApiParams {
  // audit log
  key?: string; // postID | commnentID
  type?: 'comment' | 'post' | 'user';

  start?: number;
  size?: number;
  search_term?: string;
  tags?: string;
  status?: string;
  categories?: string;
  /**s
   * 'view','like'
   */
  sort_by?: string;
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

  iscurrent?: boolean;

  fromNow?: {
    created?: string;
    updated?: string;
  }
}