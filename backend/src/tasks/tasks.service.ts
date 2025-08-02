import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    if (!userId) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_REQUEST);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_REQUEST);
    }

    const userObjectId = new Types.ObjectId(userId);

    try {
      const createdTask = new this.taskModel({
        ...createTaskDto,
        userId: userObjectId,
      });
      return await createdTask.save();
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    try {
      const userObjectId = new Types.ObjectId(userId);
      return await this.taskModel
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Error finding tasks for user: ${error.message}`);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(
    id: string,
    userId: string | Types.ObjectId,
  ): Promise<TaskDocument> {
    try {
      const task = await this.taskModel.findById(id).exec();

      if (!task) {
        throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
      }

      const taskUserId = task.userId.toString();
      const requestUserId =
        userId instanceof Types.ObjectId ? userId.toString() : userId;

      if (taskUserId !== requestUserId) {
        throw new ForbiddenException(ERROR_MESSAGES.TASK_ACCESS_DENIED);
      }

      return task;
    } catch (error) {
      this.logger.error(`Error finding task: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string | Types.ObjectId,
  ): Promise<TaskDocument> {
    try {
      await this.findOne(id, userId);

      const updatedTask = await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedTask) {
        throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
      }

      return updatedTask;
    } catch (error) {
      this.logger.error(`Error updating task: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.TASK_UPDATE_FAILED);
    }
  }

  async updateStatus(
    taskId: string,
    updateData: UpdateTaskStatusDto,
    userId: string,
  ) {
    try {
      const updatedTask = await this.taskModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(taskId),
          userId: new Types.ObjectId(userId),
        },
        { status: updateData.status },
        { new: true },
      );

      if (!updatedTask) {
        throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
      }

      return updatedTask;
    } catch (error) {
      this.logger.error(`Error updating task status: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.TASK_UPDATE_FAILED);
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      await this.findOne(id, userId);
      const result = await this.taskModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(`Error deleting task: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.TASK_DELETE_FAILED);
    }
  }

  async getTaskStats(userId: string) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const tasks = await this.taskModel.find({ userId: userObjectId }).exec();

      return {
        total: tasks.length,
        pending: tasks.filter((task) => task.status === 'pending').length,
        inProgress: tasks.filter((task) => task.status === 'in_progress')
          .length,
        completed: tasks.filter((task) => task.status === 'completed').length,
      };
    } catch (error) {
      this.logger.error(`Error getting task stats: ${error.message}`);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}
