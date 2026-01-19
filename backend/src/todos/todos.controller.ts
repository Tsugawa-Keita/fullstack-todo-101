import { Body, Controller, Delete, Get, Param, Post, NotFoundException, ParseUUIDPipe, HttpCode, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TodoItem } from './todo.model';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Get()
    @ApiOperation({ summary: 'List todos' })
    @ApiOkResponse({ type: TodoItem, isArray: true })
    findAll(): TodoItem[] {
        return this.todosService.findAll()
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get todo by id' })
    @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
    @ApiOkResponse({ type: TodoItem })
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    findById(@Param("id", ParseUUIDPipe) id: TodoItem['id']): TodoItem {
        const foundTodo = this.todosService.findById(id)
        if (!foundTodo) {
            throw new NotFoundException();
        } else {
            return foundTodo
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create todo' })
    @ApiCreatedResponse({ type: TodoItem })
    @ApiBadRequestResponse()
    create(@Body() dto: CreateTodoDto): TodoItem {
        const createdTodo = this.todosService.create(dto)
        return createdTodo
    }

    @Patch(":id")
    @ApiOperation({ summary: 'Update todo' })
    @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
    @ApiOkResponse({ type: TodoItem })
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    update(
        @Param("id", ParseUUIDPipe) id: TodoItem['id'],
        @Body() dto: UpdateTodoDto
    ): TodoItem {
        const updatedTodo = this.todosService.update(id, dto)
        if (!updatedTodo) {
            throw new NotFoundException()
        } else {
            return updatedTodo
        }
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete todo' })
    @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
    @ApiNoContentResponse()
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    remove(@Param("id", ParseUUIDPipe) id: TodoItem['id']): void {
        const isRemoved = this.todosService.remove(id)
        if (!isRemoved) {
            throw new NotFoundException()
        }
    }
}
