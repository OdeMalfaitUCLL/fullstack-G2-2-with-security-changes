import { Role } from '../types';
import { User as UserPrisma } from '@prisma/client';
export class User {
    private id?: number;
    private username: string;
    private password: string;
    private role: Role;

    constructor(user: { id?: number; username: string; password: string; role: Role }) {
        this.validate(user);
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }
    validate(user: { username: string; password: string; role: Role }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required.');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required.');
        }
        if (!user.role) {
            throw new Error('Role is required.');
        }
    }
    getId(): number | undefined {
        return this.id;
    }
    getUsername(): string {
        return this.username;
    }
    getPassword(): string {
        return this.password;
    }
    getRole(): Role {
        return this.role;
    }
    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.password === user.getPassword() &&
            this.role === user.getRole()
        );
    }

    static from({ id, username, password, role }: UserPrisma) {
        return new User({ id, username, password, role: role as Role });
    }
}
