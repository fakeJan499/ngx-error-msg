import { InjectionToken, Provider } from '@angular/core';

export type NgxErrorMsgContext = any;

export const NGX_ERROR_MSG_CONTEXT = new InjectionToken<NgxErrorMsgContext>(
    'NGX_ERROR_MSG_CONTEXT',
);

/**
 * Provides the context value overriding context from the parent injector.
 *
 * @param context The context value that will be used to compute error messages.
 */
export const provideNgxErrorMsgContext = (context: NgxErrorMsgContext): Provider => ({
    provide: NGX_ERROR_MSG_CONTEXT,
    useValue: context,
});
