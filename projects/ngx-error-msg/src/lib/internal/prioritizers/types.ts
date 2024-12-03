import { ValidationErrors } from '@angular/forms';
import { ErrorMessageMappings } from '../data/mappings';

export type ErrorMessagesPrioritizer = (
    errors: ValidationErrors,
    mappings: ErrorMessageMappings,
) => (errorA: string, errorB: string) => number;
export type MessagesPrioritizationDirection = 'top-down' | 'bottom-up';
export type PrioritizerFactoryConfig = { direction?: MessagesPrioritizationDirection };
