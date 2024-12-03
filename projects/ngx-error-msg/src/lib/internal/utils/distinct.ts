/**
 * Distinct an array of elements. The order of the elements is preserved. First occurrence of an element is kept.
 *
 * @example distinct([1, 2, 1, 3, 4]) => [1, 2, 3, 4]
 */
export const distinct = <T>(arr: T[]): T[] => {
    const set = new Set<T>();
    const result: T[] = [];

    for (const element of arr) {
        if (!set.has(element)) {
            set.add(element);
            result.push(element);
        }
    }

    return result;
};
