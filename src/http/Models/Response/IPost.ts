import { IUserSchoolAssociation } from "./IUserSchoolAssociation";

export interface IPost {
  id?: number;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDraft: boolean;
  status: boolean;
  userSchoolAssociation?: IUserSchoolAssociation;
  username: string;
}
