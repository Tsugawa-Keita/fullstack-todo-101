import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Todo } from 'src/generated/prisma/client';

@Injectable()
export class TodosService {
    constructor(private prisma: PrismaService) {}
    
    async findAll(): Promise<Todo[]> {
        return this.prisma.todo.findMany()
    }

    async findById(where: Prisma.TodoWhereUniqueInput): Promise<Todo | null> {
        return this.prisma.todo.findUnique({where})
    }

    async create(data: Prisma.TodoCreateInput): Promise<Todo> {
        return this.create(data)
    }

    async update(params: { where: Prisma.TodoWhereUniqueInput, data: Prisma.TodoUpdateInput }): Promise<Todo> {
        const { data, where } = params
        return this.prisma.todo.update({where, data})
    }
    
    async remove(where: Prisma.TodoWhereUniqueInput): Promise<Todo> {
        return this.prisma.todo.delete({where})
    }
}
