import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Query,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { GetUser } from '../decorators';
import { JwtGuard } from '../auth/guard';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  EditTaskDto,
} from './dto';
import { User } from '../resources';
import { CustomResponse } from './../helpers';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { TaskCacheInterceptor } from '../interceptors';
import { RedisService } from './../redis/redis.service';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private redisService: RedisService,
  ) {}

  @Get()
  @UseInterceptors(TaskCacheInterceptor)
  async getTasks(
    @GetUser('id') userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe)
    pageSize?: number,
    @Query('sort') sort?: string,
    @Query('dueDate') dueDate?: string,
    @Query('status') status?: string,
  ) {
    const errors: string[] = [];
    const sortingValues = ['asc', 'desc'];
    const statusValues = [
      'incomplete',
      'complete',
    ];

    // Validate the sort parameter
    if (
      sort &&
      !sortingValues.includes(sort.toLowerCase())
    ) {
      errors.push(
        `Invalid sort parameter. Allowed values are ${sortingValues}.`,
      );
    }

    // Validate the status parameter
    if (
      status &&
      !statusValues.includes(status.toLowerCase())
    ) {
      errors.push(
        `Invalid status parameter. Allowed values are ${statusValues}.`,
      );
    }

    if (errors && errors.length) {
      // throw new BadRequestException(...errors);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: [...errors],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const totalItems =
      await this.taskService.getTasksCount(
        userId,
        dueDate,
        status,
      );

    return CustomResponse.customResponse(
      await this.taskService.getTasks(
        userId,
        dueDate || '',
        status || '',
        page || 1,
        pageSize || 10,
        sort || 'asc',
      ),
      {
        totalItems: totalItems,
        currentPage: page || 1,
        pageSize: pageSize || 10,
        totalPages: Math.ceil(
          totalItems / (pageSize || 1),
        ),
        sorting: sort,
      },
    );
  }

  /* The same as getTaskes but with cursor based pagination */
  @Get('all')
  @UseInterceptors(TaskCacheInterceptor)
  async getAllTasks(
    @GetUser('id') userId: number,
    @Query('cursorId', ParseIntPipe)
    cursorId?: number | null,
    @Query('pageSize', ParseIntPipe)
    pageSize?: number,
    @Query('sort') sort?: string,
    @Query('dueDate') dueDate?: string,
    @Query('status') status?: string,
  ) {
    const errors: string[] = [];
    const sortingValues = ['asc', 'desc'];
    const statusValues = [
      'incomplete',
      'complete',
    ];

    // Validate the sort parameter
    if (
      sort &&
      !sortingValues.includes(sort.toLowerCase())
    ) {
      errors.push(
        `Invalid sort parameter. Allowed values are ${sortingValues}.`,
      );
    }

    // Validate the status parameter
    if (
      status &&
      !statusValues.includes(status.toLowerCase())
    ) {
      errors.push(
        `Invalid status parameter. Allowed values are ${statusValues}.`,
      );
    }

    if (errors && errors.length) {
      // throw new BadRequestException(...errors);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: [...errors],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const totalItems =
      await this.taskService.getTasksCount(
        userId,
        dueDate,
        status,
      );

    return CustomResponse.customResponseCursorPagination(
      await this.taskService.getAllTasks(
        userId,
        dueDate,
        status,
        cursorId,
        pageSize,
        sort,
      ),
      {
        totalItems: totalItems,
        cursorId: cursorId,
        pageSize: pageSize,
        totalPages: Math.ceil(
          totalItems / (pageSize || 10),
        ),
        sorting: sort,
      },
    );
  }

  @Get(':id')
  @UseInterceptors(TaskCacheInterceptor)
  async getTaskById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return CustomResponse.customResponse(
      await this.taskService.getTaskById(
        user.id,
        taskId,
      ),
    );
  }

  @Post()
  async createTask(
    @GetUser() user: User,
    @Body() dto: CreateTaskDto,
  ) {
    const result =
      await this.taskService.createTask(
        user.id,
        dto,
      );

    await this.redisService.deleteListOfKeysWithPattern(
      [`/api/v1/tasks/user:${user.id}/*`],
    );

    return CustomResponse.customResponse(result);
  }

  @Patch(':id')
  async editTaskById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: EditTaskDto,
  ) {
    return CustomResponse.customResponse(
      await this.taskService.editTaskById(
        userId,
        taskId,
        dto,
      ),
    );
  }

  @Delete(':id')
  async deleteTaskById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return CustomResponse.customResponse(
      await this.taskService.deleteTaskById(
        userId,
        taskId,
      ),
    );
  }
}
