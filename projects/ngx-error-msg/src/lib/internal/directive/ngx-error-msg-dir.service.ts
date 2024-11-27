import { inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    map,
    shareReplay,
    switchMap,
} from 'rxjs';
import { mergeConfigs, NGX_ERROR_MSG_CONFIG, NgxErrorMsgConfig } from '../data/config';
import { defaultCtx, NgxErrorMsgContext } from '../data/context';
import { ErrorMessageMappings, mergeMappings, NGX_ERROR_MSG_MAPPINGS } from '../data/mappings';
import { ErrorMessageConcatenationService } from '../mappers/error-messages-concatenation.service';
import { ErrorsToErrorMessagesMapperService } from '../mappers/errors-to-error-messages-mapper.service';

@Injectable()
export class NgxErrorMsgDirService {
    private readonly mappings = inject(NGX_ERROR_MSG_MAPPINGS);
    private readonly config = inject(NGX_ERROR_MSG_CONFIG);
    private readonly mapper = inject(ErrorsToErrorMessagesMapperService);
    private readonly concatenationService = inject(ErrorMessageConcatenationService);

    private readonly dirMappings$ = new BehaviorSubject<ErrorMessageMappings>({});
    private readonly dirErrors$ = new BehaviorSubject<ValidationErrors | null>(null);
    private readonly dirConfig$ = new BehaviorSubject<Partial<NgxErrorMsgConfig>>({});
    private readonly dirCtx$ = new BehaviorSubject<NgxErrorMsgContext>(defaultCtx);

    private readonly mergedMappings$ = this.dirMappings$.pipe(
        map(mappings => mergeMappings(this.mappings, mappings)),
    );
    private readonly mergedConfig$ = this.dirConfig$.pipe(
        map(config => mergeConfigs(this.config, config)),
        shareReplay({ bufferSize: 1, refCount: true }),
    );
    private readonly separator$ = this.mergedConfig$.pipe(map(x => x.separator));

    private readonly errorMessages$ = combineLatest({
        config: this.mergedConfig$,
        errors: this.dirErrors$,
        mappings: this.mergedMappings$,
        ctx: this.dirCtx$,
    }).pipe(
        switchMap(({ errors, mappings, ctx, config }) =>
            this.mapper.toErrorMessages(errors, mappings, ctx, config),
        ),
        shareReplay({ bufferSize: 1, refCount: true }),
    );

    private readonly errorMessage$ = combineLatest({
        messages: this.errorMessages$,
        separator: this.separator$,
    }).pipe(
        map(({ messages, separator }) => this.concatenationService.concat(messages, separator)),
        distinctUntilChanged(),
    );

    readonly vm$ = combineLatest({
        message: this.errorMessage$,
        messages: this.errorMessages$,
    });

    setConfig(config: Partial<NgxErrorMsgConfig>) {
        this.dirConfig$.next(config);
    }

    setErrors(errors: ValidationErrors | null) {
        this.dirErrors$.next(errors);
    }

    setMappings(mappings: ErrorMessageMappings) {
        this.dirMappings$.next(mappings);
    }

    setContext(ctx: NgxErrorMsgContext) {
        this.dirCtx$.next(ctx);
    }
}
