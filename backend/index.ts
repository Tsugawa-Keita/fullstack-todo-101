import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'todos'
})

const app: Application = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.post('/add', (req: Request, res: Response) => {
    console.log(req.body)
    const { todo } = req.body.data;
    const id = randomUUID();
    const sql = `INSERT INTO todo VALUES ("${id}", "${todo}")`
    connection.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({message: error.message})
        } else {
            console.log('success: ', result)
            res.status(200).json({id, todo})
        }
    })
})

app.get('/', (req: Request, res: Response) => {
    console.log('getリクエストを受け付けました。');
    const sql = "SELECT * FROM todo";
    connection.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({message: error.message})
        } else {
            console.log('success: ', result)
            res.status(200).json({todos: result})
        }
    })
})

app.put('/update', (req: Request, res: Response) => { 
    console.log('updateリクエストを受け付けました。')
    console.log(req.body)
    const { id, todo } = req.body.data
    const sql = `UPDATE todo SET todo="${todo}" WHERE id="${id}"`;
    connection.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({message: error.message})
        } else {
            console.log('success: ', result)
            res.status(200).json({id, todo})
        }
    })
})

app.delete('/delete', (req: Request, res: Response) => { 
    console.log('deleteリクエストを受け付けました。')
    console.log(req.body.id)
    const id = req.body.id
    const sql = `DELETE FROM todo WHERE id = "${id}"`;
    connection.query(sql, (error, result) => {
        if (error) {
            res.status(500).json({message: error.message})
        } else {
            console.log('success: ', result)
            res.status(200).json({message: 'success'})
        }
    })
})

try {
    app.listen(PORT, () => console.log(`server running at://localhost:${PORT}`));
} catch (e) {
    if (e instanceof Error) {
        console.log(e.message)
    }
}