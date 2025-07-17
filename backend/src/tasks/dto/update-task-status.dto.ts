import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus, {
    message: `status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status: TaskStatus;
}
