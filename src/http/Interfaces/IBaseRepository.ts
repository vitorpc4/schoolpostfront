import { ApiResponse } from "../Models/ApiResponse";

export interface IBaseRepository<T> {
  get(id: any): Promise<ApiResponse<T>>;
  getMany(): Promise<ApiResponse<T[]>>;
  create(id: any, item: T): Promise<ApiResponse<T>>;
  update(id: any, item: T): Promise<ApiResponse<T>>;
  delete(id: any): Promise<ApiResponse<T>>;
}
