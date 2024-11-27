import { FactoryProvider } from '@angular/core';

export const enum DataProviderKind {
    Config,
    Context,
    Mappings,
    Testing,
}

export type ErrorMsgDataProvider = {
    __kind: DataProviderKind;
    providers: FactoryProvider | FactoryProvider[];
};

export type DataProviderFactory<T> = () => T;
export type DataProvider<T> = T | DataProviderFactory<T>;
