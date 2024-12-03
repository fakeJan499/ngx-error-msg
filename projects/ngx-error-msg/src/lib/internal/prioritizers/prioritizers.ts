import { ErrorMessagesPrioritizer, PrioritizerFactoryConfig } from './types';

/**
 * Creates a prioritizer that orders error messages based on the order of the error mappings.
 */
export const mappingsOrder =
    (config?: PrioritizerFactoryConfig): ErrorMessagesPrioritizer =>
    (_, mappings) => {
        const mappingsKeys = Object.keys(mappings);

        return (errorA, errorB) => {
            const indexA = mappingsKeys.indexOf(errorA);
            const indexB = mappingsKeys.indexOf(errorB);

            if (config?.direction === 'bottom-up') {
                return indexB - indexA;
            }

            return indexA - indexB;
        };
    };

/**
 * Creates a prioritizer that orders error messages based on the order of the errors.
 */
export const errorsOrder =
    (config?: PrioritizerFactoryConfig): ErrorMessagesPrioritizer =>
    errors => {
        const errorsKeys = Object.keys(errors);

        return (errorA, errorB) => {
            const indexA = errorsKeys.indexOf(errorA);
            const indexB = errorsKeys.indexOf(errorB);

            if (config?.direction === 'bottom-up') {
                return indexB - indexA;
            }

            return indexA - indexB;
        };
    };
