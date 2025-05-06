import { addDays } from 'date-fns';
import { Task } from '../model/task';
import { User } from '../model/user';
import { Priority } from '../model/priority';
import database from './database';

// const users = [
//     new User({
//         id: 1,
//         username: 'johnDoe',
//         password: 'password1234',
//         tasks: [
//             new Task({
//                 id: 1,
//                 description: 'shopping',
//                 sidenote: 'need to do shopping for food.',
//                 startDate: new Date(),
//                 endDate: null,
//                 deadline: addDays(new Date(), 1),
//                 done: false,
//                 priority: new Priority({ levelName: 'basic', colour: 'green' })
//                 user: users[]
//             }),
//         ],
//     }),
//     new User({
//         id: 2,
//         username: 'OdeMalfait',
//         password: 'odespassword1324',
//         tasks: [
//             new Task({
//                 id: 2,
//                 description: 'uploading paper',
//                 sidenote: 'uploading a paper for a certain course',
//                 startDate: new Date(),
//                 endDate: null,
//                 deadline: addDays(new Date(), 4),
//                 done: false,
//                 priority: new Priority({ levelName: 'basic', colour: 'green' }),
//                 userId: 2,
//             }),
//         ],
//     }),
// ];

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            include: {
                tasks: true,
            },
        });
        return usersPrisma.map((user) => User.from(user));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const getUserByUserName = async (username: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.getPassword(),
                role: user.getRole(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const deleteUser = async (id: number): Promise<void> => {
    try {
        const userPrisma = await database.user.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const updatePassword = async (userId: number, newPassword: string) => {
    try {
        const userPrisma = await database.user.update({
            where: { id: userId },
            data: {
                password: newPassword,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    getUserByUserName,
    deleteUser,
    updatePassword,
};
