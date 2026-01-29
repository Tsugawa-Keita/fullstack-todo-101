import { useEffect, useState } from 'react';
import './App.css'
import { useForm } from "react-hook-form";
import { WebAPI } from './web-api';
import type { components } from './api-types';

type TodoItem = components['schemas']['Todo']

export default function App() {
  const { register, handleSubmit, setValue, reset } = useForm<{newTodoText: TodoItem['title'], editTodoText: TodoItem['title']}>();
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isEdit, setIsEdit] = useState<TodoItem>({ todo_id: 0, title: "", created_at: "", completed_at: null });

  const api = WebAPI.instance;

  const addTodo = async ({newTodoText} :{newTodoText: TodoItem['title']}) => {
    await api.createTodo({ title: newTodoText }).then((response) => {
      setTodos((prev) => [response, ...prev])
      reset({newTodoText: ""})
    })
  }

  const editTodo = async ({ editTodoText }: { editTodoText: TodoItem['title'] }) => {
    await api.updateTodo(isEdit.todo_id, { title: editTodoText }).then((response) => {
      const newTodos = todos.map((todo) => todo.todo_id === response.todo_id ? response : todo)
      setTodos(newTodos)
      setIsEdit({ todo_id: 0, title: "", created_at: "", completed_at: null })
      reset({editTodoText: ""})
    }).catch((error) => {
      console.log(error.message)
    })
  }

  const deleteTodo = async (deleteId: number) => {
    await api.deleteTodo(deleteId)
      .then(() => {
      const newTodos = todos.filter((todo) => todo.todo_id !== deleteId)
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
        <div key={todo.todo_id} className='flex justify-center items-center gap-2'>
          {isEdit.todo_id === todo.todo_id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("editTodoText")} type="text" className='border-gray-500 border'/>
              <button>send</button>
            </form>
          ) : (
              <>
                <p>{todo.title}</p>
                <button onClick={() => {
                  setIsEdit(todo)
                  setValue("editTodoText", todo.title)
                }}>edit</button>
                <button onClick={() => deleteTodo(todo.todo_id)}>delete</button>
              </>
            )
          }
        </div>
      ))}
    </>);
}