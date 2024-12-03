import { FactoryProvider } from '@angular/core';
import { DataProviderKind, ErrorMsgDataProvider } from '../providers/types';

export const mockDataProvider = (
    providers: FactoryProvider | FactoryProvider[] = [],
): ErrorMsgDataProvider => ({
    __kind: DataProviderKind.Testing,
    providers,
});
