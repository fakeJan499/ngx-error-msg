import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { combineLatest, map, Observable, of } from 'rxjs';
import { NgxErrorMsgConfig } from '../data/config';
import { NgxErrorMsgContext } from '../data/context';
import { ErrorMessageMapper, ErrorMessageMappings } from '../data/mappings';
import { MappedMessage, MappingEntry } from './types';

@Injectable({ providedIn: 'root' })
export class ErrorsToErrorMessagesMapperService {
    toErrorMessages(
        errors: ValidationErrors | null,
        mappings: ErrorMessageMappings,
        ctx: NgxErrorMsgContext,
        config: NgxErrorMsgConfig,
    ): Observable<MappedMessage[]> {
        if (!errors) {
            return of([]);
        }

        const messageObservables = this.getMappedErrorMessageObservables(
            errors,
            mappings,
            ctx,
            config,
        );

        if (messageObservables.length === 0) {
            return of([]);
        }

        return combineLatest(messageObservables);
    }

    private getMappedErrorMessageObservables(
        errors: ValidationErrors,
        mappings: ErrorMessageMappings,
        ctx: NgxErrorMsgContext,
        config: NgxErrorMsgConfig,
    ): Observable<MappedMessage>[] {
        const errorsMapEntries = this.limitEntries(
            this.getPrioritizedMappingEntries(errors, mappings),
            config.errorsLimit,
        );

        return errorsMapEntries.map(([key, errorMapping]) =>
            this.toErrorMessageObservable(errorMapping, errors[key], ctx).pipe(
                map(message => ({ error: key, message })),
            ),
        );
    }

    private getPrioritizedMappingEntries(
        errors: ValidationErrors,
        mappings: ErrorMessageMappings,
    ): MappingEntry[] {
        // Prioritize errors by the order of the mappings.
        // Errors that are not mapped are skipped.
        return Object.entries(mappings).filter(([key]) => errors[key]);
    }

    private limitEntries(entries: MappingEntry[], limit: number): MappingEntry[] {
        return limit < 0 ? entries : entries.slice(0, limit);
    }

    private toErrorMessageObservable(
        mapping: ErrorMessageMapper,
        error: any,
        ctx: NgxErrorMsgContext,
    ): Observable<string> {
        const resolvedMessage = typeof mapping === 'string' ? mapping : mapping(error, ctx);

        return typeof resolvedMessage === 'string' ? of(resolvedMessage) : resolvedMessage;
    }
}
