import { TypeUser } from "../Enum/TypeUser";
import { IPost } from "./IPost";
import { ISchool } from "./ISchool";
import { IUserAssociation } from "./IUserAssociation";

export interface IUserSchoolAssociation {
  id?: number;
  user: IUserAssociation;
  school?: ISchool;
  post?: IPost[];
  status: boolean;
  typeUser?: TypeUser;
  admin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
