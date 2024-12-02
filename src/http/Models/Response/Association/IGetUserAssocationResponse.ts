import { IUser } from "../IUser";

export interface IGetUserAssocationResponse {
  totalItems: number;
  totalPages: number;
  hasMore?: boolean;
  users: IUser[];
}
