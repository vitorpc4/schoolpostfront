import { IUserSchoolAssociation } from "../IUserSchoolAssociation";

export interface IUser {
  id?: number;
  username: string;
  email: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  userSchoolAssociation?: IUserSchoolAssociation[];
}
