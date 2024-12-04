import { get } from "http";
import { ApiResponse } from "../Models/ApiResponse";
import { ICreateUserRequest } from "../Models/Requests/Users/ICreateUserRequest";
import { IUser } from "../Models/Response/IUser";
import TransformResponse from "../Utils/transform";
import { BaseRepository } from "./BaseRepository";

class UserRepository extends BaseRepository<IUser> {
  collection = "user";

  public async createUserAssociation(data: ICreateUserRequest): Promise<any> {
    const instance = this.createInstance();
    const result = await instance
      .post(
        `http://localhost:3001/${this.collection}/createUserAndAssociation`,
        data
      )
      .then(TransformResponse);
    return result as ApiResponse<any>;
  }

  update(id: string, data: any) {
    return super.update(id, data);
  }

  get(id: string) {
    return super.get(id);
  }
}

export default UserRepository;