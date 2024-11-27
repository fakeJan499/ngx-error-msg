import { TestBed } from '@angular/core/testing';
import { ErrorMessageConcatenationService } from './error-messages-concatenation.service';
import { MappedMessage } from './types';

describe('ErrorMessageConcatenationService', () => {
    let service: ErrorMessageConcatenationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ErrorMessageConcatenationService],
        });

        service = TestBed.inject(ErrorMessageConcatenationService);
    });

    ['my separator', ' | ', ''].forEach(separator => {
        it(`should return error messages joined using '${separator}' separator`, () => {
            const messages: MappedMessage[] = [
                { error: 'required', message: 'Required' },
                { error: 'min', message: 'Min' },
                { error: 'email', message: 'Email' },
            ];

            const res = service.concat(messages, separator);

            expect(res).toBe(`Required${separator}Min${separator}Email`);
        });
    });
});
