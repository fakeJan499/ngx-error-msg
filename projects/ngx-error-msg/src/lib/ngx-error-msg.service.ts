import { inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { combineLatest, map, Observable, of } from 'rxjs';
import { NGX_ERROR_MSG_CONFIG } from './config';

export type ErrorMessageMapperFn = (error: any) => Observable<string> | string;
export type StaticErrorMessage = string;
export type ErrorMessageMapper = ErrorMessageMapperFn | StaticErrorMessage;
export type ErrorMessageMappings = Record<string, ErrorMessageMapper>;

/**
 * A base service that maps form errors to error messages.
 * It can be extended to provide custom error messages.
 */
@Injectable()
export abstract class NgxErrorMsgService {
    private readonly parentMapper = inject(NgxErrorMsgService, {
        skipSelf: true,
        optional: true,
    });
    private readonly config = inject(NGX_ERROR_MSG_CONFIG);

    /**
     * A record of error keys and their corresponding error message mappers.
     */
    protected abstract readonly errorMsgMappings: Readonly<ErrorMessageMappings>;

    /**
     * Maps the given form errors to an error message.
     *
     * Priority of errors mapping is based on the following rules:
     * 1. Error messages mapped by this service are prioritized over the parent service.
     * 2. The order of error messages is based on the order of the error keys in the form errors object.
     *
     * @param errors The form errors to map.
     *
     * @returns An observable of the error message or null if no errors or there's no mapping for given errors.
     */
    toErrorMessage(errors: ValidationErrors | null): Observable<string> | null {
        if (!errors) {
            return null;
        }

        return this.getErrorMessage(errors);
    }

    private getErrorMessage(errors: ValidationErrors): Observable<string> | null {
        const messageObservables = this.getMappedErrorMessageObservables(errors);

        if (messageObservables.length === 0) {
            return null;
        }

        return combineLatest(messageObservables).pipe(map(messages => messages.join(' ')));
    }

    private getMappedErrorMessageObservables(errors: ValidationErrors): Observable<string>[] {
        const errorsMapEntries = Object.entries(
            this.getErrorMessageMappingMap(errors, this.config.errorsLimit),
        );

        return errorsMapEntries.map(([key, errorMapping]) =>
            this.toErrorMessageObservable(errorMapping, errors[key]),
        );
    }

    private getErrorMessageMappingMap(
        errors: ValidationErrors,
        limit: number,
    ): ErrorMessageMappings {
        const mapperEntries = Object.entries(this.errorMsgMappings).filter(([key]) => errors[key]);
        const entriesToUse = limit < 0 ? mapperEntries : mapperEntries.slice(0, limit);
        const errorsMap = Object.fromEntries(entriesToUse);

        if (limit >= 0 && mapperEntries.length >= limit) {
            return errorsMap;
        }

        const remainingErrors = Object.fromEntries(
            Object.entries(errors).filter(([key]) => !errorsMap[key]),
        );
        const parentErrorsMap = this.parentMapper?.getErrorMessageMappingMap(
            remainingErrors,
            limit - mapperEntries.length,
        );

        return {
            ...errorsMap,
            ...parentErrorsMap,
        };
    }

    private toErrorMessageObservable(mapping: ErrorMessageMapper, error: any): Observable<string> {
        const resolvedMessage = typeof mapping === 'string' ? mapping : mapping(error);

        return typeof resolvedMessage === 'string' ? of(resolvedMessage) : resolvedMessage;
    }
}
