import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

const app: Application = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.post('/add', (req: Request, res: Response) => {
    console.log(req.body)
    const { todo } = req.body.data;
    const id = randomUUID();
    return res.status(200).json({id, todo})
})

app.get('/', (req: Request, res: Response) => {
    console.log('getリクエストを受け付けました。');
    const todos = [
      {id: "id1", todo: "test1"},
      {id: "id2", todo: "test2"},
      {id: "id3", todo: "test3"},
      {id: "id4", todo: "test4"},
    ]
    return res.status(200).json(todos)
})

app.put('/update', (req: Request, res: Response) => { 
    console.log('updateリクエストを受け付けました。')
    console.log(req.body)
    const { id, todo } = req.body.data
    return res.status(200).json({ id, todo })
})

app.delete('/delete', (req: Request, res: Response) => { 
    console.log('deleteリクエストを受け付けました。')
    console.log(req.body.id)
    return res.status(200).json({message: 'success'})
})

try {
    app.listen(PORT, () => console.log(`server running at://localhost:${PORT}`));
} catch (e) {
    if (e instanceof Error) {
        console.log(e.message)
    }
}