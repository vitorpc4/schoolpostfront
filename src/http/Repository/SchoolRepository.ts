import { apiUrl } from "../../../env";
import { ApiResponse } from "../Models/ApiResponse";
import { ISchoolCreate } from "../Models/Requests/School/ISchoolCreate";
import { ISchool } from "../Models/Response/ISchool";
import TransformResponse from "../Utils/transform";
import { BaseRepository } from "./BaseRepository";

export interface ISchoolResponse {
  schoolId: string;
  schoolName: string;
  token: string;
}

class SchoolRepository extends BaseRepository<ISchool> {
  collection = "school";

  getMany() {
    return super.getMany();
  }

  getOne(id: string) {
    return super.get(id);
  }

  public async createSchool(
    item: ISchoolCreate
  ): Promise<ApiResponse<ISchoolResponse>> {
    const instance = this.createInstance();
    const result = await instance
      .post(`${apiUrl}/${this.collection}/`, item)
      .then(TransformResponse);
    return result as ApiResponse<ISchoolResponse>;
  }

  update(id: string, data: ISchool) {
    return super.update(id, data);
  }

  delete(id: string) {
    return super.delete(id);
  }
}

export default SchoolRepository;
