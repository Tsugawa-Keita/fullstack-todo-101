import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import mysql from "mysql2";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { HttpError, HTTP_STATUS } from "./http-error.js";
import { env } from "./env.js";
import { ParamsTokenFactory } from "@nestjs/core/pipes/params-token-factory.js";

const connection = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    namedPlaceholders: true
})

const app: Application = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())

function logRoute(req: Request, _res: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.path}`);
  console.log('[request body]', req.body);
  next();
}

function validateTodo(req: Request, res: Response, next: NextFunction) {
  const todo = req.body?.data?.todo;
  if (typeof todo !== "string" || todo.trim().length === 0) {
    return next(new HttpError(HTTP_STATUS.BAD_REQUEST, "todo is required (string)", "VALIDATION_ERROR"));
  }
  next();
}

app
    .route('/todos')
    .all(logRoute)
    .get(
        (req: Request, res: Response, next: NextFunction) => {
            const sql = "SELECT * FROM todo";
            connection.query<RowDataPacket[]>(sql, (error, result) => {
                if (error) return next(error);
                res.status(200).json({ todos: result })
            })
        }
    )
    .post(
        validateTodo,
        (req: Request, res: Response, next: NextFunction) => {
            const sql = "INSERT INTO todo VALUES (:id, :todo)"
            const params = {
                id: randomUUID(),
                todo: req.body.data.todo
            }
            connection.query<ResultSetHeader>(sql, params, (error) => {
                if (error) return next(error);
                res.status(200).json(params)
            })
        }
    )

app
    .route('/todos/:id')
    .all(logRoute)
    .put(
        validateTodo,
        (req: Request, res: Response, next: NextFunction) => { 
            const sql = "UPDATE todo SET todo=:todo WHERE id=:id";
            const params = {
                id: req.params.id,
                todo: req.body.data.todo
            }
            connection.query<ResultSetHeader>(sql, params, (error, result) => {
                if (error) return next(error);
                if (result.affectedRows === 0) {
                    return next(new HttpError(HTTP_STATUS.NOT_FOUND));
                }
                res.status(200).json(params)
                }
            )
        }
    )
    .delete(
        (req: Request, res: Response, next: NextFunction) => {
            const sql = "DELETE FROM todo WHERE id = :id";
            const params = {id: req.params.id}
            connection.query<ResultSetHeader>(sql, params, (error, result) => {
                if (error) return next(error);
                if (result.affectedRows === 0) {
                    return next(new HttpError(HTTP_STATUS.NOT_FOUND));
                }
                res.status(200).json(params)
            })
        }
    )

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // HttpError は「意図したレスポンス」
  if (err instanceof HttpError) {
    // 500のときだけ console.error
    if (err.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      console.error(err);
    }
    return res.status(err.status).json({
      message: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
  }

  // それ以外は「想定外」なので 500 を隠蔽
  console.error(err);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "internal error" });
});


app.listen(PORT, () => console.log(`server running at://localhost:${PORT}`));
