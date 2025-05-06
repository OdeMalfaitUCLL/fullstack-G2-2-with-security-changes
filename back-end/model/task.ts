import { Priority } from './priority';
import { User } from './user';
import { Task as TaskPrisma, Priority as PriorityPrisma, User as UserPrisma } from '@prisma/client';

export class Task {
    private id?: number;
    private description: string;
    private sidenote?: string;
    private startDate: Date;
    private endDate: Date | null;
    private deadline: Date;
    private done: boolean;
    private priority: Priority;
    private user: User;

    constructor(task: {
        id?: number;
        description: string;
        sidenote?: string;
        startDate: Date;
        endDate: Date | null;
        deadline: Date;
        done: boolean;
        priority: Priority;
        user: User;
    }) {
        this.validate(task);
        this.id = task.id;
        this.description = task.description;
        this.sidenote = task.sidenote;
        this.startDate = task.startDate;
        this.endDate = null;
        this.deadline = task.deadline;
        this.done = task.done;
        this.priority = task.priority;
        this.user = task.user;
    }

    validate(task: { startDate: Date; description: string; deadline: Date; user: User }) {
        if (!task.description) {
            throw new Error('Description is required.');
        }
        if (!task.deadline) {
            throw new Error('Deadline is required.');
        }
        if (task.startDate > task.deadline) {
            throw new Error('Deadline has to be after startDate.');
        }
        if (!task.user) {
            throw new Error('User is required.');
        }
    }

    getId(): number | undefined {
        return this.id;
    }
    getDescription(): string {
        return this.description;
    }
    getSidenote(): string | undefined {
        return this.sidenote;
    }
    getStartDate(): Date {
        return this.startDate;
    }
    getEndDate(): Date | null {
        return this.endDate;
    }
    getDeadline(): Date {
        return this.deadline;
    }
    getDone(): boolean {
        return this.done;
    }
    getPriority(): Priority {
        return this.priority;
    }
    getUser(): User {
        return this.user;
    }
    finishTask(): void {
        this.done = true;
        this.endDate = new Date();
    }

    equals(task: Task): boolean {
        return (
            this.id === task.getId() &&
            this.description === task.getDescription() &&
            this.sidenote === task.getSidenote() &&
            this.startDate === task.getStartDate() &&
            this.endDate === task.getEndDate() &&
            this.deadline === task.getDeadline() &&
            this.done === task.getDone() &&
            this.priority.equals(task.getPriority()) &&
            this.user.equals(task.getUser())
        );
    }

    static from({
        id,
        description,
        sidenote,
        startDate,
        endDate,
        deadline,
        done,
        priority,
        user,
    }: TaskPrisma & { priority: PriorityPrisma; user: UserPrisma }) {
        return new Task({
            id,
            description,
            sidenote: sidenote || undefined,
            startDate,
            endDate,
            deadline,
            done,
            priority: Priority.from(priority),
            user: User.from(user),
        });
    }
}
