import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/contxet';
import { TaskService } from './task.service';
import { TaskStatus } from '../resources';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    taskService = new TaskService(
      ctx.prisma as PrismaService,
    );
  });

  it('should create task', async () => {
    const task = {
      id: 1,
      title: 'task',
      description: 'new task description',
      status: TaskStatus.Incomplete,
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-02'),
      deletedAt: null,
      deleted: false,
    };

    mockCtx.prisma.task.create.mockResolvedValue(
      task,
    );

    await expect(
      taskService.createTask(1, task),
    ).resolves.toEqual({
      id: 1,
      title: 'task',
      description: 'new task description',
      status: 'Incomplete',
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-02'),
      deletedAt: null,
      deleted: false,
    });
  });

  it('should update a task properties ', async () => {
    const task = {
      id: 1,
      title: 'task update',
      description: 'new task description update',
      status: TaskStatus.Complete,
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-04'),
      deletedAt: null,
      deleted: false,
    };

    mockCtx.prisma.task.findUnique.mockResolvedValue(
      task,
    );

    mockCtx.prisma.task.update.mockResolvedValue(
      task,
    );

    await expect(
      taskService.editTaskById(1, task.id, task),
    ).resolves.toEqual({
      id: 1,
      title: 'task update',
      description: 'new task description update',
      status: 'Complete',
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-04'),
      deletedAt: null,
      deleted: false,
    });
  });

  it('should delete a task properties ', async () => {
    const task = {
      id: 1,
      title: 'task delete',
      description: 'new task description delete',
      status: TaskStatus.Complete,
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-04'),
      deletedAt: null,
      deleted: false,
    };

    mockCtx.prisma.task.findUnique.mockResolvedValue(
      task,
    );

    mockCtx.prisma.task.delete.mockResolvedValue(
      task,
    );

    await expect(
      taskService.deleteTaskById(1, task.id),
    ).resolves.toEqual({
      id: 1,
      title: 'task delete',
      description: 'new task description delete',
      status: 'Complete',
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-04'),
      deletedAt: null,
      deleted: false,
    });
  });

  it('should get task by id', async () => {
    const task = {
      id: 1,
      title: 'task get',
      description: 'new task description get',
      status: TaskStatus.Complete,
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-04'),
      deletedAt: null,
      deleted: false,
    };

    mockCtx.prisma.task.findFirst.mockResolvedValue(
      task,
    );

    await expect(
      taskService.getTaskById(1, task.id),
    ).resolves.toEqual({
      id: 1,
      title: 'task get',
      description: 'new task description get',
      status: 'Complete',
      dueDate: '2022-01-04',
      userId: 1,
      createdAt: new Date('2022-01-02'),
      updatedAt: new Date('2022-01-04'),
      deletedAt: null,
      deleted: false,
    });
  });

  it('should get empty response if id does not exist', async () => {
    const taskId = 2;

    mockCtx.prisma.task.findFirst.mockResolvedValue(
      null,
    );

    await expect(
      taskService.getTaskById(1, taskId),
    ).resolves.toEqual(null);
  });

  it('should get all tasks', async () => {
    const tasks = [
      {
        id: 1,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 2,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 3,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
    ];

    mockCtx.prisma.task.findMany.mockResolvedValue(
      tasks,
    );

    await expect(
      taskService.getAllTasks(
        1,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ),
    ).resolves.toEqual(tasks);
  });

  it('should get all tasks with the dueDate "2022-01-04"', async () => {
    const tasks = [
      {
        id: 1,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-05',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 2,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 3,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
    ];

    mockCtx.prisma.task.findMany.mockImplementation(
      (args): any => {
        const andConditions = args?.where?.AND as
          | any[]
          | undefined;

        const filteredTasks = tasks.filter(
          (task) => {
            if (!andConditions) return true; // No AND conditions means no filtering

            return andConditions.every(
              (condition) => {
                if ('userId' in condition) {
                  return (
                    task.userId ===
                    condition.userId
                  );
                } else if (
                  'dueDate' in condition
                ) {
                  return (
                    task.dueDate ===
                    condition.dueDate
                  );
                } else if (
                  'status' in condition
                ) {
                  return (
                    task.status ===
                    condition.status
                  );
                }
                return true;
              },
            );
          },
        );

        return Promise.resolve(filteredTasks);
      },
    );

    const result = await taskService.getAllTasks(
      1,
      '2022-01-04',
      TaskStatus.Complete,
      0,
      10,
      'asc',
    );

    // console.log(
    //   'Test received tasks:',
    //   result,
    // );

    expect(result).toHaveLength(2);
  });

  it('should get all tasks with the status "Complete"', async () => {
    const tasks = [
      {
        id: 1,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 2,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Incomplete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 3,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Incomplete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
    ];

    mockCtx.prisma.task.findMany.mockImplementation(
      (args): any => {
        const andConditions = args?.where?.AND as
          | any[]
          | undefined;

        const filteredTasks = tasks.filter(
          (task) => {
            if (!andConditions) return true;

            return andConditions.every(
              (condition) => {
                if ('userId' in condition) {
                  return (
                    task.userId ===
                    condition.userId
                  );
                } else if (
                  'dueDate' in condition
                ) {
                  return (
                    task.dueDate ===
                    condition.dueDate
                  );
                } else if (
                  'status' in condition
                ) {
                  return (
                    task.status ===
                    condition.status
                  );
                }
                return true;
              },
            );
          },
        );

        return Promise.resolve(filteredTasks);
      },
    );

    await expect(
      taskService.getAllTasks(
        1,
        '2022-01-04',
        TaskStatus.Complete,
        0,
        10,
        'asc',
      ),
    ).resolves.toHaveLength(1);
  });

  it('should get tasks with pagination of page size 3 and cusror id 0', async () => {
    const tasks = [
      {
        id: 1,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 2,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 3,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 4,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
      {
        id: 5,
        title: 'task get',
        description: 'new task description get',
        status: TaskStatus.Complete,
        dueDate: '2022-01-04',
        userId: 1,
        createdAt: new Date('2022-01-02'),
        updatedAt: new Date('2022-01-04'),
        deletedAt: null,
        deleted: false,
      },
    ];

    mockCtx.prisma.task.findMany.mockImplementation(
      (args: {
        cursor?: { id: number };
        skip?: number;
        take?: number;
        where?: any;
      }): any => {
        let filteredTasks = tasks;

        if (args.where?.AND) {
          args.where.AND.forEach((condition) => {
            if (condition.userId) {
              filteredTasks =
                filteredTasks.filter(
                  (task) =>
                    task.userId ===
                    condition.userId,
                );
            }
            if (condition.status) {
              filteredTasks =
                filteredTasks.filter(
                  (task) =>
                    task.status ===
                    condition.status,
                );
            }
            if (condition.dueDate) {
              filteredTasks =
                filteredTasks.filter(
                  (task) =>
                    task.dueDate ===
                    condition.dueDate,
                );
            }
          });
        }

        const startIndex = args.cursor?.id
          ? filteredTasks.findIndex(
              (task) =>
                task.id === args.cursor?.id,
            ) + 1
          : 0;
        const paginatedTasks =
          filteredTasks.slice(
            startIndex,
            startIndex + (args.take || 0),
          );

        return Promise.resolve(paginatedTasks);
      },
    );

    await expect(
      taskService.getAllTasks(
        1,
        '2022-01-04',
        TaskStatus.Complete,
        0,
        3,
        'asc',
      ),
    ).resolves.toHaveLength(3);
  });

  afterAll(async () => {
    await mockCtx.prisma.$disconnect();
  });
});
