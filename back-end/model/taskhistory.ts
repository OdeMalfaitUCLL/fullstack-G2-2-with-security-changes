import { Task } from './task';
import { User } from './user';
import {
    TaskHistory as TaskHistoryPrisma,
    User as UserPrisma,
    Task as TaskPrisma,
    Priority as PriorityPrisma,
} from '@prisma/client';

export class TaskHistory {
    private user: User;
    private finishedTasks: Task[];

    constructor(task: { user: User; finishedTasks: Task[] }) {
        this.user = task.user;
        this.finishedTasks = task.finishedTasks;
    }

    getUser(): User {
        return this.user;
    }
    getFinishedTasks(): Task[] {
        return this.finishedTasks;
    }

    addFinishedTask(task: Task): void {
        if (!task.getDone()) {
            throw new Error('Task is not done.');
        } else {
            this.finishedTasks.push(task);
        }
    }
    equals(taskHistory: TaskHistory): boolean {
        return (
            this.user.equals(taskHistory.getUser()) &&
            this.finishedTasks.every((task) =>
                taskHistory
                    .getFinishedTasks()
                    .some((taskHistoryTask) => task.equals(taskHistoryTask))
            )
        );
    }

    static from({
        user,
        finishedTasks,
    }: TaskHistoryPrisma & {
        user: UserPrisma;
        finishedTasks: (TaskPrisma & { priority: PriorityPrisma; user: UserPrisma })[];
    }) {
        return new TaskHistory({
            user: User.from(user),
            finishedTasks: finishedTasks.map((task) => Task.from(task)),
        });
    }
}
