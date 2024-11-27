import { DataProvider, DataProviderFactory } from './types';

const isDataProviderFactory = <T>(data: DataProvider<T>): data is DataProviderFactory<T> => {
    return typeof data === 'function';
};

export const getProvidedData = <T>(data: DataProvider<T>): T => {
    return isDataProviderFactory(data) ? data() : data;
};
