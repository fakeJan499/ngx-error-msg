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
import { NgxErrorMsgConfig } from '../data/config';
import { NgxErrorMsgContext } from '../data/context';
import { ErrorMessageMappings } from '../data/mappings';
import { MappedMessage } from '../mappers/types';
import { NgxErrorMsgDirService } from './ngx-error-msg-dir.service';

interface Context {
    $implicit: {
        message: string;
        messages: MappedMessage[];
    };
}

@Directive({
    selector: '[ngxErrorMsg]',
    standalone: true,
    providers: [NgxErrorMsgDirService],
})
export class NgxErrorMsgDirective implements OnInit, OnDestroy {
    private readonly mapper = inject(NgxErrorMsgDirService);
    private readonly templateRef = inject(TemplateRef);
    private readonly viewContainerRef = inject(ViewContainerRef);

    /**
     * Validation errors to be mapped to error message.
     */
    @Input('ngxErrorMsg') set errors(errors: ValidationErrors | null) {
        this.mapper.setErrors(errors);
    }

    /**
     * A record of error keys and their corresponding error message mappers.
     *
     * This is used as primary mapping, before using provided mappers.
     */
    @Input('ngxErrorMsgMappings') set errorsMapping(value: ErrorMessageMappings) {
        this.mapper.setMappings(value);
    }

    /**
     * Configuration for error message.
     *
     * Properties defiled here are prioritized over the provided configuration.
     */
    @Input('ngxErrorMsgConfig') set config(value: Partial<NgxErrorMsgConfig> | null) {
        this.mapper.setConfig(value ?? {});
    }

    /**
     * Context value used as a parameter for error message mappers.
     */
    @Input('ngxErrorMsgCtx') set ctx(value: NgxErrorMsgContext) {
        this.mapper.setContext(value);
    }

    private messageSubscription: Subscription | null = null;

    static ngTemplateContextGuard(_: NgxErrorMsgDirective, ctx: any): ctx is Context {
        return true;
    }

    ngOnInit() {
        this.messageSubscription = this.mapper.vm$.subscribe(({ message, messages }) => {
            this.viewContainerRef.clear();
            this.viewContainerRef.createEmbeddedView<Context>(this.templateRef, {
                $implicit: { message, messages },
            });
        });
    }

    ngOnDestroy() {
        this.messageSubscription?.unsubscribe();
        this.viewContainerRef.clear();
    }
}
