import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  Logger,
} from '@nestjs/common';
import { ResponseUtil } from '../common/utils/response.util';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.id;
    const task = await this.tasksService.create(createTaskDto, userId);
    return ResponseUtil.created(task, 'Task created successfully');
  }

  @Get()
  async findAll(@Request() req) {
    const tasks = await this.tasksService.findAllByUser(req.user.id);
    return ResponseUtil.success(tasks, 'Tasks retrieved successfully');
  }

  @Get('stats')
  async getStats(@Request() req) {
    const stats = await this.tasksService.getTaskStats(req.user.id);
    return ResponseUtil.success(
      stats,
      'Task statistics retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const task = await this.tasksService.findOne(id, req.user.id);
    return ResponseUtil.success(task, 'Task retrieved successfully');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.update(id, updateTaskDto, userId);
    return ResponseUtil.updated(task, 'Task updated successfully');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Request() req,
  ) {
    const task = await this.tasksService.updateStatus(
      id,
      updateTaskStatusDto,
      req.user.id,
    );
    return ResponseUtil.updated(task, 'Task status updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.tasksService.remove(id, req.user.id);
    return ResponseUtil.deleted('Task deleted successfully');
  }
}
