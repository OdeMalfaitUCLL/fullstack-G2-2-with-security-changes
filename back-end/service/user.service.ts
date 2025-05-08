import { User } from '../model/user';
import userDb from '../repository/user.db';
import { AuthenticationResponse, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';
import { UnauthorizedError } from 'express-jwt';
import { TaskHistory } from '../model/taskhistory';
import taskhistoryDb from '../repository/taskhistory.db';
import taskhistoryService from './taskhistory.service';

const getUsers = async ({ username, role }: any): Promise<User[]> => {
    if (role === 'admin') {
        return await userDb.getAllUsers();
    } else if (role === 'user') {
        const user = await userDb.getUserByUserName(username);
        if (!user) {
            throw new Error(`no User found with username: ${username}.`);
        }
        return [user];
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    }
};
const getAllUsers = async (): Promise<User[]> => await userDb.getAllUsers();

const getUserById = async (id: number): Promise<User> => {
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exists.`);
    return user;
};

const createUser = async ({ username, password, role }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByUserName(username);
    if (existingUser) {
        throw new Error(`User with username ${username} is already registered.`);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword, role });
    const newUser = await userDb.createUser(user);
    const taskHistory = new TaskHistory({ user: newUser, finishedTasks: [] });
    await taskhistoryDb.createTaskHistory(taskHistory);
    return newUser;
};

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`User with username: ${username} is not found.`);
    }
    const invalidPassword = await bcrypt.compare(password, user.getPassword());
    if (!invalidPassword) {
        throw new Error('Incorrect username or password');
    }
    return {
        token: generateJwtToken({ username, role: user.getRole().toString() }),
        username: username,
        role: user.getRole().toString(),
    };
};
const userExists = async (username: string): Promise<boolean> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        return false;
    } else {
        return true;
    }
};
const deleteUser = async (userId: number, { username, role }: any): Promise<boolean> => {
    const user = await userDb.getUserByUserName(username);
    if (role === 'guest' || role === 'user') {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    } else if (user && role === 'admin') {
        const deletedUser = await getUserById(userId);
        if (!deletedUser) {
            throw new Error(`No user found with id: ${userId}`);
        } else {
            await taskhistoryService.deleteTaskHistoryFromUser(
                deletedUser.getUsername(),
                deletedUser.getRole()
            );
            await userDb.deleteUser(userId);
            return true;
        }
    }
    return false;
};

const updatePassword = async (
    oldPassword: string,
    newPassword: string,
    { username, role }: any
) => {
    let result = false;
    if (oldPassword?.trim() === '' || newPassword?.trim() === '') {
        throw new Error('Current password and new password are required');
    }
    const existingUser = await userDb.getUserByUserName(username);
    if (!existingUser) {
        throw new Error(`User with username ${username} does not exist`);
    }
    const invalidOldPassword = await bcrypt.compare(oldPassword, existingUser.getPassword());
    if (!invalidOldPassword) {
        throw new Error('Password is not correct.');
    } else {
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        await userDb.updatePassword(Number(existingUser.getId()), hashedNewPassword);
        result = true;
    }
    return result;
};

export default {
    getUsers,
    getAllUsers,
    getUserById,
    createUser,
    authenticate,
    userExists,
    deleteUser,
    updatePassword,
};
