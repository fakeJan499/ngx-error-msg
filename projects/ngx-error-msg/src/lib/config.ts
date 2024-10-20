import { InjectionToken } from '@angular/core';

export type NgxErrorMsgConfig = {
    errorsLimit: number;
};

export const NGX_ERROR_MSG_CONFIG = new InjectionToken<NgxErrorMsgConfig>('NGX_ERROR_MSG_CONFIG');

export const defaultConfig: Readonly<NgxErrorMsgConfig> = {
    errorsLimit: 1,
};
