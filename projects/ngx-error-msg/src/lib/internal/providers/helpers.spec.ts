import { getProvidedData } from './helpers';
import { DataProvider, DataProviderFactory } from './types';

describe('getProvidedData', () => {
    it('should return the data when it is not a factory', () => {
        const data: DataProvider<string> = 'test data';

        expect(getProvidedData(data)).toBe('test data');
    });

    it('should return the data when it is a factory', () => {
        const expectedData = 'test data from factory';
        const dataFactory: DataProviderFactory<string> = () => expectedData;

        expect(getProvidedData(dataFactory)).toBe(expectedData);
    });
});
