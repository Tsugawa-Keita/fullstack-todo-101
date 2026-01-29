import { useEffect, useState } from 'react';
import './App.css'
import { useForm } from "react-hook-form";
import { WebAPI } from './web-api';
import type { components } from './api-types';

type TodoItem = components['schemas']['Todo'];
type CreateTodoDto = components['schemas']['CreateTodoDto'];
type UpdateTodoDto = components['schemas']['UpdateTodoDto'];

// 編集状態: todo_idを持つUpdateTodoDto
type EditingTodo = { todo_id: TodoItem['todo_id'] } & UpdateTodoDto;

export default function App() {
  const { register, handleSubmit, setValue, reset } = useForm<{
    createTodoDto: CreateTodoDto;
    updateTodoDto: UpdateTodoDto;
  }>();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editingTodo, setEditingTodo] = useState<EditingTodo | null>(null);

  const api = WebAPI.instance;

  const addTodo = async (data: { createTodoDto: CreateTodoDto }) => {
    try {
      const response = await api.createTodo(data.createTodoDto)
      setTodos((prev) => [response, ...prev]);
      reset({ createTodoDto: { title: "" } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log('Unknown error occurred')
      }
    }
  }
  
  const editTodo = async (data: { updateTodoDto: UpdateTodoDto }) => {
    if (!editingTodo) return;
    try {
      const response = await api.updateTodo(editingTodo.todo_id, data.updateTodoDto)
      const newTodos = todos.map((todo) => todo.todo_id === response.todo_id ? response : todo);
      setTodos(newTodos);
      setEditingTodo(null);
      reset({ updateTodoDto: { title: "" } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error occurred');
      }
    }
  }
  
  const deleteTodo = async (deleteId: TodoItem['todo_id']) => {
    try {
      await api.deleteTodo(deleteId);
      const newTodos = todos.filter((todo) => todo.todo_id !== deleteId);
      setTodos(newTodos);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error occurred');
      }
    }
  }

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.getTodos();
        setTodos(response);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log('Unknown error occurred');
        }
      }
    }
    fetchTodos();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(addTodo)} className='p-4'>
        <input {...register("createTodoDto.title")} type="text" className='border-gray-500 border'/>
        <button type="submit">add</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.todo_id} className='flex justify-center items-center gap-2'>
          {editingTodo?.todo_id === todo.todo_id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("updateTodoDto.title")} type="text" className='border-gray-500 border'/>
              <button>send</button>
            </form>
          ) : (
              <>
                <p>{todo.title}</p>
                <button onClick={() => {
                  const editTarget: EditingTodo = {
                    todo_id: todo.todo_id,
                    title: todo.title
                  }
                  setEditingTodo(editTarget);
                  setValue("updateTodoDto.title", todo.title);
                }}>edit</button>
                <button onClick={() => deleteTodo(todo.todo_id)}>delete</button>
              </>
            )
          }
        </div>
      ))}
    </>);
}