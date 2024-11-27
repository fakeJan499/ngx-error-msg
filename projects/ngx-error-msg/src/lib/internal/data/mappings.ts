import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { distinct } from '../utils/distinct';
import { NgxErrorMsgContext } from './context';

export type ErrorMessageMapperFn = (
    error: any,
    ctx: NgxErrorMsgContext,
) => Observable<string> | string;
export type StaticErrorMessage = string;
export type ErrorMessageMapper = ErrorMessageMapperFn | StaticErrorMessage;
export type ErrorMessageMappings = Record<string, ErrorMessageMapper>;

export const NGX_ERROR_MSG_MAPPINGS = new InjectionToken<Readonly<ErrorMessageMappings>>(
    'NGX_ERROR_MSG_MAPPINGS',
    { factory: () => ({}) },
);

export const mergeMappings = (
    mappingsCloserToRoot: ErrorMessageMappings | null,
    mappingsCloserToLeaf: ErrorMessageMappings,
): ErrorMessageMappings => {
    if (!mappingsCloserToRoot) {
        return mappingsCloserToLeaf;
    }

    const keys = distinct([
        ...Object.keys(mappingsCloserToLeaf),
        ...Object.keys(mappingsCloserToRoot),
    ]);

    return keys.reduce((acc, key) => {
        if (acc[key] !== undefined) return acc;

        const valueFromRoot = mappingsCloserToRoot[key];
        const valueFromLeaf = mappingsCloserToLeaf[key];

        if (valueFromLeaf) {
            acc[key] = valueFromLeaf;
        } else {
            acc[key] = valueFromRoot;
        }

        return acc;
    }, {} as ErrorMessageMappings);
};
