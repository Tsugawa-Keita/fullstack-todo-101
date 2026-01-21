import { Body, Controller, Delete, Get, Param, Post, NotFoundException, ParseIntPipe, HttpCode, Patch, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from '../generated/prisma/nestjs-dto/create-todo.dto';
import { Todo } from '../generated/prisma/nestjs-dto/todo.entity';
import { UpdateTodoDto } from '../generated/prisma/nestjs-dto/update-todo.dto';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Get()
    @ApiOperation({ summary: 'List todos' })
    @ApiOkResponse({ type: Todo, isArray: true })
    async findAll(): Promise<Todo[]> {
        return this.todosService.findAll()
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get todo by id' })
    @ApiParam({ name: 'id', schema: { type: 'number'} })
    @ApiOkResponse({ type: Todo })
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    async findById(@Param("id", ParseIntPipe) todo_id: Todo['todo_id']): Promise<Todo> {
        const foundTodo = await this.todosService.findById({todo_id})
        if (!foundTodo) {
            throw new NotFoundException();
        } else {
            return foundTodo
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create todo' })
    @ApiCreatedResponse({ type: Todo })
    @ApiBadRequestResponse()
    async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
        return this.todosService.create(createTodoDto)
    }

    @Patch(":id")
    @ApiOperation({ summary: 'Update todo' })
    @ApiParam({ name: 'id', schema: { type: 'number'} })
    @ApiOkResponse({ type: Todo })
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    async update(
        @Param("id", ParseIntPipe) todo_id: Todo['todo_id'],
        @Body() updateTodoDto: UpdateTodoDto
    ): Promise<Todo> {
        const updatedTodo = await this.todosService.update({ where: { todo_id }, data: updateTodoDto })
        if (!updatedTodo) {
            throw new NotFoundException()
        } else {
            return updatedTodo
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete todo' })
    @ApiParam({ name: 'id', schema: { type: 'number'} })
    @ApiNoContentResponse()
    @ApiNotFoundResponse()
    @ApiBadRequestResponse()
    remove(@Param("id", ParseIntPipe) todo_id: Todo['todo_id']): void {
        const isRemoved = this.todosService.remove({todo_id})
        if (!isRemoved) {
            throw new NotFoundException()
        }
    }
}
