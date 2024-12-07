import axios, { AxiosInstance, AxiosResponse } from "axios";
import { apiUrl } from "../../../env";

export default abstract class HttpClient {
  protected instance: AxiosInstance | undefined;

  protected createInstance(): AxiosInstance {
    this.instance = axios.create({
      baseURL: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (document.cookie) {
      const token = document.cookie
        .split(";")
        .find((x) => x.includes("token"))
        ?.split("=")[1];

      if (token) {
        this.initializeResponseInterceptor(token);
      }
    }

    return this.instance;
  }

  private initializeResponseInterceptor = (token: string) => {
    if (token) {
      this.instance?.interceptors.request.use((config: any) => {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
        return config;
      });
    }
  };
}
