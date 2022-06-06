import { PublicConfig } from "./appconfig.model";
import Category from "./category.model";
import Post from "./post.model";
import { Tag } from "./tag.model";
import User from "./user.model";
import { Comment } from "./comment.model";
import Notification from "./notification.model";
import { Admin } from "./admin.model";
import { ActionType } from "utils/apiConstant";
import { ConfigFormat } from "./Admins/config.model";
import { Right, Role } from "./Admins/role_right.model";

export interface ApiResult {
  status?: number;
  message?: string;
  data?: {
    url?: string;
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
    notifications?: Notification[];
    notification?: Notification;
    configs?: PublicConfig;
    total_size?: number;
    session_id?: string;
    user_id?: string;

    /**
     * search result
     */
    search_category?: {
      categories: Category[];
      total_size: number;
    };
    search_tag?: {
      tags: Tag[];
      total_size: number;
    };
    search_user?: {
      users: User[];
      total_size: number;
    };
    search_post?: {
      posts: Post[];
      total_size: number;
    };


    /**
     * only for admin
     */
    config?: {
      [key: string]: any;
    };
    format?: {
      [key: string]: ConfigFormat;
    };

    roles?: Role[];
    rights?: Right[];
  }
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
}

export interface ApiParams {
  // for audit log
  key?: string; // postID | commnentID
  type?: 'comment' | 'post' | 'user';

  start?: number;
  size?: number;
  /**
   * @default -1
   */
  time?: number;
  search_term?: string;
  tags?: string;
  status?: string;
  categories?: string;
  /**
   * 'views,likes, ...'
   */
  sort_by?: string;
  /**
   * 'asc,desc, ...'
   */
  order?: string;
}

export type ActionPostParams = 'saved' | 'like' | 'visited' | 'follow';

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