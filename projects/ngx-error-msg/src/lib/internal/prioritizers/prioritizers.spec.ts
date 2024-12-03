import { ValidationErrors } from '@angular/forms';
import { ErrorMessageMappings } from '../data/mappings';
import { mockErrors } from '../testing/mock-errors';
import { errorsOrder, mappingsOrder } from './prioritizers';

describe(`mappingsOrder`, () => {
    it(`should create prioritizer that orders error messages by the order of mappings`, () => {
        const mappings: ErrorMessageMappings = {
            a: () => 'a',
            b: () => 'b',
            c: () => 'c',
        };
        const errorKeys = ['b', 'a', 'c'];
        const prioritizer = mappingsOrder();
        const comparator = prioritizer(mockErrors(), mappings);

        const result = errorKeys.sort(comparator);

        expect(result).toEqual(['a', 'b', 'c']);
    });

    it(`should create prioritizer that orders error messages by the order of mappings in reverse`, () => {
        const mappings: ErrorMessageMappings = {
            a: () => 'a',
            b: () => 'b',
            c: () => 'c',
        };
        const errorKeys = ['b', 'a', 'c'];
        const prioritizer = mappingsOrder({ direction: 'bottom-up' });
        const comparator = prioritizer(mockErrors(), mappings);

        const result = errorKeys.sort(comparator);

        expect(result).toEqual(['c', 'b', 'a']);
    });

    it(`should use top-down direction by default`, () => {
        const mappings: ErrorMessageMappings = {
            a: () => 'a',
            b: () => 'b',
            c: () => 'c',
        };
        const errorKeys = ['b', 'a', 'c'];

        const implicitDirectionResult = [...errorKeys].sort(
            mappingsOrder()(mockErrors(), mappings),
        );
        const explicitDirectionResult = [...errorKeys].sort(
            mappingsOrder({ direction: 'top-down' })(mockErrors(), mappings),
        );

        expect(implicitDirectionResult).toEqual(explicitDirectionResult);
    });
});

describe(`errorsOrder`, () => {
    it(`should create prioritizer that orders error messages by the order of errors`, () => {
        const mappings: ErrorMessageMappings = {
            a: () => 'a',
            b: () => 'b',
            c: () => 'c',
        };
        const errors: ValidationErrors = { b: true, a: true, c: true };
        const errorKeys = Object.keys(errors);

        const prioritizer = errorsOrder();
        const comparator = prioritizer(errors, mappings);

        const result = errorKeys.sort(comparator);

        expect(result).toEqual(['b', 'a', 'c']);
    });

    it(`should create prioritizer that orders error messages by the order of errors in reverse`, () => {
        const mappings: ErrorMessageMappings = {
            a: () => 'a',
            b: () => 'b',
            c: () => 'c',
        };
        const errors: ValidationErrors = { b: true, a: true, c: true };
        const errorKeys = Object.keys(errors);
        const prioritizer = errorsOrder({ direction: 'bottom-up' });
        const comparator = prioritizer(errors, mappings);

        const result = errorKeys.sort(comparator);

        expect(result).toEqual(['c', 'a', 'b']);
    });

    it(`should use top-down direction by default`, () => {
        const mappings: ErrorMessageMappings = {
            a: () => 'a',
            b: () => 'b',
            c: () => 'c',
        };
        const errorKeys = ['b', 'a', 'c'];

        const implicitDirectionResult = [...errorKeys].sort(errorsOrder()(mockErrors(), mappings));
        const explicitDirectionResult = [...errorKeys].sort(
            errorsOrder({ direction: 'top-down' })(mockErrors(), mappings),
        );

        expect(implicitDirectionResult).toEqual(explicitDirectionResult);
    });
});
