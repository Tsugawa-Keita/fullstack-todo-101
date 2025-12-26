import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { Todo } from './todo.model';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Get()
    findAll(): Todo[] {
        return this.todosService.findAll()
    }

    @Get(":id")
    findById(@Param("id") id: string): Todo {
        return this.todosService.findById(id)
    }
}
