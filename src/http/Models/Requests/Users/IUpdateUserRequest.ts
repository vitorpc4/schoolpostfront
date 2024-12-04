import { TypeUser } from "../../Enum/TypeUser";

export interface IUpdateUserRequest {
  id: string;
  username: string;
  email: string;
  status: boolean;
  password: string;
  schoolId?: string;
  typeUser: TypeUser;
  admin: boolean;
}
