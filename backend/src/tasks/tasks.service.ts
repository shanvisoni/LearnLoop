// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Task, TaskDocument } from './schemas/task.schema';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';

// @Injectable()
// export class TasksService {
//   constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

//   // async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
//   //   console.log('=== SERVICE DEBUG ===');
//   //   console.log('Received userId:', userId);
//   //   console.log('UserId type:', typeof userId);
//   //   console.log('==================');

//   //   const createdTask = new this.taskModel({
//   //     ...createTaskDto,
//   //      userId,

//   //   });
//   //   return createdTask.save();
//   // }
//   async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
//     console.log('=== SERVICE DEBUG ===');
//     console.log('Received userId:', userId);
//     console.log('UserId type:', typeof userId);
//     console.log('==================');

//     const userObjectId = new Types.ObjectId(userId);
//     console.log('Converted ObjectId:', userObjectId.toString());

//     const createdTask = new this.taskModel({
//       ...createTaskDto,
//       userId: userObjectId,
//     });
//     return createdTask.save();
//   }

//   async findAllByUser(userId: string): Promise<Task[]> {
//     return this.taskModel.find({ userId }).sort({ createdAt: -1 }).exec();
//   }

//   async findOne(
//     id: string,
//     userId: string | Types.ObjectId,
//   ): Promise<TaskDocument> {
//     console.log('[DEBUG] Finding task with id:', id);
//     console.log('[DEBUG] User ID:', userId);
//     const task = await this.taskModel.findById(id).exec();

//     if (!task) {
//       throw new NotFoundException('Task not found');
//     }

//     const taskUserId = task.userId.toString();
//     const requestUserId =
//       userId instanceof Types.ObjectId ? userId.toString() : userId;
//     console.log('[DEBUG] Task userId (string):', taskUserId);
//     console.log('[DEBUG] Request userId (string):', requestUserId);
//     if (taskUserId !== requestUserId) {
//       throw new ForbiddenException('Access denied');
//     }

//     return task;
//   }

//   async update(
//     id: string,
//     updateTaskDto: UpdateTaskDto,
//     userId: string | Types.ObjectId,
//   ): Promise<TaskDocument> {
//     console.log('[DEBUG] Updating task with id:', id);
//     console.log('[DEBUG] Update data:', updateTaskDto);
//     console.log('[DEBUG] User ID:', userId);
//     const task = await this.findOne(id, userId);

//     const updatedTask = await this.taskModel
//       .findByIdAndUpdate(id, updateTaskDto, { new: true, runValidators: true })
//       .exec();
//     console.log('[DEBUG] Updated task:', updatedTask);
//     if (!updatedTask) {
//       throw new NotFoundException('Task not found');
//     }
//     return updatedTask;
//   }

//   async updateStatus(
//     id: string,
//     updateTaskStatusDto: UpdateTaskStatusDto,
//     userId: string,
//   ): Promise<Task> {
//     const task = await this.findOne(id, userId);

//     task.status = updateTaskStatusDto.status;
//     return task.save();
//   }

//   async remove(id: string, userId: string): Promise<void> {
//     const task = await this.findOne(id, userId);
//     await this.taskModel.findByIdAndDelete(id).exec();
//   }

//   async getTaskStats(userId: string) {
//     const tasks = await this.taskModel.find({ userId }).exec();

//     const stats = {
//       total: tasks.length,
//       pending: tasks.filter((task) => task.status === 'pending').length,
//       inProgress: tasks.filter((task) => task.status === 'in_progress').length,
//       completed: tasks.filter((task) => task.status === 'completed').length,
//     };

//     return stats;
//   }
// }

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    // 🚨 CRITICAL: Force logging to work
    this.logger.error('=== SERVICE DEBUG ===');
    this.logger.error(`Received userId: ${userId}`);
    this.logger.error(`UserId type: ${typeof userId}`);
    this.logger.error('==================');

    // Also try console.error and process.stdout
    console.error('Console ERROR - Received userId:', userId);
    process.stdout.write(`STDOUT SERVICE - userId: ${userId}\n`);

    // 🚨 CRITICAL: Check if userId is valid before conversion
    if (!userId) {
      this.logger.error('ERROR: userId is undefined or null!');
      throw new Error('User ID is required');
    }

    if (!Types.ObjectId.isValid(userId)) {
      this.logger.error(`ERROR: Invalid userId format: ${userId}`);
      throw new Error('Invalid user ID format');
    }

    const userObjectId = new Types.ObjectId(userId);
    this.logger.error(`Converted ObjectId: ${userObjectId.toString()}`);

    const createdTask = new this.taskModel({
      ...createTaskDto,
      userId: userObjectId,
    });

    const savedTask = await createdTask.save();
    this.logger.error(`Saved task userId: ${savedTask.userId.toString()}`);
    return savedTask;
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    const userObjectId = new Types.ObjectId(userId);
    return this.taskModel
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(
    id: string,
    userId: string | Types.ObjectId,
  ): Promise<TaskDocument> {
    this.logger.log('[DEBUG] Finding task with id:', id);
    this.logger.log('[DEBUG] User ID:', userId);
    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const taskUserId = task.userId.toString();
    const requestUserId =
      userId instanceof Types.ObjectId ? userId.toString() : userId;
    this.logger.log('[DEBUG] Task userId (string):', taskUserId);
    this.logger.log('[DEBUG] Request userId (string):', requestUserId);
    if (taskUserId !== requestUserId) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string | Types.ObjectId,
  ): Promise<TaskDocument> {
    this.logger.log('[DEBUG] Updating task with id:', id);
    this.logger.log('[DEBUG] Update data:', updateTaskDto);
    this.logger.log('[DEBUG] User ID:', userId);
    const task = await this.findOne(id, userId);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true, runValidators: true })
      .exec();
    this.logger.log('[DEBUG] Updated task:', updatedTask);
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  // async updateStatus(
  //   id: string,
  //   updateTaskStatusDto: UpdateTaskStatusDto,
  //   userId: string,
  // ): Promise<Task> {
  //   const task = await this.findOne(id, userId);

  //   task.status = updateTaskStatusDto.status;
  //   return task.save();
  // }

  async updateStatus(
    taskId: string,
    updateData: UpdateTaskStatusDto,
    userId: string,
  ) {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(taskId),
        userId: new Types.ObjectId(userId),
      },
      { status: updateData.status },
      { new: true },
    );

    if (!updatedTask) {
      throw new NotFoundException('Task not found or not owned by user');
    }

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async getTaskStats(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const tasks = await this.taskModel.find({ userId: userObjectId }).exec();

    const stats = {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === 'pending').length,
      inProgress: tasks.filter((task) => task.status === 'in_progress').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
    };

    return stats;
  }
}
