import { inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { NGX_ERROR_MSG_CONFIG } from '../data/config';
import { NgxErrorMsgContext } from '../data/context';
import { NGX_ERROR_MSG_MAPPINGS } from '../data/mappings';
import { ErrorMessageConcatenationService } from './error-messages-concatenation.service';
import { ErrorsToErrorMessagesMapperService } from './errors-to-error-messages-mapper.service';
import { MappedMessage } from './types';

/**
 * Service that converts validation errors to error messages.
 */
@Injectable()
export abstract class NgxErrorMsgService {
    private readonly mappings = inject(NGX_ERROR_MSG_MAPPINGS);
    private readonly config = inject(NGX_ERROR_MSG_CONFIG);
    private readonly mapper = inject(ErrorsToErrorMessagesMapperService);
    private readonly concatenationService = inject(ErrorMessageConcatenationService);

    /**
     * It converts the given validation errors to an error message using the mappings and
     * config from the nearest scope created by provideNgxErrorMsg.
     */
    toErrorMessage(errors: ValidationErrors | null, ctx?: NgxErrorMsgContext): Observable<string> {
        return this.toErrorMessages(errors, ctx).pipe(
            map(messages => this.concatenationService.concat(messages, this.config.separator)),
        );
    }

    /**
     * It converts the given validation errors to error messages using the mappings and
     * config from the nearest scope created by provideNgxErrorMsg.
     */
    toErrorMessages(
        errors: ValidationErrors | null,
        ctx?: NgxErrorMsgContext,
    ): Observable<MappedMessage[]> {
        return this.mapper.toErrorMessages(errors, this.mappings, ctx, this.config);
    }
}
