import { Priority as PriorityPrisma } from '@prisma/client';
import { Colour, Level } from '../types';

export class Priority {
    private id?: number;
    private levelName: Level;
    private colour: Colour;

    constructor(priority: { id?: number; levelName: Level; colour: Colour }) {
        this.validate(priority);
        this.id = priority.id;
        this.levelName = priority.levelName;
        this.colour = priority.colour;
    }

    validate(priority: { levelName: Level; colour: Colour }): boolean {
        if (priority.levelName === 'basic' && priority.colour !== 'green') {
            throw new Error('Basic priority must be green');
        }
        if (priority.levelName === 'neutral' && priority.colour !== 'yellow') {
            throw new Error('Neutral priority must be yellow');
        }
        if (priority.levelName === 'urgent' && priority.colour !== 'red') {
            throw new Error('Urgent priority must be red');
        }
        return true;
    }

    getLevelName(): string {
        return this.levelName;
    }
    getColour(): string {
        return this.colour;
    }
    getId(): number | undefined {
        return this.id;
    }
    equals(priority: Priority): boolean {
        return this.levelName === priority.getLevelName() && this.colour === priority.getColour();
    }

    static from({ id, levelName, colour }: PriorityPrisma) {
        return new Priority({ id, levelName: levelName as Level, colour: colour as Colour });
    }
}
