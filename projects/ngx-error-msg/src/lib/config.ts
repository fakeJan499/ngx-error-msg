import { InjectionToken } from '@angular/core';

export type NgxErrorMsgConfig = {
    /**
     * The limit of errors to map.
     * @default 1
     */
    errorsLimit: number;
    /**
     * The separator to use when concatenating error messages.
     * @default ' '
     */
    separator: string;
};

export const NGX_ERROR_MSG_CONFIG = new InjectionToken<NgxErrorMsgConfig>('NGX_ERROR_MSG_CONFIG');

export const defaultConfig: Readonly<NgxErrorMsgConfig> = {
    errorsLimit: 1,
    separator: ' ',
};
