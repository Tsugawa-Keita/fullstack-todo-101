import { useEffect, useState } from 'react';
import './App.css'
import { useForm } from "react-hook-form";
import { WebAPI } from './web-api';
import type { components } from './api-types';

type TodoItem = components['schemas']['TodoItem']

export default function App() {
  const { register, handleSubmit, setValue, reset } = useForm<{newTodoText: TodoItem['text'], editTodoText: TodoItem['text']}>();
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isEdit, setIsEdit] = useState<TodoItem>({ id: "", text: "" });

  const api = WebAPI.instance;

  const addTodo = async ({newTodoText} :{newTodoText: TodoItem['text']}) => {
    await api.createTodo(newTodoText).then((response) => {
      setTodos((prev) => [response, ...prev])
      reset({newTodoText: ""})
    })
  }

  const editTodo = async ({ editTodoText }: { editTodoText: TodoItem['text'] }) => {
    await api.updateTodo(isEdit.id, editTodoText).then((response) => {
      const newTodos = todos.map((todo) => todo.id === response.id ? response : todo)
      setTodos(newTodos)
      setIsEdit({ id: "", text: "" })
      reset({editTodoText: ""})
    }).catch((error) => {
      console.log(error.message)
    })
  }

  const deleteTodo = async (deleteId: string) => {
    await api.deleteTodo(deleteId)
      .then(() => {
      const newTodos = todos.filter((todo) => todo.id !== deleteId)
      setTodos(newTodos)
    })
  }

  useEffect(() => {
    api.getTodos()
      .then((response) => {
        setTodos(response)
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(addTodo)} className='p-4'>
        <input {...register("newTodoText")} type="text" className='border-gray-500 border'/>
        <button type="submit">add</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.id} className='flex justify-center items-center gap-2'>
          {isEdit.id === todo.id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("editTodoText")} type="text" className='border-gray-500 border'/>
              <button>send</button>
            </form>
          ) : (
              <>
                <p>{todo.text}</p>
                <button onClick={() => {
                  setIsEdit(todo)
                  setValue("editTodoText", todo.text)
                }}>edit</button>
                <button onClick={() => deleteTodo(todo.id)}>delete</button>
              </>
            )
          }
        </div>
      ))}
    </>);
}