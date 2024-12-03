import { InjectionToken } from '@angular/core';
import { mappingsOrder } from '../prioritizers/prioritizers';
import { ErrorMessagesPrioritizer } from '../prioritizers/types';

export type NgxErrorMsgConfig = {
    /**
     * The limit of errors to map.
     * @default -1
     */
    errorsLimit: number;
    /**
     * The separator to use when concatenating error messages.
     * @default ' '
     */
    separator: string;
    /**
     * The prioritizer to use when multiple error messages are mapped.
     * @default mappingsOrder()
     */
    messagesPrioritizer: ErrorMessagesPrioritizer;
};

export const NGX_ERROR_MSG_CONFIG = new InjectionToken<Readonly<NgxErrorMsgConfig>>(
    'NGX_ERROR_MSG_CONFIG',
    { factory: () => defaultConfig },
);
export const defaultConfig: Readonly<NgxErrorMsgConfig> = {
    errorsLimit: -1,
    separator: ' ',
    messagesPrioritizer: mappingsOrder(),
};

export const mergeConfigs = (
    configCloserToRoot: NgxErrorMsgConfig,
    configCloserToLeaf: Partial<NgxErrorMsgConfig>,
): NgxErrorMsgConfig => ({
    ...configCloserToRoot,
    ...configCloserToLeaf,
});
