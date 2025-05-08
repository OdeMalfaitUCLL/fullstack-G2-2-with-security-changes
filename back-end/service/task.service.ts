import { UnauthorizedError } from 'express-jwt';
import { Priority } from '../model/priority';
import { Task } from '../model/task';
import priorityDb from '../repository/priority.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { TaskInput } from '../types';

const getAllTasks = async (): Promise<Task[]> => await taskDb.getAllTasks();

const getActiveTasks = async (): Promise<Task[]> => {
    return await taskDb.getActiveTasks();
};

const getTasks = async ({ username, role }: any): Promise<Task[]> => {
    if (role === 'admin') {
        return taskDb.getActiveTasks();
    } else if (role === 'user' || role === 'guest') {
        const user = await userDb.getUserByUserName(username);
        if (!user) {
            throw new Error(`no User found with username: ${username}.`);
        }
        return await taskDb.getActiveTasksByUser(user);
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    }
};

const createTask = async (
    { description, sidenote, deadline, priority: priorityInput, user: userInput }: TaskInput,
    { username, role }: any
): Promise<Task> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`User not found with given username: ${username}.`);
    }

    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else {
        const priority = new Priority(priorityInput);
        const startDate = new Date();
        const task = new Task({
            description,
            sidenote,
            startDate,
            endDate: null,
            done: false,
            deadline: new Date(deadline.toLocaleString('en-GB', { timeZone: 'Europe/London' })),
            priority,
            user,
        });
        return taskDb.createTask(task);
    }
};

const getTasksByPriority = async (levelName: string, { username, role }: any): Promise<Task[]> => {
    const priority = await priorityDb.getPriorityByName({ levelName });
    if (!priority) {
        throw new Error(`No Priority found with levelName: ${levelName}.`);
    }
    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else if (role === 'admin') {
        return taskDb.getTasksByPriority(levelName);
    } else {
        return taskDb.getTasksByPriorityByUser(levelName, username);
    }
};
const deleteTask = async (taskId: number, { username, role }: any): Promise<boolean> => {
    const user = await userDb.getUserByUserName(username);
    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else if (user && role === 'user') {
        const task = await taskDb.getTaskByUserById(user, taskId);
        if (!task) {
            throw new Error(
                `No existing task found with id: ${taskId} for user ${user.getUsername()}`
            );
        } else {
            taskDb.deleteTask(taskId);
            return true;
        }
    } else if (user && role === 'admin') {
        taskDb.deleteTask(taskId);
        return true;
    }
    return false;
};
const editTask = async (
    taskId: number,
    { description, sidenote, deadline, priority: priorityInput }: TaskInput,
    { username, role }: any
): Promise<Task> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`No user found with username: ${username}`);
    }
    if (user && role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    }
    const task = await taskDb.getTaskById(taskId);
    if (!task) {
        const errorMessage =
            role === 'admin'
                ? `No task found with id: ${taskId}`
                : `No task found with id: ${taskId} for user: ${username}`;
        throw new Error(errorMessage);
    }
    const priority = new Priority(priorityInput);
    const updatedTask = new Task({
        description,
        sidenote,
        deadline,
        startDate: task.getStartDate(),
        endDate: task.getEndDate(),
        done: task.getDone(),
        priority,
        user: task.getUser(),
    });
    const editedTask = await taskDb.editTask(taskId, updatedTask);
    return editedTask;
};
const getTaskById = async (taskId: number, { username, role }: any): Promise<Task | null> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`No user found with username: ${username}`);
    }
    if (user && role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    }
    const task = await taskDb.getTaskById(taskId);
    if (!task) {
        throw new Error(`No task found with id: ${taskId}`);
    }
    return task;
};

export default {
    getAllTasks,
    getActiveTasks,
    createTask,
    getTasksByPriority,
    getTasks,
    deleteTask,
    editTask,
    getTaskById,
};
