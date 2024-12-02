export interface IPostCreateRequest {
  title: string;
  content: string;
  image?: object;
  isDraft: boolean;
  status: boolean;
  author?: string;
  associationSchool: number;
}
