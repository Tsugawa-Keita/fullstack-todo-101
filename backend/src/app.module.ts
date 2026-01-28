import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';

@Module({
  imports: [TodosModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [providePrismaClientExceptionFilter()],
})
export class AppModule {}
