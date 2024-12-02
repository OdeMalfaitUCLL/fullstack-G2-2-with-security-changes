import { LargeNumberLike } from 'crypto';
import { Task } from '../model/task';
import { TaskHistory } from '../model/taskhistory';
import { addDays } from 'date-fns';
import { Priority } from '../model/priority';
import database from './database';
import { create } from 'domain';


const getAllTaskHistories = async (): Promise<TaskHistory[]> => {
    try {
        const taskHistoriesPrisma = await database.taskHistory.findMany({
            include: {
                user: true,
                finishedTasks: {
                    include: {
                        priority: true,
                        user: true,
                    },
                },
            },
        });
        return taskHistoriesPrisma.map((taskHistoryPrisma) => TaskHistory.from(taskHistoryPrisma));
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const getTaskHistoryByUser = async (userId: number): Promise<TaskHistory | null> => {
    try {
        const taskHistoryPrisma = await database.taskHistory.findUnique({
            where: {userId},
            include: {
                user: true,
                finishedTasks: {
                    include: {
                        priority: true,
                        user: true,
                    },
                },
            },
        })
        return taskHistoryPrisma ? TaskHistory.from(taskHistoryPrisma) : null;
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createTaskHistory = async (taskHistory: TaskHistory): Promise<TaskHistory> => {
    try{
        const taskHistoryPrisma = await database.taskHistory.create({
            data: {
                user: {
                    connect: { id: taskHistory.getUser().getId() }
                },
                finishedTasks: {
                    connect: taskHistory.getFinishedTasks().map((task) => ({ id: task.getId() }))
                }
            },
            include: {
                user: true,
                finishedTasks: {
                    include: {
                        priority: true,
                        user: true,
                    },
                },
            }
        })
        return TaskHistory.from(taskHistoryPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

export default {
    createTaskHistory,
    getAllTaskHistories,
    getTaskHistoryByUser,
};
