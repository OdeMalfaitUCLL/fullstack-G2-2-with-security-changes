import { addDays } from 'date-fns';
import { Task } from '../../model/task';
import { TaskHistory } from '../../model/taskhistory';
import { User } from '../../model/user';
import { Priority } from '../../model/priority';

test('given valid history parameters; when: creating a new history; then: a history is created with the right parameters;', () => {
    //given:
    const user = new User({ id: 1, username: 'JohnDoe', password: 'password1234', role: 'user' });
    //when:
    const history = new TaskHistory({ user, finishedTasks: [] });
    //then:
    expect(history.getUser()).toEqual(user);
    expect(history.getFinishedTasks()).toEqual([]);
});

test('given: valid finished task, when adding task to taskHistory, then task is added to finishedTasks list', () => {
    //given:
    const user = new User({ id: 1, username: 'JohnDoe', password: 'password1234', role: 'user' });
    const history = new TaskHistory({ user, finishedTasks: [] });
    const finishedTask = new Task({
        id: 3,
        description: 'walking',
        sidenote: 'walking the dog.',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 1),
        done: true,
        priority: new Priority({ levelName: 'basic', colour: 'green' }),
        user,
    });
    finishedTask.finishTask();
    //when:
    history.addFinishedTask(finishedTask);
    //then:
    expect(history.getFinishedTasks().length).toEqual(1);
    expect(history.getFinishedTasks()).toContain(finishedTask);
});
test('given not finished task, when adding task to taskHistory, then an error should be thrown;', () => {
    //given:
    const user = new User({ id: 1, username: 'JohnDoe', password: 'password1234', role: 'user' });
    const history = new TaskHistory({ user, finishedTasks: [] });
    const finishedTask = new Task({
        id: 3,
        description: 'walking',
        sidenote: 'walking the dog.',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 1),
        done: false,
        priority: new Priority({ levelName: 'basic', colour: 'green' }),
        user,
    });
    //when:
    const addTaskToHistory = () => {
        return history.addFinishedTask(finishedTask);
    };
    //then:
    expect(addTaskToHistory).toThrow('Task is not done.');
    expect(history.getFinishedTasks().length).toEqual(0);
});
