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
    newTodo: CreateTodoDto;
    editTodo: UpdateTodoDto;
  }>();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isEdit, setIsEdit] = useState<EditingTodo>({ todo_id: 0, title: "" });

  const api = WebAPI.instance;

  const addTodo = async (data: { newTodo: CreateTodoDto }) => {
    await api.createTodo(data.newTodo).then((response) => {
      setTodos((prev) => [response, ...prev]);
      reset({ newTodo: { title: "" } });
    });
  };

  const editTodo = async (data: { editTodo: UpdateTodoDto }) => {
    await api.updateTodo(isEdit.todo_id, data.editTodo).then((response) => {
      const newTodos = todos.map((todo) => todo.todo_id === response.todo_id ? response : todo);
      setTodos(newTodos);
      setIsEdit({ todo_id: 0, title: "" });
      reset({ editTodo: { title: "" } });
    }).catch((error) => {
      console.log(error.message);
    });
  };

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
        <input {...register("newTodo.title")} type="text" className='border-gray-500 border'/>
        <button type="submit">add</button>
      </form>
      {todos.map((todo) => (
        <div key={todo.todo_id} className='flex justify-center items-center gap-2'>
          {isEdit.todo_id === todo.todo_id ? (
            <form onSubmit={handleSubmit(editTodo)}>
              <input {...register("editTodo.title")} type="text" className='border-gray-500 border'/>
              <button>send</button>
            </form>
          ) : (
              <>
                <p>{todo.title}</p>
                <button onClick={() => {
                  setIsEdit({ todo_id: todo.todo_id, title: todo.title });
                  setValue("editTodo.title", todo.title);
                }}>edit</button>
                <button onClick={() => deleteTodo(todo.todo_id)}>delete</button>
              </>
            )
          }
        </div>
      ))}
    </>);
}