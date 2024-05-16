import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
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
  async createTask(@Body() createTaskDto: CreateTaskDto, @User() user): Promise<any> {
    const task = {
      ...createTaskDto,
      userId: user.userId,
      completed: createTaskDto.completed || false,
    };
    const taskId = await this.taskService.create(task);
    return { id: taskId, ...task };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserTasks(@User() user): Promise<any> {
    return this.taskService.getUserTasks(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTask(@Param('id') id: string): Promise<any> {
    const task = await this.taskService.findOne(id);
    if (!task) {
      return { message: 'Task not found.' };
    }
    return task;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<any> {
    await this.taskService.update(id, updateTaskDto);
    return { message: 'Task updated successfully.' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('id') id: string): Promise<any> {
    await this.taskService.remove(id);
    return { message: 'Task deleted successfully.' };
  }
}
