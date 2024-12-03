import { inject, Provider } from '@angular/core';
import {
    defaultConfig,
    mergeConfigs,
    NGX_ERROR_MSG_CONFIG,
    NgxErrorMsgConfig,
} from '../data/config';
import { ErrorMessageMappings, mergeMappings, NGX_ERROR_MSG_MAPPINGS } from '../data/mappings';
import { NgxErrorMsgService } from '../mappers/ngx-error-msg.service';
import { getProvidedData } from './helpers';
import { DataProvider, DataProviderKind, ErrorMsgDataProvider } from './types';

/**
 * Provides data for the NgxErrorMsg. It creates a new scope in DI for the error message mappings.
 *
 * @param data Data providers such as withConfig({}). The first element is required.
 */
export const provideNgxErrorMsg = (
    ...data: [ErrorMsgDataProvider, ...ErrorMsgDataProvider[]]
): Provider => [NgxErrorMsgService, ...data.map(d => d.providers)];

/**
 * Creates a data provider for the error message config.
 * It merges the given config with the parent config (from parent injector) or the default config if no parent config is found.
 *
 * @param config The config to provide.
 */
export const withConfig = (
    config: DataProvider<Partial<NgxErrorMsgConfig>>,
): ErrorMsgDataProvider => {
    return {
        __kind: DataProviderKind.Config,
        providers: {
            provide: NGX_ERROR_MSG_CONFIG,
            useFactory: () => {
                const parentConfig = inject(NGX_ERROR_MSG_CONFIG, {
                    optional: true,
                    skipSelf: true,
                });
                const providedConfig = getProvidedData(config);

                return mergeConfigs(parentConfig ?? defaultConfig, providedConfig);
            },
        },
    };
};

/**
 * It creates a data provider for the error message mappings.
 * It merges the given mappings with the parent mappings (from parent injector) if they exist
 * prioritizing the given mappings over the parent mappings.
 *
 * @param mappings The mappings to provide.
 */
export const withMappings = (
    mappings: DataProvider<ErrorMessageMappings>,
): ErrorMsgDataProvider => ({
    __kind: DataProviderKind.Mappings,
    providers: {
        provide: NGX_ERROR_MSG_MAPPINGS,
        useFactory: () => {
            const parentMappings = inject(NGX_ERROR_MSG_MAPPINGS, {
                optional: true,
                skipSelf: true,
            });
            const providedMappings = getProvidedData(mappings);

            return mergeMappings(parentMappings, providedMappings);
        },
    },
});
