import { AxiosResponse } from "axios";
import { ApiResponse } from "../Models/ApiResponse";
import { IUserSchoolAssociation } from "../Models/Response/IUserSchoolAssociation";
import TransformResponse from "../Utils/transform";
import { BaseRepository } from "./BaseRepository";
import { IUser } from "../Models/Response/IUser";
import { IGetUserAssocationResponse } from "../Models/Response/Association/IGetUserAssocationResponse";

class AssociationRepository extends BaseRepository<IUserSchoolAssociation> {
  collection = "association";

  public async getUserAssociationByUserId(id: number): Promise<any> {
    const instance = this.createInstance();
    const result = await instance
      .get(`http://localhost:3001/${this.collection}/user/${id}`)
      .then(TransformResponse);

    return result;
  }

  public async getUsersBySchoolId(
    id: string,
    page: number,
    limit: number
  ): Promise<ApiResponse<IGetUserAssocationResponse>> {
    const instance = this.createInstance();
    const result = await instance
      .get(
        `http://localhost:3001/${this.collection}/user/school/${id}?page=${page}&limit=${limit}`
      )
      .then(TransformResponse);

    const castResult = result as ApiResponse<IGetUserAssocationResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }

    return castResult;
  }
}

export default AssociationRepository;
