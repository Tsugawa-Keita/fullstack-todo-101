import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { useForm } from "react-hook-form";

type Todo = { id: string; todo: string; }

export default function App() {
  const { register, handleSubmit } = useForm<{todo: Todo['todo']}>();
  const [todos, setTodos] = useState<Todo[]>([])
  const [isEdit, setIsEdit] = useState({ id: "", todo: "" });

  const addTodo = async (event :{todo: Todo['todo']}) => {
    const { todo } = event
    console.log(todo)
    await axios.post('http://localhost:3000/add', {
      data: {todo}
    }).then((response) => {
      console.log(response.data)
      const todo = response.data
      setTodos((prev) => [todo, ...prev])
    })
  }

  const editTodo = async ({todo: editTodoName}:{todo: Todo['todo']}) => {
    await axios.put('http://localhost:3000/update', {
      data: {
        id: isEdit.id,
        todo: editTodoName
      }
    })
  }

  const deleteTodo = async (id: string) => {
    await axios.delete('http://localhost:3000/delete', {
      data: {id}
    }).then((response) => {
      console.log(response)
      const newTodos = todos.filter((todo) => todo.id !== id)
      setTodos(newTodos)
    })
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000")
      .then((response) => {
        console.log(response.data)
        setTodos(response.data)
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(addTodo)}>
        <input {...register("todo")} type="text" />
        <button type="submit">add</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.id} style={{ display: "flex" }}>
          <p>{todo.todo}</p>
          <button onClick={() => deleteTodo(todo.id)}>delete</button>
        </div>
      ))}
    </>);
}