import { isNullable } from './is-nullable';

describe('isNullable', () => {
    it('should return true for null', () => {
        expect(isNullable(null)).toBe(true);
    });

    it('should return true for undefined', () => {
        expect(isNullable(undefined)).toBe(true);
    });

    it('should return false for a number', () => {
        expect(isNullable(123)).toBe(false);
    });

    it('should return false for a string', () => {
        expect(isNullable('test')).toBe(false);
    });

    it('should return false for an object', () => {
        expect(isNullable({})).toBe(false);
    });

    it('should return false for an array', () => {
        expect(isNullable([])).toBe(false);
    });

    it('should return false for a boolean', () => {
        expect(isNullable(true)).toBe(false);
    });

    it('should return false for a symbol', () => {
        expect(isNullable(Symbol())).toBe(false);
    });

    it('should return false for a function', () => {
        expect(isNullable(() => {})).toBe(false);
    });
});
