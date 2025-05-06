import { Priority } from '../model/priority';
import database from './database';

const getAllPriorities = async (): Promise<Priority[]> => {
    try {
        const prioritiesPrisma = await database.priority.findMany();
        return prioritiesPrisma.map((priorityPrisma) => Priority.from(priorityPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getPriorityByName = async ({ levelName }: { levelName: string }): Promise<Priority[]> => {
    try {
        const prioritiesPrisma = await database.priority.findMany({
            where: {
                levelName,
            },
        });
        return prioritiesPrisma.map((priorityPrisma) => Priority.from(priorityPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getPriorityById = async (id: number): Promise<Priority | null> => {
    try {
        const priorityPrisma = await database.priority.findUnique({
            where: { id },
        });
        return priorityPrisma ? Priority.from(priorityPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createPriority = async (priority: Priority): Promise<Priority> => {
    try {
        const priorityPrisma = await database.priority.create({
            data: {
                levelName: priority.getLevelName(),
                colour: priority.getColour(),
            },
        });
        return Priority.from(priorityPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllPriorities,
    getPriorityByName,
    getPriorityById,
    createPriority,
};
