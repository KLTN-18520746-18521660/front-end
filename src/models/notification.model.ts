export default class Notification {
  id?: string;
  user_id?: string;
  status?: string;
  content?: {
    action?: NotificationType;
    date_send?: string;
    post_owner?: {
      id?: string;
      avatar?: string;
      user_name?: string;
      display_name?: string;
    },
    post_detail?: {
      id?: string;
      slug?: string;
      title?: string;
    },
    comment_owner: {
      id: string;
      avartar: string;
      user_name: string;
      display_name: string;
    },
    commment_content: string;
  };
  created_timestamp?: string;
  last_modified_timestamp?: string;
  fromNow?: {
    created?: string;
    updated?: string;
  };
}

export type NotificationType = 'new-post' | 'approve-post' | 'reject-post' | 'private-post' | 'delete-post' | 'like-post' |
  'new-comment' | 'like-comment' | 'reply-comment' | 'follow-user';