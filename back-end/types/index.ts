type Role = 'admin' | 'user' | 'guest';
type Level = 'basic' | 'neutral' | 'urgent';
type Colour = 'green' | 'yellow' | 'red';

type TaskInput = {
    id?: number;
    description: string;
    sidenote?: string;
    deadline: Date;
    startDate?: Date;
    endDate?: Date;
    priority: PriorityInput;
    done?: boolean;
    user?: UserInput;
};

type PriorityInput = {
    id?: number;
    levelName: Level;
    colour: Colour;
};

type UserInput = {
    id?: number;
    username: string;
    password: string;
    role: Role;
};
type AuthenticationResponse = {
    token: string;
    username: string;
    role: string;
};

export { TaskInput, PriorityInput, UserInput, AuthenticationResponse, Role, Level, Colour };
