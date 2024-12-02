import { IRegister } from "../Interfaces/IRegister";
import { ApiResponse } from "../Models/ApiResponse";
import IRegisterPost from "../Models/Requests/IRegisterPost";
import TransformResponse from "../Utils/transform";
import { BaseRepository } from "./BaseRepository";

class RegisterRepository extends BaseRepository<IRegister> {
  collection = "auth/register";

  public async register(data: IRegisterPost): Promise<any> {
    const instance = this.createInstance();
    const result = await instance
      .post(`http://localhost:3001/${this.collection}/`, data)
      .then(TransformResponse);
    return result as ApiResponse<IRegister>;
  }
}

export default RegisterRepository;
