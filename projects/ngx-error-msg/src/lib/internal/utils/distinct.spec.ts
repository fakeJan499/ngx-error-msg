import { distinct } from './distinct';

describe('distinct', () => {
    it('should return an array with distinct elements', () => {
        const result = distinct([1, 1, 2, 2, 3, 4]);
        expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should return an empty array when input is empty', () => {
        const result = distinct([]);
        expect(result).toEqual([]);
    });

    it('should return the same array when all elements are distinct', () => {
        const result = distinct([1, 2, 3, 4]);
        expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle an array with all identical elements', () => {
        const result = distinct([1, 1, 1, 1]);
        expect(result).toEqual([1]);
    });

    it('should handle an array with different types of elements', () => {
        const result = distinct([1, '1', 2, '2', 1, '1']);
        expect(result).toEqual([1, '1', 2, '2']);
    });

    it('should preserve the order of first occurrences', () => {
        const result = distinct([3, 1, 2, 3, 1, 2]);
        expect(result).toEqual([3, 1, 2]);
    });
});
