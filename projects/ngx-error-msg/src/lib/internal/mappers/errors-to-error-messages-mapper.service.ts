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
            this.getPrioritizedMappingEntries(errors, mappings, config),
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
        config: NgxErrorMsgConfig,
    ): MappingEntry[] {
        // Errors that are not mapped are skipped.
        const mappingEntriesToUse = Object.entries(mappings).filter(([key]) => errors[key]);

        // If there are less than 2 mappings, there is no need to prioritize.
        if (mappingEntriesToUse.length < 2) {
            return mappingEntriesToUse;
        }

        // Avoid additional computations by extracting the comparator function.
        // It prevents creating the comparator function for each comparison.
        const comparator = config.messagesPrioritizer(errors, mappings);

        return mappingEntriesToUse.sort(([errorA], [errorB]) => comparator(errorA, errorB));
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
