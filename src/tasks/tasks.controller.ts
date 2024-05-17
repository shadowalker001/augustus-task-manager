import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
    @User() user,
  ): Promise<any> {
    try {
      const task = {
        ...createTaskDto,
        userId: user.userId,
        completed: createTaskDto.completed || false,
      };
      const taskId = await this.taskService.create(task);
      return { id: taskId, ...task };
    } catch (error) {
      throw new HttpException(
        `Form not properly filled!`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserTasks(@User() user): Promise<any> {
    try {
      return this.taskService.getUserTasks(user.userId);
    } catch (error) {
      throw new HttpException(`Invalid request sent!`, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTask(@Param('id') id: string): Promise<any> {
    try {
      const task = await this.taskService.findOne(id);
      if (!task) {
        return { message: 'Task not found.' };
      }
      return task;
    } catch (error) {
      throw new HttpException(`Invalid request sent!`, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ): Promise<any> {
    try {
      await this.taskService.update(id, updateTaskDto);
      return { message: 'Task updated successfully.' };
    } catch (error) {
      throw new HttpException(`Invalid request sent!`, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('id') id: string): Promise<any> {
    try {
      await this.taskService.remove(id);
      return { message: 'Task deleted successfully.' };
    } catch (error) {
      throw new HttpException(`Invalid request sent!`, HttpStatus.BAD_REQUEST);
    }
  }
}
