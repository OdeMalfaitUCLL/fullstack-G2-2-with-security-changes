import { addDays } from 'date-fns';
import { Task } from '../../model/task';
import { Priority } from '../../model/priority';
import { User } from '../../model/user';

//given:
const id = 1;
const description = 'Boodschappen';
const sidenote = 'Doe boodschappen';
const startDate = new Date();
//deadline morgen te laten zijn
const deadline = addDays(startDate, 1);
const priority = new Priority({ levelName: 'basic', colour: 'green' });

test('given: valid task parameters; when: creating a task;then: a task with the correct parameters is created;', () => {
    //given:
    const user = new User({ id: 1, username: 'JohnDoe', password: 'password1234', role: 'user' });
    //when:
    const task = new Task({
        id,
        description,
        sidenote,
        startDate,
        endDate: null,
        deadline,
        done: false,
        priority,
        user,
    });
    //then:
    expect(task.getId()).toEqual(id);
    expect(task.getDescription()).toEqual(description);
    expect(task.getSidenote()).toEqual(sidenote);
    expect(task.getStartDate().toLocaleDateString()).toEqual(startDate.toLocaleDateString());
    expect(task.getEndDate()).toEqual(null);
    expect(task.getDeadline().toLocaleDateString()).toEqual(deadline.toLocaleDateString());
    expect(task.getDone()).toBeFalsy();
    expect(task.getPriority()).toEqual(priority);
    expect(task.getUser()).toEqual(user);
});

test('given: no description; when: creating a task; then: an error is thrown ', () => {
    //given:
    const user = new User({ id: 1, username: 'JohnDoe', password: 'password1234', role: 'user' });
    //when:
    const task = () => {
        new Task({
            id,
            description: '',
            sidenote,
            startDate,
            endDate: null,
            deadline,
            done: false,
            priority,
            user,
        });
    };
    //then
    expect(task).toThrow('Description is required.');
});
