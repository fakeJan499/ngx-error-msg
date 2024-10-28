import { div, mod, mul, sub, sum } from './sum';

describe('Math functions', () => {
    it('should add two numbers', () => {
        expect(sum(1, 2)).toBe(3);
        expect(sum(-1, -1)).toBe(-2);
        expect(sum(-1, 1)).toBe(0);
    });

    it('should subtract two numbers', () => {
        expect(sub(2, 1)).toBe(1);
        expect(sub(-1, -1)).toBe(0);
        expect(sub(-1, 1)).toBe(-2);
    });

    it('should multiply two numbers', () => {
        expect(mul(2, 3)).toBe(6);
        expect(mul(-2, -3)).toBe(6);
        expect(mul(-2, 3)).toBe(-6);
    });

    it('should divide two numbers', () => {
        expect(div(6, 3)).toBe(2);
        expect(div(-6, -3)).toBe(2);
        expect(div(-6, 3)).toBe(-2);
    });

    it('should return the modulus of two numbers', () => {
        expect(mod(5, 2)).toBe(1);
        expect(mod(-5, 2)).toBe(-1);
        expect(mod(5, -2)).toBe(1);
    });
});
