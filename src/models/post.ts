export default class Post {
  postId: number;
  title: string;
  content: string;
  thumbnail: string;
  owner: object;
  created_at: string;
  time_read: number;
  view: number;
  comments: number;
  likes: number;
  tags: object[];
}