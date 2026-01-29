import createClient from "openapi-fetch";
import type { Client } from "openapi-fetch";
import type { paths } from "./api-types";
import type { components } from "./api-types";

type TodoItem = components['schemas']['Todo'];
type CreateTodoDto = components['schemas']['CreateTodoDto'];
type UpdateTodoDto = components['schemas']['UpdateTodoDto'];

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

  public async getTodo(id: TodoItem['todo_id']) {
    const { data, error } = await this.apiClient.GET("/todos/{id}", {
      params: { path: { id } },
    });
    if (!data) throw new Error(error);
    return data;
  }

  public async createTodo(createTodoDto: CreateTodoDto) {
    const { data, error } = await this.apiClient.POST("/todos", {
      body: createTodoDto
    });
    if (!data) throw new Error(error);
    return data;
  }

  public async updateTodo(id: TodoItem['todo_id'], updateTodoDto: UpdateTodoDto) {
    const { data, error } = await this.apiClient.PATCH("/todos/{id}", {
      params: { path: { id } }, body: updateTodoDto
    });
    if (!data) throw new Error(error);
    return data;
  }

  public async deleteTodo(id: TodoItem['todo_id']) {
    const { error } = await this.apiClient.DELETE("/todos/{id}", {
      params: { path: { id } },
    });
    if (error) throw new Error(error);
    return id;
  }
}