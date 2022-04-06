import User from "./user.model";

export default class Comment {
  id: string;
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
  like?: number;
  dislike?: number;
  children: Comment[];
}