import { TestScheduler } from 'rxjs/testing';

export const getTestScheduler = () =>
    new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
