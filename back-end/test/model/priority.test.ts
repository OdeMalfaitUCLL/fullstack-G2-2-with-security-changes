import { Priority } from '../../model/priority';

test('given valid priority parameters; when: creating a new priority; then: a priority is created with the right parameters;', () => {
    //given:
    const levelName = 'basic';
    const colour = 'green';
    //when:
    const basic = new Priority({ levelName: levelName, colour: colour });
    //then:
    expect(basic.getLevelName()).toEqual(levelName);
    expect(basic.getColour()).toEqual(colour);
});

test('given mismatch between priority level basic and colour; when: creating a new priority; then: an error is thrown;', () => {
    //given:
    const levelName = 'basic';
    const colour = 'red';
    //when:
    const basic = () => {
        new Priority({ levelName: levelName, colour: colour });
    };
    //then:
    expect(basic).toThrow('Basic priority must be green');
});

test('given mismatch between priority level neutral and colour; when: creating a new priority; then: an error is thrown;', () => {
    //given:
    const levelName = 'neutral';
    const colour = 'red';
    //when:
    const neutral = () => {
        new Priority({ levelName: levelName, colour: colour });
    };
    //then:
    expect(neutral).toThrow('Neutral priority must be yellow');
});

test('given mismatch between priority level urgent and colour; when: creating a new priority; then: an error is thrown;', () => {
    //given:
    const levelName = 'urgent';
    const colour = 'green';
    //when:
    const urgent = () => {
        new Priority({ levelName: levelName, colour: colour });
    };
    //then:
    expect(urgent).toThrow('Urgent priority must be red');
});
