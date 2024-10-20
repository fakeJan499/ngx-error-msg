import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxErrorMsgDirective } from './ngx-error-msg.directive';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

@NgModule({ imports: [NgxErrorMsgDirective], exports: [NgxErrorMsgDirective] })
export class NgxErrorMsgModule {
    /**
     * Provide the error mapper service and its configuration.
     *
     * @see provideNgxErrorMsg
     */
    static forRoot(
        ...args: Parameters<typeof provideNgxErrorMsg>
    ): ModuleWithProviders<NgxErrorMsgModule> {
        return {
            ngModule: NgxErrorMsgModule,
            providers: [provideNgxErrorMsg(...args)],
        };
    }
}
