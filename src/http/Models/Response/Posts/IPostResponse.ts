import { IPost } from "../IPost";

export interface IPostResponse {
  totalItems: number;
  totalPages: number;
  hasMore?: boolean;
  posts: IPost[];
}
