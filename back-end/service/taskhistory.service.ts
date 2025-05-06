import { UnauthorizedError } from 'express-jwt';
import { ta } from 'date-fns/locale';
import { Task } from '../model/task';
import taskDb from '../repository/task.db';
import taskhistoryDb from '../repository/taskhistory.db';
import userDb from '../repository/user.db';

const getAllFinishedTasksByUser = async ({ username, role }: any): Promise<Task[]> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`No user found with username ${username}.`);
    }
    const userId = user.getId();
    if (!userId) {
        throw new Error('No id found for this user.');
    } else if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else {
        const historyByUser = await taskhistoryDb.getTaskHistoryByUser(userId);
        if (!historyByUser) {
            throw new Error('No history found by user.');
        }
        return historyByUser.getFinishedTasks();
    }
};

const addFinishedTaskToHistoryByUser = async (
    userId: number,
    taskId: number,
    { username, role }: any
): Promise<Task | null> => {
    if (!userId) {
        throw new Error('Userid is required.');
    }
    if (!(await userDb.getUserById(userId))) {
        throw new Error(`No user found with id ${userId}.`);
    }
    if (!taskId) {
        throw new Error('TaskId is required.');
    }
    const taskhistory = await taskhistoryDb.getTaskHistoryByUser(userId);
    if (!taskhistory) {
        throw new Error('No History found for this User.');
    }

    const finishedTask = await taskDb.getTaskById(taskId);
    if (!finishedTask) {
        throw new Error(`No task found with id ${taskId}.`);
    }
    if (finishedTask.getUser().getId() != userId) {
        throw new Error(`The task is not from owner with id ${userId}.`);
    }
    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else {
        return taskhistoryDb.finishTask({ task: finishedTask });
    }
};
const deleteTaskHistoryFromUser = async (username: string, role: string): Promise<void> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`No user found with username ${username}.`);
    }
    const userId = user.getId();
    if (!userId) {
        throw new Error('No id found for this user.');
    } else if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else {
        const historyByUser = await taskhistoryDb.getTaskHistoryByUser(userId);
        if (!historyByUser) {
            throw new Error('No history found by user.');
        }
        await taskhistoryDb.deleteHistory(user.getId());
    }
};
export default {
    getAllFinishedTasksByUser,
    addFinishedTaskToHistoryByUser,
    deleteTaskHistoryFromUser,
};
