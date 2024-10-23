import { inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { BehaviorSubject, combineLatest, distinctUntilChanged, of, switchMap } from 'rxjs';
import { NGX_ERROR_MSG_CONFIG, NgxErrorMsgConfig } from './config';
import { NGX_ERROR_MSG_CONTEXT, NgxErrorMsgContext } from './context';
import { ErrorMessageMappings, NgxErrorMsgService } from './ngx-error-msg.service';

@Injectable()
export class NgxErrorMsgDirService extends NgxErrorMsgService {
    private readonly injectedCtx = inject(NGX_ERROR_MSG_CONTEXT, { optional: true });
    private readonly injectedConfig = inject(NGX_ERROR_MSG_CONFIG);

    private readonly errorMsgMappings$ = new BehaviorSubject<ErrorMessageMappings>({});
    private readonly errors$ = new BehaviorSubject<ValidationErrors | null>(null);
    private readonly overriddenConfig$ = new BehaviorSubject<Partial<NgxErrorMsgConfig>>({});
    private readonly ctx$ = new BehaviorSubject<NgxErrorMsgContext>(null);

    protected override ctx = this.injectedCtx;
    protected override config = { ...this.injectedConfig, ...this.overriddenConfig$.value };

    protected override get errorMsgMappings() {
        return this.errorMsgMappings$.value;
    }

    readonly errorMessage$ = combineLatest({
        config: this.overriddenConfig$,
        errors: this.errors$,
        errorsMap: this.errorMsgMappings$,
        ctx: this.ctx$,
    }).pipe(
        switchMap(({ errors }) => this.toErrorMessage(errors) ?? of(null)),
        distinctUntilChanged(),
    );

    setConfig(config: Partial<NgxErrorMsgConfig>) {
        this.config = { ...this.config, ...config };
        this.overriddenConfig$.next(config);
    }

    setErrors(errors: ValidationErrors | null) {
        this.errors$.next(errors);
    }

    setErrorMsgMappings(mappings: ErrorMessageMappings) {
        this.errorMsgMappings$.next(mappings);
    }

    setContext(ctx: NgxErrorMsgContext) {
        this.ctx = ctx;
        this.ctx$.next(ctx);
    }
}
