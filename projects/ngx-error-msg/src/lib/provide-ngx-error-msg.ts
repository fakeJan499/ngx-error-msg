import { Injector, Provider, Type } from '@angular/core';
import { NGX_ERROR_MSG_CONFIG, NgxErrorMsgConfig, defaultConfig } from './config';
import { NgxErrorMsgService } from './ngx-error-msg.service';

type ConstructorProvider = Type<NgxErrorMsgService>;
type ExistingProvider = { useExisting: Type<NgxErrorMsgService> };
type FactoryProvider = {
    useFactory: (...deps: any[]) => NgxErrorMsgService;
    deps?: any[];
};
type FormErrorMapperProvider = ConstructorProvider | ExistingProvider | FactoryProvider;

const validateConfig = (config: Partial<NgxErrorMsgConfig>): void => {
    if (config.errorsLimit && !Number.isInteger(config.errorsLimit))
        throw new Error('errorsLimit must be an integer');
};

const hasOwnProperty = (obj: object, prop: string): boolean =>
    Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Provide the error mapper service and its configuration.
 *
 * Configuration is optional and is merged with the configuration injected from DI tree and the default one.
 *
 * @param mapper - The function that provides form error mapping.
 * @param config - Optional configuration for the error mapper.
 */
export const provideNgxErrorMsg = (
    mapper: FormErrorMapperProvider,
    config?: Partial<NgxErrorMsgConfig>,
): Provider => {
    if (config) validateConfig(config);

    return [
        hasOwnProperty(mapper, 'useExisting') || hasOwnProperty(mapper, 'useFactory')
            ? { provide: NgxErrorMsgService, ...mapper }
            : { provide: NgxErrorMsgService, useClass: mapper },
        {
            provide: NGX_ERROR_MSG_CONFIG,
            useFactory: (injector: Injector) => ({
                ...injector.get(NGX_ERROR_MSG_CONFIG, defaultConfig, {
                    skipSelf: true,
                }),
                ...config,
            }),
            deps: [Injector],
        },
    ];
};
