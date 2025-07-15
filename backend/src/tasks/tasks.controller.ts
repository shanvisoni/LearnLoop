// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Request,
//   Put,
// } from '@nestjs/common';
// import { TasksService } from './tasks.service';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @Controller('tasks')
// @UseGuards(JwtAuthGuard)
// export class TasksController {
//   constructor(private readonly tasksService: TasksService) {}

//   // @Post()
//   // create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
//   //   return this.tasksService.create(createTaskDto, req.user._id);
//   // }
//   @Post()
//   create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
//     console.log('Authenticated user ID:', req.user.id);
//     console.log('=== TASK CREATION DEBUG ===');
//     console.log('req.user:', req.user);
//     console.log('req.user.id:', req.user.id);
//     console.log('req.user.id type:', typeof req.user.id);
//     console.log('========================');

//     const userId = req.user.id;
//     return this.tasksService.create(createTaskDto, userId);
//   }

//   @Get()
//   findAll(@Request() req) {
//     return this.tasksService.findAllByUser(req.user.id);
//   }

//   @Get('stats')
//   getStats(@Request() req) {
//     return this.tasksService.getTaskStats(req.user.id);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string, @Request() req) {
//     console.log('[DEBUG] GET request for task:', id);
//     console.log('[DEBUG] User from request:', req.user.id);
//     return this.tasksService.findOne(id, req.user.id);
//   }

//   @Put(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateTaskDto: UpdateTaskDto,
//     @Request() req,
//   ) {
//     console.log('[DEBUG] PUT request for task:', id);
//     // const uesrId = req.user._id.toString();
//     const uesrId = req.user.id;
//     console.log('userId type is' + typeof uesrId);
//     return this.tasksService.update(id, updateTaskDto, uesrId);
//   }

//   @Patch(':id/status')
//   updateStatus(
//     @Param('id') id: string,
//     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
//     @Request() req,
//   ) {
//     return this.tasksService.updateStatus(id, updateTaskStatusDto, req.user.id);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string, @Request() req) {
//     return this.tasksService.remove(id, req.user.id);
//   }
// }

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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus } from './schemas/task.schema';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // 🚨 CRITICAL: Force logging to work
    this.logger.error('=== TASK CREATION DEBUG ===');
    this.logger.error(`req.user: ${JSON.stringify(req.user)}`);
    this.logger.error(`req.user.id: ${req.user.id}`);
    this.logger.error(`req.user.id type: ${typeof req.user.id}`);
    this.logger.error('========================');

    // Also try console.log with different methods
    console.error('Console ERROR: req.user.id:', req.user.id);
    process.stdout.write(`STDOUT: req.user.id: ${req.user.id}\n`);

    const userId = req.user.id;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAllByUser(req.user.id);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.tasksService.getTaskStats(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    this.logger.log('[DEBUG] GET request for task:', id);
    this.logger.log('[DEBUG] User from request:', req.user.id);
    return this.tasksService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    this.logger.log('[DEBUG] PUT request for task:', id);
    const userId = req.user.id;
    this.logger.log('userId type is' + typeof userId);
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  // @Patch(':id/status')
  // updateStatus(
  //   @Param('id') id: string,
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //   @Request() req,
  // ) {
  //   return this.tasksService.updateStatus(id, updateTaskStatusDto, req.user.id);
  // }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Request() req,
  ) {
    console.log('TaskStatus enum:', TaskStatus);
    console.log('Object.values(TaskStatus):', Object.values(TaskStatus));
    console.log('Object.keys(TaskStatus):', Object.keys(TaskStatus));
    console.log('Received status:', updateTaskStatusDto.status);

    return this.tasksService.updateStatus(id, updateTaskStatusDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id);
  }
}
