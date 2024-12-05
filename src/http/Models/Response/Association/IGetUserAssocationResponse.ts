import { IUserAssociation } from "../IUserAssociation";

export interface IGetUserAssocationResponse {
  totalItems: number;
  totalPages: number;
  hasMore?: boolean;
  users: IUserAssociation[];
}
