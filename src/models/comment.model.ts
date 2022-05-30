import User from "./user.model";

export interface Comment {
  id: number;
  parent_id: string;
  post_id: string;
  owner: User;
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
