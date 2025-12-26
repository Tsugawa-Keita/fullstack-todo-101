import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodosService {
    private todos: Todo[] = [];

    findAll(): Todo[] {
        return this.todos
    }

    findById(id: string): Todo {
        return this.todos.find((todo) => todo.id === id)
    }

    create(todo: todo): todo {
        this.todos.push(todo)
        return todo;
    }

    edit(todo: todo): todo {
        this.todos.map()
    }

}
