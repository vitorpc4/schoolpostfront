import { apiUrl } from "../../../env";
import { Ilogin } from "../Interfaces/ILogin";
import { ApiResponse } from "../Models/ApiResponse";
import { ILoginPost } from "../Models/Requests/ILoginPost";
import TransformResponse from "../Utils/transform";
import { BaseRepository } from "./BaseRepository";

class LoginRepository extends BaseRepository<Ilogin> {
  collection = "auth/login";

  public async login(data: ILoginPost): Promise<any> {
    const instance = this.createInstance();
    const result = await instance
      .post(`${apiUrl}/${this.collection}/`, data)
      .then(TransformResponse);
    return result as ApiResponse<Ilogin>;
  }
}

export default LoginRepository;
