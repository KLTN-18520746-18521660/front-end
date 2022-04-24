import User from "./user.model";

export default class Comment {
  id: number;
  parent_id: string;
  post_id: string;
  owner: {
    id?: string;
    user_name?: string;
    avatar?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    status?: string;
  };
  content: string;
  status: string;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  fromNow?: {
    created: string;
    updated: string;
  };
  likes?: number;
  dislikes?: number;
  replies?: number;
  reply_comments?: {
    comments: Comment[];
    total_size: number;
  };
  children?: Comment[];
  actions?: string[];
  mapAction?: {
    like: boolean;
    dislike: boolean;
    report: boolean;
    reply: boolean;
  }
}

export interface CommentInput {
  parent_id?: number;
  content?: string;
}
