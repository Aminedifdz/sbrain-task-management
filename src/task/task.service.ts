import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  EditTaskDto,
} from './dto';
import { StringHelper } from './../helpers/string-helper';
import { getCursor, getSkip } from './../helpers';
import { Task } from '../resources';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  getTasks(
    userId: number,
    dueDate: string,
    status: string,
    page: number,
    pageSize: number,
    sort: string,
  ) {
    const skip = (page - 1) * pageSize;

    const conditionsPayload = {
      dueDate: {},
      status: {},
    };

    if (dueDate) {
      conditionsPayload.dueDate = {
        dueDate: dueDate,
      };
    }

    if (status) {
      conditionsPayload.status = {
        status:
          StringHelper.capitalizeFirstLetter(
            status,
          ),
      };
    }

    return this.prisma.task.findMany({
      where: {
        AND: [
          { userId: userId },
          { ...conditionsPayload.dueDate },
          { ...conditionsPayload.status },
        ],
      },
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt:
          sort === 'desc' ? 'desc' : 'asc', // Use provided sortOrder or default to 'asc'
      },
    });
  }

  getTasksCount(
    userId: number,
    dueDate: string | undefined,
    status: string | undefined,
  ) {
    const conditionsPayload = {
      dueDate: {},
      status: {},
    };

    if (dueDate)
      conditionsPayload.dueDate = {
        dueDate:
          StringHelper.capitalizeFirstLetter(
            dueDate,
          ),
      };

    if (status)
      conditionsPayload.status = {
        status:
          StringHelper.capitalizeFirstLetter(
            status,
          ),
      };

    // Fetch the total count
    return this.prisma.task.count({
      where: {
        AND: [
          { userId: userId },
          { ...conditionsPayload.dueDate },
          { ...conditionsPayload.status },
        ],
      },
    });
  }

  /* The same as getTaskes but with cursor based pagination */
  getAllTasks(
    userId: number,
    dueDate: string | undefined,
    status: string | undefined,
    cursorId: number | null | undefined,
    pageSize: number | undefined,
    sort: string | undefined,
  ) {
    const cursor = getCursor(cursorId);
    const skip = getSkip(cursor);

    const conditionsPayload = {
      dueDate: {},
      status: {},
    };

    if (dueDate) {
      conditionsPayload.dueDate = {
        dueDate: dueDate,
      };
    }

    if (status) {
      conditionsPayload.status = {
        status:
          StringHelper.capitalizeFirstLetter(
            status,
          ),
      };
    }

    return this.prisma.task.findMany({
      where: {
        AND: [
          { userId: userId },
          { ...conditionsPayload.dueDate },
          { ...conditionsPayload.status },
        ],
      },
      orderBy: {
        createdAt:
          sort === 'desc' ? 'desc' : 'asc', // Use provided sortOrder or default to 'asc'
      },
      cursor,
      skip,
      take: pageSize,
    });
  }

  async getTaskById(
    userId: number,
    taskId: number,
  ) {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      },
    });
  }

  async createTask(
    userId: number,
    dto: CreateTaskDto,
  ) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate,
        status: dto.status,
        userId: userId,
      },
    });
  }

  async editTaskById(
    userId: number,
    taskId: number,
    dto: EditTaskDto,
  ) {
    // get the Task by id
    const task =
      await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    if (!task) {
      return 'Not found.';
    }

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: dto.title || task.title,
        description:
          dto.description || task.description,
        dueDate: dto.dueDate || task.dueDate,
        status: dto.status || task.status,
      },
    });
  }

  async deleteTaskById(
    userId: number,
    taskId: number,
  ) {
    const task =
      await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    const res = task
      ? await this.prisma.task.delete({
          where: {
            id: taskId,
          },
        })
      : `Not found.`;

    return res;
  }
}
