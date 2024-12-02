import { TypeUser } from "../Enum/TypeUser";
import { IPost } from "./IPost";
import { ISchool } from "./ISchool";
import { IUser } from "./IUser";

export interface IUserSchoolAssociation {
  id?: number;
  user: IUser;
  school?: ISchool;
  post?: IPost[];
  status: boolean;
  typeUser?: TypeUser;
  admin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
