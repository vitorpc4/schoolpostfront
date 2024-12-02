import axios, { AxiosInstance, AxiosResponse } from "axios";

export default abstract class HttpClient {
  protected instance: AxiosInstance | undefined;

  protected createInstance(): AxiosInstance {
    this.instance = axios.create({
      baseURL: "http://localhost:3001",
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
