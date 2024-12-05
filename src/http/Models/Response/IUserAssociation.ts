import { TypeUser } from "../Enum/TypeUser";
import { IUserSchoolAssociation } from "./IUserSchoolAssociation";

export interface IUserAssociation {
  id?: number;
  username: string;
  email: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  schoolId: string;
  name: string;
  userSchoolAssociationId: number;
  typeUser: TypeUser;
  admin: boolean;
}
