import User from 'models/user.model';
import Post from './post.model';
export default class Notification {
  id?: string;
  user_id?: string;
  status?: 'Read' | 'Sent' | 'Deleted';
  read?: boolean;
  type?: NotificationType;
  content?: {
    // avatar, display_name, user_name
    user_des?: User;
    post_owner?: User;
    post_detail?: Post;
    comment_owner?: User;
    comment_content?: string;
    error?: string;
  };
  user_action?: {
    admin?: boolean;
    user_name?: string;
    avatar?: string;
    display_name?: string;
    status?: string;
  }
  created_timestamp?: string;
  last_modified_timestamp?: string;
  fromNow?: {
    created?: string;
    updated?: string;
  };
}

export type NotificationType = 'new-post' | 'approve-post' | 'reject-post' | 'private-post' | 'delete-post' | 'like-post' |
  'new-comment' | 'like-comment' | 'reply-comment' | 'follow-user';