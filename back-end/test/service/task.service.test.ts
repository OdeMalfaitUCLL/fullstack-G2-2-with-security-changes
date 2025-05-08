import { UnauthorizedError } from 'express-jwt';
import { Priority } from '../../model/priority';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import priorityDb from '../../repository/priority.db';
import taskDb from '../../repository/task.db';
import userDb from '../../repository/user.db';
import taskService from '../../service/task.service';
import { PriorityInput, TaskInput, UserInput } from '../../types';
import { addDays } from 'date-fns';

const priorityInput: PriorityInput = {
    id: 1,
    levelName: 'basic',
    colour: 'green',
};

const priority = new Priority({
    ...priorityInput,
});
let id = 1;
const user = new User({
    id: id,
    username: 'johnDoe',
    password: 'password1234',
    role: 'user',
});

const userInput: UserInput = {
    id: id,
    username: 'johnDoe',
    password: 'password1234',
    role: 'user',
};

const description = 'shopping 2.0';
const sidenote = 'even more shopping for food.';
const deadline = addDays(new Date(), 1);
const startDate = new Date();
const done = false;
const userId = 1;

const tasks = [
    new Task({
        id: 1,
        description: 'shopping',
        sidenote: 'need to do shopping for food.',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 1),
        done: true,
        priority: new Priority({ id: 1, levelName: 'basic', colour: 'green' }),
        user,
    }),
    new Task({
        id: 2,
        description: 'uploading paper',
        sidenote: 'uploading a paper for a certain course',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 4),
        done: false,
        priority: new Priority({ id: 2, levelName: 'basic', colour: 'green' }),
        user,
    }),
];

let mockUserDbgetUserByUserName: jest.Mock;
let mockPriorityDbGetPriorityById: jest.Mock;
let mockTaskDbGetActiveTasks: jest.Mock;
let mockTaskDbGetAllTasks: jest.Mock;
let mockTaskDbGetTasksByPriority: jest.Mock;
let mockTaskDbCreateTask: jest.Mock;
let mockPriorityDbGetPriorityByName: jest.Mock;
let mockPriorityDbCreatePriority: jest.Mock;
let mockTaskdbGetTaskByUserById: jest.Mock;
let mockTaskDbGetTaskById: jest.Mock;
let mockTaskDbDeleteTask: jest.Mock;
let mockTaskDbEditTask: jest.Mock;
let mockTaskDbGetTasksByPriorityByUser: jest.Mock;
beforeEach(() => {
    mockUserDbgetUserByUserName = jest.fn();
    mockPriorityDbGetPriorityById = jest.fn();
    mockTaskDbGetActiveTasks = jest.fn();
    mockTaskDbGetAllTasks = jest.fn();
    mockTaskDbGetTasksByPriority = jest.fn();
    mockTaskDbCreateTask = jest.fn();
    mockPriorityDbGetPriorityByName = jest.fn();
    mockPriorityDbCreatePriority = jest.fn();
    mockTaskdbGetTaskByUserById = jest.fn();
    mockTaskDbGetTaskById = jest.fn();
    mockTaskDbDeleteTask = jest.fn();
    mockTaskDbEditTask = jest.fn();
    mockTaskDbGetTasksByPriorityByUser = jest.fn();

    userDb.getUserByUserName = mockUserDbgetUserByUserName;
    priorityDb.getPriorityById = mockPriorityDbGetPriorityById;
    taskDb.getActiveTasks = mockTaskDbGetActiveTasks;
    taskDb.getAllTasks = mockTaskDbGetAllTasks;
    taskDb.getTasksByPriority = mockTaskDbGetTasksByPriority;
    taskDb.createTask = mockTaskDbCreateTask;
    priorityDb.getPriorityByName = mockPriorityDbGetPriorityByName;
    priorityDb.createPriority = mockPriorityDbCreatePriority;
    taskDb.getTaskByUserById = mockTaskdbGetTaskByUserById;
    taskDb.getTaskById = mockTaskDbGetTaskById;
    taskDb.deleteTask = mockTaskDbDeleteTask;
    taskDb.editTask = mockTaskDbEditTask;
    taskDb.getTasksByPriorityByUser = mockTaskDbGetTasksByPriorityByUser;

    jest.resetAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given all tasks, when:getting all tasks, then all tasks are returned', async () => {
    //given:
    mockTaskDbGetAllTasks.mockResolvedValue(tasks);

    //when:
    const result = await taskService.getAllTasks();

    //then:
    expect(mockTaskDbGetAllTasks).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(tasks);
});

test('given: valid task, when: task is created, then task is created with those values', async () => {
    //given:
    const deadlineDate = new Date(deadline.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockPriorityDbCreatePriority.mockResolvedValue(priority);
    mockTaskDbCreateTask.mockResolvedValue(
        new Task({
            description,
            sidenote,
            startDate: new Date(),
            endDate: null,
            done: false,
            deadline: deadlineDate,
            priority,
            user,
        })
    );

    //when:
    await taskService.createTask(
        {
            description,
            sidenote,
            deadline,
            priority: priorityInput,
            user: userInput,
        },
        { username: userInput.username, role: userInput.role }
    );

    //then:
    expect(mockUserDbgetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbCreateTask).toHaveBeenCalledTimes(1);
    expect(mockTaskDbCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
            description,
            sidenote,
            startDate: expect.any(Date),
            endDate: null,
            done: false,
            deadline: expect.any(Date),
            priority: expect.objectContaining({
                id: priority.getId(),
                levelName: priority.getLevelName(),
                colour: priority.getColour(),
            }),
            user: expect.objectContaining({
                id: user.getId(),
                username: user.getUsername(),
                role: user.getRole(),
            }),
        })
    );
});

test('given no user, when: task is created, then an error is thrown', async () => {
    expect.assertions(1);
    mockUserDbgetUserByUserName.mockResolvedValue(null);

    await expect(
        taskService.createTask(
            {
                description,
                sidenote,
                deadline,
                priority: priorityInput,
                user: userInput,
            },
            { username: userInput.username, role: userInput.role }
        )
    ).rejects.toThrow(`User not found with given username: ${userInput.username}.`);
});

test('given active tasks, when:getting all active tasks, then all active tasks are returned', async () => {
    //given:
    const activeTasks = [
        new Task({
            id: 1,
            description: 'shopping',
            sidenote: 'need to do shopping for food.',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 1),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'green' }),
            user,
        }),
        new Task({
            id: 2,
            description: 'uploading paper',
            sidenote: 'uploading a paper for a certain course',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 4),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'green' }),
            user,
        }),
    ];
    mockTaskDbGetActiveTasks.mockResolvedValue(activeTasks);

    //when:
    const result = await taskService.getActiveTasks();

    //then:
    expect(mockTaskDbGetActiveTasks).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(activeTasks);
});

test('given active tasks, when:getting all active tasks, then all active tasks are returned', async () => {
    //given:
    mockTaskDbGetActiveTasks.mockResolvedValue([]);

    //when:
    const result = await taskService.getActiveTasks();

    //then:
    expect(mockTaskDbGetActiveTasks).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
});

test('given valid levelName and admin user, when: getting Tasks By Priority, then those tasks are returned', async () => {
    //given:
    mockPriorityDbGetPriorityByName.mockResolvedValue([priority]);
    mockTaskDbGetTasksByPriority.mockResolvedValue(tasks);

    //when:
    const result = await taskService.getTasksByPriority('basic', {
        username: user.getUsername(),
        role: 'admin',
    });

    //then:
    expect(mockPriorityDbGetPriorityByName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbGetTasksByPriority).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(tasks);
});

test('given admin user and valid levelName with no tasks, when: getting Tasks By Priority, then empty list is returned', async () => {
    //given:
    mockPriorityDbGetPriorityByName.mockResolvedValue([priority]);
    mockTaskDbGetTasksByPriority.mockResolvedValue([]);

    //when:
    const result = await taskService.getTasksByPriority('urgent', {
        username: user.getUsername(),
        role: 'admin',
    });

    //then:
    expect(mockPriorityDbGetPriorityByName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbGetTasksByPriority).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
});

test('given user user and valid levelName, when getting Tasks By Priority, then tasks for this user are returned', async () => {
    //given:
    mockPriorityDbGetPriorityByName.mockResolvedValue([priority]);
    mockTaskDbGetTasksByPriorityByUser.mockResolvedValue(tasks);

    //when:
    const result = await taskService.getTasksByPriority('basic', {
        username: user.getUsername(),
        role: user.getRole(),
    });

    //then:
    expect(mockPriorityDbGetPriorityByName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbGetTasksByPriorityByUser).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(tasks);
});

test('given unknown levelName, when: getting Tasks By Priority, then an error is thrown', async () => {
    expect.assertions(1);
    mockPriorityDbGetPriorityByName.mockResolvedValue(null);

    await expect(
        taskService.getTasksByPriority('notALevel', {
            username: user.getUsername(),
            role: user.getRole(),
        })
    ).rejects.toThrow('No Priority found with levelName: notALevel.');
});
test('given invalid role, when: calling getTasks, then an error is thrown', async () => {
    const activeTasks = [
        new Task({
            id: 1,
            description: 'shopping',
            sidenote: 'need to do shopping for food.',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 1),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'green' }),
            user,
        }),
        new Task({
            id: 2,
            description: 'uploading paper',
            sidenote: 'uploading a paper for a certain course',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 4),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'green' }),
            user,
        }),
    ];
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskDbGetActiveTasks.mockResolvedValue(activeTasks);
    await expect(
        taskService.getTasks({ username: user.getUsername(), role: 'invalid' })
    ).rejects.toThrow(
        new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        })
    );
});

test('given valid task and user, when deleting task, then task is deleted', async () => {
    //given:
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskdbGetTaskByUserById.mockResolvedValue(tasks[0]);
    //when:
    const result = await taskService.deleteTask(1, {
        username: user.getUsername(),
        role: user.getRole(),
    });
    //then:
    expect(result).toBeTruthy();
});
test('given valid task and guest user, when deleting task, the unauthorization error is thrown', async () => {
    //given:
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    //when + then:
    await expect(
        taskService.deleteTask(1, { username: user.getUsername(), role: 'guest' })
    ).rejects.toThrow(
        new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        })
    );
});
test('given invalid task, when deleting task, then error is thrown', () => {
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskdbGetTaskByUserById.mockResolvedValue(null);
    const result = async () =>
        await taskService.deleteTask(1, { username: user.getUsername(), role: user.getRole() });
    expect(result).rejects.toThrow('No existing task found with id: 1 for user johnDoe');
});
test('given valid task, when editing task, then edited task is returned', async () => {
    //given:
    const priorityInput: PriorityInput = { levelName: 'urgent', colour: 'red' };
    const taskInput: TaskInput = {
        description: 'Updated description',
        sidenote: 'Updated sidenote',
        deadline: addDays(new Date(), 3),
        priority: priorityInput,
        user: userInput,
    };
    const updatedTask = new Task({
        id: 1,
        description: taskInput.description,
        sidenote: taskInput.sidenote,
        startDate: tasks[0].getStartDate(),
        endDate: null,
        deadline: taskInput.deadline,
        done: false,
        priority: new Priority(priorityInput),
        user,
    });
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskDbGetTaskById.mockResolvedValue(tasks[0]);
    mockTaskDbEditTask.mockResolvedValue(updatedTask);
    //when:
    const result = await taskService.editTask(
        1,
        {
            description: taskInput.description,
            sidenote: taskInput.sidenote,
            deadline: taskInput.deadline,
            priority: priorityInput,
        },
        { username: user.getUsername(), role: user.getRole() }
    );
    //then:
    expect(result).toEqual(updatedTask);
});
test('given invalid user, when editing task, then error is thrown', async () => {
    //given:
    mockUserDbgetUserByUserName.mockResolvedValue(null);
    const priorityInput: PriorityInput = { levelName: 'urgent', colour: 'red' };
    const taskInput: TaskInput = {
        description: 'Updated description',
        sidenote: 'Updated sidenote',
        deadline: addDays(new Date(), 3),
        priority: priorityInput,
        user: userInput,
    };
    //when:
    const result = async () =>
        await taskService.editTask(
            1,
            {
                description: taskInput.description,
                sidenote: taskInput.sidenote,
                deadline: taskInput.deadline,
                priority: priorityInput,
            },
            { username: 'invalidUser', role: user.getRole() }
        );
    //then:
    expect(result).rejects.toThrow('No user found with username: invalidUser');
});
test('given user with guest role, when editing task, then unauthorized error is thrown', () => {
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    const priorityInput: PriorityInput = { levelName: 'urgent', colour: 'red' };
    const taskInput: TaskInput = {
        description: 'Updated description',
        sidenote: 'Updated sidenote',
        deadline: addDays(new Date(), 3),
        priority: priorityInput,
        user: userInput,
    };
    //when:
    const result = async () =>
        await taskService.editTask(
            1,
            {
                description: taskInput.description,
                sidenote: taskInput.sidenote,
                deadline: taskInput.deadline,
                priority: priorityInput,
            },
            { username: user.getUsername, role: 'guest' }
        );
    //then:
    expect(result).rejects.toThrow('you are not authorized to access this resource.');
});
test('given user with admin role and invalid task, then error for admin is thrown', () => {
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskDbGetTaskById.mockResolvedValue(null);
    const priorityInput: PriorityInput = { levelName: 'urgent', colour: 'red' };
    const taskInput: TaskInput = {
        description: 'Updated description',
        sidenote: 'Updated sidenote',
        deadline: addDays(new Date(), 3),
        priority: priorityInput,
        user: userInput,
    };
    //when:
    const result = async () =>
        await taskService.editTask(
            100,
            {
                description: taskInput.description,
                sidenote: taskInput.sidenote,
                deadline: taskInput.deadline,
                priority: priorityInput,
            },
            { username: user.getUsername, role: 'admin' }
        );
    //then:
    expect(result).rejects.toThrow('No task found with id: 100');
});
test('given user with user role and invalid task, then error for admin is thrown', () => {
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskDbGetTaskById.mockResolvedValue(null);
    const priorityInput: PriorityInput = { levelName: 'urgent', colour: 'red' };
    const taskInput: TaskInput = {
        description: 'Updated description',
        sidenote: 'Updated sidenote',
        deadline: addDays(new Date(), 3),
        priority: priorityInput,
        user: userInput,
    };
    //when:
    const result = async () =>
        await taskService.editTask(
            100,
            {
                description: taskInput.description,
                sidenote: taskInput.sidenote,
                deadline: taskInput.deadline,
                priority: priorityInput,
            },
            { username: user.getUsername(), role: 'user' }
        );
    //then:
    expect(result).rejects.toThrow('No task found with id: 100 for user: johnDoe');
});
