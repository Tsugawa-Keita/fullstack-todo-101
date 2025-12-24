import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { useForm } from "react-hook-form";

type Todo = { id: string; todo: string; }

export default function App() {
  const { register, handleSubmit, reset } = useForm<{todo: Todo['todo']}>();
  const [todos, setTodos] = useState<Todo[]>([])
  const [isEdit, setIsEdit] = useState<Todo>({ id: "", todo: "" });

  const addTodo = async ({todo} :{todo: Todo['todo']}) => {
    console.log(todo)
    await axios.post('http://localhost:3000/add', {
      data: {todo}
    }).then((response) => {
      console.log(response.data)
      const todo = response.data
      setTodos((prev) => [todo, ...prev])
      reset()
    })
  }

  const editTodo = async ({todo}:{todo: Todo['todo']}) => {
    await axios.put('http://localhost:3000/update', {
      data: {
        id: isEdit.id,
        todo
      }
    }).then((response) => {
      console.log(response.data)
      const newTodos = todos.map((todo) => todo.id === response.data.id ? response.data : todo)
      setTodos(newTodos)
      setIsEdit({ id: "", todo: "" })
      reset()
    }).catch((error) => {
      console.log(error.message)
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
        setTodos(response.data.todos)
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(addTodo)} className='p-4'>
        <input {...register("todo")} type="text" className='border-gray-500 border'/>
        <button type="submit">add</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.id} className='flex justify-center items-center gap-2'>
          {isEdit.id === todo.id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("todo")} type="text" className='border-gray-500 border'/>
              <button>send</button>
            </form>
          ) : (
              <>
                <p>{todo.todo}</p>
                <button onClick={() => setIsEdit(todo)}>edit</button>
                <button onClick={() => deleteTodo(todo.id)}>delete</button>
              </>
            )
          }
        </div>
      ))}
    </>);
}