import { TestBed } from '@angular/core/testing';
import { NGX_ERROR_MSG_CONFIG, NgxErrorMsgConfig } from '../data/config';
import { NgxErrorMsgContext } from '../data/context';
import { ErrorMessageMappings, NGX_ERROR_MSG_MAPPINGS } from '../data/mappings';
import { getTestScheduler } from '../testing/get-test-scheduler';
import { mockConfig } from '../testing/mock-config';
import { mockCtx } from '../testing/mock-ctx';
import { ErrorMessageConcatenationService } from './error-messages-concatenation.service';
import { ErrorsToErrorMessagesMapperService } from './errors-to-error-messages-mapper.service';
import { NgxErrorMsgService } from './ngx-error-msg.service';
import { MappedMessage } from './types';

describe('NgxErrorMsgService', () => {
    let service: NgxErrorMsgService;
    let mapper: jasmine.SpyObj<ErrorsToErrorMessagesMapperService>;
    let concatenationService: jasmine.SpyObj<ErrorMessageConcatenationService>;
    let config: NgxErrorMsgConfig;
    let mappings: ErrorMessageMappings;

    beforeEach(() => {
        mapper = jasmine.createSpyObj('ErrorsToErrorMessagesMapperService', ['toErrorMessages']);
        concatenationService = jasmine.createSpyObj('ErrorMessageConcatenationService', ['concat']);
        config = mockConfig();
        mappings = {};

        TestBed.configureTestingModule({
            providers: [
                NgxErrorMsgService,
                { provide: ErrorsToErrorMessagesMapperService, useValue: mapper },
                { provide: ErrorMessageConcatenationService, useValue: concatenationService },
                { provide: NGX_ERROR_MSG_CONFIG, useValue: config },
                { provide: NGX_ERROR_MSG_MAPPINGS, useValue: mappings },
            ],
        });

        service = TestBed.inject(NgxErrorMsgService);
    });

    describe(`toErrorMessages`, () => {
        it(`should return mapped error messages using injected data`, () => {
            getTestScheduler().run(({ cold, expectObservable }) => {
                const errors = { key: true };
                const ctx = mockCtx();
                const mappedMessages: MappedMessage[] = [
                    { error: 'key', message: 'Error message' },
                ];
                mapper.toErrorMessages.and.returnValue(cold('-a|', { a: mappedMessages }));

                const res$ = service.toErrorMessages(errors, ctx);

                expectObservable(res$).toBe('-a|', { a: mappedMessages });
                expect(mapper.toErrorMessages).toHaveBeenCalledWith(errors, mappings, ctx, config);
            });
        });
    });

    describe(`toErrorMessage`, () => {
        it(`should return mapped error messages joined using separator`, () => {
            getTestScheduler().run(({ cold, expectObservable, flush }) => {
                const errors = { key: true };
                const ctx: NgxErrorMsgContext = { textCtx: 'any' };
                const mappedMessages: MappedMessage[] = [
                    { error: 'error', message: 'Error message' },
                ];
                mapper.toErrorMessages.and.returnValue(cold('-a|', { a: mappedMessages }));
                concatenationService.concat.and.returnValue('Joined message');

                const res$ = service.toErrorMessage(errors, ctx);

                expectObservable(res$).toBe('-a|', { a: 'Joined message' });
                expect(mapper.toErrorMessages).toHaveBeenCalledWith(errors, mappings, ctx, config);
                flush();
                expect(concatenationService.concat).toHaveBeenCalledWith(
                    mappedMessages,
                    config.separator,
                );
            });
        });
    });
});
