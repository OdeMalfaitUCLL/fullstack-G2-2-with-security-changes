/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      AuthenticationResponse:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Authentication response.
 *            token:
 *              type: string
 *              description: JWT access token.
 *            username:
 *              type: string
 *              description: User name.
 *      AuthenticationRequest:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            username:
 *              type: string
 *              description: User's name.
 *            password:
 *              type: string
 *              description: user's password.
 *            role:
 *               $ref: '#/components/schemas/Role'
 *            tasks:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Task'
 *              description: user's list of active tasks.
 *      UserInput:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *            role:
 *               $ref: '#/components/schemas/Role'
 *      Role:
 *          type: string
 *          enum: [admin,user,guest]
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { Role, UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const users = await userService.getUsers({ username, role });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /users/{id}:
 *  get:
 *      security:
 *       - bearerAuth: []
 *      summary: Get a user by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The user id.
 *      responses:
 *          200:
 *              description: A user object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /users/signup:
 *   post:
 *      summary: Create a new user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *         200:
 *            description: The created user.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const result = await userService.createUser(user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /users/login:
 *   post:
 *      security:
 *          - bearerAuth: []
 *      summary: Login as a know user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthenticationRequest'
 *      responses:
 *         200:
 *            description: The created user.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AuthenticationResponse'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput: UserInput = req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'authentication succesfull', ...response });
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /users/exists/{username}:
 *  get:
 *      summary: Know if a User already exists or not.
 *      parameters:
 *          - in: path
 *            name: username
 *            schema:
 *              type: string
 *              required: true
 *              description: The username
 *      responses:
 *          200:
 *              description: boolean
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: boolean
 */
userRouter.get('/exists/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.userExists(String(req.params.username));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /users/deleteUser/{userId}:
 *  delete:
 *      security:
 *       - bearerAuth: []
 *      summary: Delete user by userId
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *              required: true
 *              description: The id of the user.
 *      responses:
 *       200:
 *         description: A message when the user is succesfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
userRouter.delete(
    '/deleteUser/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request = req as Request & { auth: { username: string; role: Role } };
            const { username, role } = request.auth;
            const success = await userService.deleteUser(Number(req.params.userId), {
                username,
                role,
            });
            if (success) {
                res.status(200).json({ message: 'User successfully deleted!' });
            }
        } catch (error) {
            next(error);
        }
    }
);
/**
 * @swagger
 * /users/changePassword:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Update the password for a existing user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                oldPassword:
 *                  type: string
 *                  description: The current password of the user.
 *                newPassword:
 *                  type: string
 *                  description: The new password to set.
 *      responses:
 *         200:
 *            description: Message that password is succesfully updated.
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 */
userRouter.post('/changePassword', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const { oldPassword, newPassword } = req.body;
        const updatedPassword = await userService.updatePassword(oldPassword, newPassword, {
            username,
            role,
        });
        if (updatedPassword) {
            res.status(200).json({
                message: 'Password has been succesfully updated, login again with new credentials!',
            });
        }
    } catch (error) {
        next(error);
    }
});

export { userRouter };
