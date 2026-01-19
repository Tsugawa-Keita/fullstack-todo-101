import createClient from "openapi-fetch";
import type { Client } from "openapi-fetch";
import type { paths } from "./api-types";

export class WebAPI {
  private static _instance: WebAPI | undefined;
  private apiClient: Client<paths, `${string}/${string}`>;

  private constructor() {
    this.apiClient = createClient<paths>({
      baseUrl: "http://localhost:3000",
    });
  }

  public static get instance(){
    if (!this._instance){
      this._instance = new WebAPI();
    }
    return this._instance;
  }

  public async getTodos() {
    const { data, error } = await this.apiClient.GET("/todos");
    if (!data) throw new Error(error);
    return data;
  }

  public async getTodo(todoId: string) {
    const { data, error } = await this.apiClient.GET("/todos/{id}", {
      params: { path: { id: todoId } },
    });
    if (!data) throw new Error(error);
    return data;
  }

  public async createTodo(todoText: string) {
    const { data, error } = await this.apiClient.POST("/todos", {
      body: {text: todoText}
    });
    if (!data) throw new Error(error);
    return data;
  }

  public async updateTodo(todoId: string, todoText: string) {
    const { data, error } = await this.apiClient.PATCH("/todos/{id}", {
      params: { path: { id: todoId } }, body: {text: todoText}
    });
    if (!data) throw new Error(error);
    return data;
  }

  public async deleteTodo(todoId: string) {
    const { error } = await this.apiClient.DELETE("/todos/{id}", {
      params: { path: { id: todoId } },
    });
    if (error) throw new Error(error);
    return todoId;
  }
}