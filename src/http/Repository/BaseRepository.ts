import { ApiResponse } from "../Models/ApiResponse";
import { IBaseRepository } from "../Interfaces/IBaseRepository";
import HttpClient from "../Client/HttpClient";
import TransformResponse from "../Utils/transform";
import { apiUrl } from "../../../env";

export abstract class BaseRepository<T>
  extends HttpClient
  implements IBaseRepository<T>
{
  protected collection: string | undefined;

  public async get(id: string): Promise<ApiResponse<T>> {
    const instance = this.createInstance();
    const result = await instance
      .get(`${apiUrl}/${this.collection}/${id}`)
      .then(TransformResponse);
    return result as ApiResponse<T>;
  }

  public async getMany(): Promise<ApiResponse<T[]>> {
    const instance = this.createInstance();
    const result = await instance
      .get(`${apiUrl}/${this.collection}/`)
      .then(TransformResponse);
    return result as ApiResponse<T[]>;
  }

  public async create(item: any): Promise<ApiResponse<T>> {
    const instance = this.createInstance();
    const result = await instance
      .post(`${apiUrl}/${this.collection}/`, item)
      .then(TransformResponse);
    return result as ApiResponse<T>;
  }

  public async update(id: string, item: T): Promise<ApiResponse<T>> {
    const instance = this.createInstance();
    const result = await instance
      .put(`${apiUrl}/${this.collection}/${id}`, item)
      .then(TransformResponse);
    return result as ApiResponse<T>;
  }

  public async delete(id: any): Promise<ApiResponse<T>> {
    const instance = this.createInstance();
    const result = await instance
      .delete(`${apiUrl}/${this.collection}/${id}`)
      .then(TransformResponse);
    return result as ApiResponse<T>;
  }
}
