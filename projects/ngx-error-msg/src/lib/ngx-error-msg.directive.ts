import {
    Directive,
    inject,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxErrorMsgConfig } from './config';
import { NgxErrorMsgContext } from './context';
import { NgxErrorMsgDirService } from './ngx-error-msg-dir.service';
import { ErrorMessageMappings } from './ngx-error-msg.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

interface Context {
    $implicit: string | null;
}

@Directive({
    selector: '[ngxErrorMsg]',
    standalone: true,
    providers: [
        NgxErrorMsgDirService,
        provideNgxErrorMsg({
            useExisting: NgxErrorMsgDirService,
        }),
    ],
})
export class NgxErrorMsgDirective implements OnInit, OnDestroy {
    private readonly mapper = inject(NgxErrorMsgDirService);
    private readonly templateRef = inject(TemplateRef);
    private readonly viewContainerRef = inject(ViewContainerRef);

    /**
     * Form errors to be mapped to error message.
     */
    @Input('ngxErrorMsg') set errors(errors: ValidationErrors | null) {
        this.mapper.setErrors(errors);
    }

    /**
     * A record of error keys and their corresponding error message mappers.
     *
     * This is used as primary mapping, before using mappers defined in services.
     */
    @Input('ngxErrorMsgMappings') set errorsMapping(value: ErrorMessageMappings) {
        this.mapper.setErrorMsgMappings(value);
    }

    /**
     * Configuration for error message. This will override the provided configuration.
     */
    @Input('ngxErrorMsgConfig') set config(value: Partial<NgxErrorMsgConfig> | null) {
        this.mapper.setConfig(value ?? {});
    }

    /**
     * Context value used as a parameter for error message mappers. This value overrides the provided context.
     */
    @Input('ngxErrorMsgCtx') set ctx(value: NgxErrorMsgContext) {
        this.mapper.setContext(value);
    }

    protected readonly errorMessage$ = this.mapper.errorMessage$;

    private messageSubscription: Subscription | null = null;

    static ngTemplateContextGuard(_: NgxErrorMsgDirective, ctx: any): ctx is Context {
        return true;
    }

    ngOnInit() {
        this.messageSubscription = this.mapper.errorMessage$.subscribe(message => {
            this.viewContainerRef.clear();
            this.viewContainerRef.createEmbeddedView<Context>(this.templateRef, {
                $implicit: message,
            });
        });
    }

    ngOnDestroy() {
        this.messageSubscription?.unsubscribe();
        this.viewContainerRef.clear();
    }
}
