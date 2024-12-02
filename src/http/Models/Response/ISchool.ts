import { IUserSchoolAssociation } from "./IUserSchoolAssociation";

export interface ISchool {
  id?: string;
  name: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  userSchoolAssociation?: IUserSchoolAssociation[];
}
