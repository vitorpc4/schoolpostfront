import { TypeUser } from "../../Enum/TypeUser";

export interface ICreateUserRequest {
  username: string;
  email: string;
  password: string;
  status: boolean;
  typeUser: TypeUser;
  schoolId?: string;
  admin: boolean;
}
