import { apiUrl } from "../../../env";
import { ApiResponse } from "../Models/ApiResponse";
import { IPostCreateRequest } from "../Models/Requests/Post/IPostCreateRequest";
import { IPost } from "../Models/Response/IPost";
import { IPostResponse } from "../Models/Response/Posts/IPostResponse";
import TransformResponse from "../Utils/transform";
import { BaseRepository } from "./BaseRepository";

class PostRepository extends BaseRepository<IPost> {
  collection = "posts";

  public async getPosts(
    page: number,
    limit: number,
    schoolId: string
  ): Promise<ApiResponse<IPostResponse>> {
    const instance = this.createInstance();

    const result = await instance
      .get(`${apiUrl}/${this.collection}/?page=${page}&limit=${limit}`, {
        headers: {
          schoolid: schoolId,
        },
      })
      .then(TransformResponse);
    const castResult = result as ApiResponse<IPostResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }
    return castResult;
  }

  public async getPostByKeyWord(
    page: number,
    limit: number,
    schoolId: string,
    search: string
  ): Promise<ApiResponse<IPostResponse>> {
    const instance = this.createInstance();

    const result = await instance
      .get(
        `${apiUrl}/${this.collection}/find/school?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            schoolid: schoolId,
          },
        }
      )
      .then(TransformResponse);
    const castResult = result as ApiResponse<IPostResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }
    return castResult;
  }

  public async GetPublishedPostsAndDrafts(
    page: number,
    limit: number,
    schoolId: string
  ): Promise<ApiResponse<IPostResponse>> {
    const instance = this.createInstance();

    const result = await instance
      .get(
        `${apiUrl}/${this.collection}/allposts?page=${page}&limit=${limit}`,
        {
          headers: {
            schoolid: schoolId,
          },
        }
      )
      .then(TransformResponse);
    const castResult = result as ApiResponse<IPostResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }
    return castResult;
  }

  public async GetPublishedPostsAndDraftsByKeyWord(
    page: number,
    limit: number,
    schoolId: string,
    search: string
  ): Promise<ApiResponse<IPostResponse>> {
    const instance = this.createInstance();

    const result = await instance
      .get(
        `${apiUrl}/${this.collection}/allposts/search?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            schoolid: schoolId,
          },
        }
      )
      .then(TransformResponse);
    const castResult = result as ApiResponse<IPostResponse>;

    if (castResult.data != null || castResult.data != undefined) {
      castResult.data!.hasMore = page < castResult.data?.totalPages!;
    }
    return castResult;
  }

  public async GetPost(
    id: number,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = this.createInstance();

    const result = await instance
      .get(`${apiUrl}/${this.collection}/${id}`, {
        headers: {
          schoolid: schoolId,
        },
      })
      .then(TransformResponse);
    return result as ApiResponse<IPost>;
  }

  public async CreatePost(
    post: IPostCreateRequest,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = this.createInstance();

    const result = await instance
      .post(`${apiUrl}/${this.collection}`, post, {
        headers: {
          schoolid: schoolId,
        },
      })
      .then(TransformResponse);
    return result as ApiResponse<IPost>;
  }

  public async DeleteItem(
    id: number,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = this.createInstance();

    const result = await instance
      .delete(`${apiUrl}/${this.collection}/${id}`, {
        headers: {
          schoolid: schoolId,
        },
      })
      .then(TransformResponse);
    return result as ApiResponse<IPost>;
  }

  public async UpdatePost(
    post: IPost,
    schoolId: string
  ): Promise<ApiResponse<IPost>> {
    const instance = this.createInstance();

    const result = await instance
      .put(`${apiUrl}/${this.collection}/${post.id}`, post, {
        headers: {
          schoolid: schoolId,
        },
      })
      .then(TransformResponse);
    return result as ApiResponse<IPost>;
  }
}

export default PostRepository;
