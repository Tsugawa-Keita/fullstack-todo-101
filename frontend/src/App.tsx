import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { useForm } from "react-hook-form";

type TodoItem = { id: string; text: string; }

export default function App() {
  const { register, handleSubmit, reset } = useForm<{todoText: TodoItem['text']}>();
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isEdit, setIsEdit] = useState<TodoItem>({ id: "", text: "" });

  const addTodo = async ({todoText} :{todoText: TodoItem['text']}) => {
    await axios.post('http://localhost:3000/todos', {
      text: todoText
    }).then((response) => {
      const todo = response.data
      setTodos((prev) => [todo, ...prev])
      reset()
    })
  }

  const editTodo = async ({todoText}:{todoText: TodoItem['text']}) => {
    await axios.patch(`http://localhost:3000/todos/${isEdit.id}`, {
      text: todoText
    }).then((response) => {
      const newTodos = todos.map((todo) => todo.id === response.data.id ? response.data : todo)
      setTodos(newTodos)
      setIsEdit({ id: "", text: "" })
      reset()
    }).catch((error) => {
      console.log(error.message)
    })
  }

  const deleteTodo = async (id: string) => {
    await axios.delete(`http://localhost:3000/todos/${id}`)
      .then(() => {
      const newTodos = todos.filter((todo) => todo.id !== id)
      setTodos(newTodos)
    })
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/todos")
      .then((response) => {
        setTodos(response.data)
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(addTodo)} className='p-4'>
        <input {...register("todoText")} type="text" className='border-gray-500 border'/>
        <button type="submit">add</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.id} className='flex justify-center items-center gap-2'>
          {isEdit.id === todo.id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("todoText")} type="text" className='border-gray-500 border'/>
              <button>send</button>
            </form>
          ) : (
              <>
                <p>{todo.text}</p>
                <button onClick={() => setIsEdit(todo)}>edit</button>
                <button onClick={() => deleteTodo(todo.id)}>delete</button>
              </>
            )
          }
        </div>
      ))}
    </>);
}