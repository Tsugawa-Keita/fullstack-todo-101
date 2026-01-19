# Todo バックエンド設計メモ

## 目的
- NestJSの最小実装（in-memory）でREST契約を固める
- エラーレスポンスはNest標準のまま（独自Filterは作らない）

## Resource
- Todo: `{ id: uuid, text: string }`

## API契約
- `GET /todos`
  - `200` body: `Todo[]`
- `GET /todos/:id`
  - `200` body: `Todo`
  - `400` invalid uuid（`ParseUUIDPipe`）
  - `404` not found（`NotFoundException`）
- `POST /todos`
  - body: `{ "text": string }`
  - `201` body: `Todo`
- `PATCH /todos/:id`
  - body: `{ "text": string }`（現時点は更新対象がtextのみなので必須）
  - `200` body: `Todo`（更新後を返す）
  - `400` invalid uuid / validation error
  - `404` not found
  - 将来：更新対象が増えたらDTOを optional に拡張検討
- `DELETE /todos/:id`
  - `204`（no content）
  - `400` invalid uuid
  - `404` not found

## Validation
- body: `class-validator`
  - `text`: 必須・空白不可（`IsString` + `IsNotEmpty`）
- params:
  - `GET/PATCH/DELETE :id` は `ParseUUIDPipe`

## DTO/MODEL
- DTO
  - `CreateTodoDto`: `{ text: string }`
  - `UpdateTodoDto`: `{ text: string }`
- model
  - `TodoItem = { id: string; text: string }`

## Layer責務
- Controller
  - HTTP層（status code / param pipe / http exception）
  - `findById`: 見つからなければ `throw new NotFoundException()`
  - `update`: Serviceが `undefined` → `throw new NotFoundException()`
  - `remove`: Serviceが `false` → `throw new NotFoundException()`、成功時 `@HttpCode(204)` + `void`
- Service
  - in-memory CRUD
  - `id` 生成は `crypto.randomUUID()`
  - HTTP例外は投げない（`undefined/boolean` で返す）

## Service API
- `findAll(): TodoItem[]`
- `findById(id: string): TodoItem | undefined`
- `create(dto: CreateTodoDto): TodoItem`
- `update(id: string, dto: UpdateTodoDto): TodoItem | undefined`
- `remove(id: string): boolean`

## curl疎通確認項目

### 前提
- backend起動: `npm -w backend run start:dev`
- base url: `http://localhost:3000`
- `ValidationPipe`: `whitelist: true` / `forbidNonWhitelisted: true`
- `:id` は `ParseUUIDPipe` でUUID検証

### 1) GET /todos（初期）
- コマンド
  - `curl -i http://localhost:3000/todos`
- 期待
  - `200`
  - body: `[]`（配列）

### 2) POST /todos（作成）
- コマンド
  - `curl -i -X POST http://localhost:3000/todos -H 'Content-Type: application/json' -d '{"text":"first"}'`
- 期待
  - `201`
  - body: `{"id":"<uuid>","text":"first"}`

### 3) GET /todos（作成後）
- コマンド
  - `curl -i http://localhost:3000/todos`
- 期待
  - `200`
  - body: `[{"id":"<uuid>","text":"first"}]`

### 4) GET /todos/:id（取得）
- コマンド
  - `curl -i http://localhost:3000/todos/<uuid>`
- 期待
  - `200`
  - body: `{"id":"<uuid>","text":"first"}`

### 5) PATCH /todos/:id（更新）
- コマンド
  - `curl -i -X PATCH http://localhost:3000/todos/<uuid> -H 'Content-Type: application/json' -d '{"text":"updated"}'`
- 期待
  - `200`
  - body: `{"id":"<uuid>","text":"updated"}`

### 6) DELETE /todos/:id（削除）
- コマンド
  - `curl -i -X DELETE http://localhost:3000/todos/<uuid>`
- 期待
  - `204`
  - bodyなし

### 7) GET /todos/:id（削除後）
- コマンド
  - `curl -i http://localhost:3000/todos/<uuid>`
- 期待
  - `404`
  - body（Nest標準）: `{"message":"Not Found","statusCode":404}`

### 8) :id がUUIDでない（400）
- コマンド
  - `curl -i http://localhost:3000/todos/not-a-uuid`
- 期待
  - `400`
  - body例: `{"message":"Validation failed (uuid is expected)","error":"Bad Request","statusCode":400}`

### 9) textが空（400）
- コマンド
  - `curl -i -X POST http://localhost:3000/todos -H 'Content-Type: application/json' -d '{"text":""}'`
- 期待
  - `400`
  - body例: `{"message":["text should not be empty"],"error":"Bad Request","statusCode":400}`

### 10) DTOにないプロパティ（400）
- コマンド
  - `curl -i -X POST http://localhost:3000/todos -H 'Content-Type: application/json' -d '{"text":"ok","extra":1}'`
- 期待
  - `400`
  - body例: `{"message":["property extra should not exist"],"error":"Bad Request","statusCode":400}`
