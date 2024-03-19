import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ConstantsModule } from './../../helpers';
import { TaskStatus } from './../../types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn([...ConstantsModule.TaskStatus])
  status: TaskStatus;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
