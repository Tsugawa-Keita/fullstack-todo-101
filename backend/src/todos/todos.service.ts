import { Injectable } from '@nestjs/common';
import { TodoItem } from './todo.model';
import { randomUUID } from 'node:crypto';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

@Injectable()
export class TodosService {
    private todos: TodoItem[] = [];
    
    findAll(): TodoItem[] {
        return this.todos
    }

    findById(id: TodoItem['id']): TodoItem | undefined {
        return this.todos.find((todo) => todo.id === id)
    }

    create(dto: CreateTodoDto): TodoItem {
        const uuid = randomUUID()
        const createdTodoItem = {id: uuid, text: dto.text}
        this.todos.push(createdTodoItem)
        return createdTodoItem;
    }


    update(id: TodoItem['id'], dto: UpdateTodoDto): TodoItem | undefined {
        const index = this.todos.findIndex((todo) => todo.id === id)
        if (index === -1) {
            return undefined
        } else {
            const updatedTodoItem: TodoItem = { id, text: dto.text }
            this.todos[index] = updatedTodoItem
            return updatedTodoItem
        }
    }
    
    remove(id: TodoItem['id']): boolean {
        const index = this.todos.findIndex((todo) => todo.id === id)
        if (index === -1) {
            return false
        } else {
            this.todos.splice(index, 1);
            return true
        }
    }
}
