import { TestBed } from '@angular/core/testing';
import { mergeConfigs, NGX_ERROR_MSG_CONFIG, NgxErrorMsgConfig } from '../data/config';
import { ErrorMessageMappings, mergeMappings, NGX_ERROR_MSG_MAPPINGS } from '../data/mappings';
import { ErrorMessageConcatenationService } from '../mappers/error-messages-concatenation.service';
import { ErrorsToErrorMessagesMapperService } from '../mappers/errors-to-error-messages-mapper.service';
import { MappedMessage } from '../mappers/types';
import { getTestScheduler } from '../testing/get-test-scheduler';
import { mockConfig } from '../testing/mock-config';
import { NgxErrorMsgDirService } from './ngx-error-msg-dir.service';
import { mockCtx } from '../testing/mock-ctx';
import { defaultCtx } from '../data/context';

describe('NgxErrorMsgDirService', () => {
    let service: NgxErrorMsgDirService;
    let mapper: jasmine.SpyObj<ErrorsToErrorMessagesMapperService>;
    let concatenationService: jasmine.SpyObj<ErrorMessageConcatenationService>;
    let providedMappings: ErrorMessageMappings;
    let providedConfig: NgxErrorMsgConfig;

    beforeEach(() => {
        mapper = jasmine.createSpyObj('ErrorsToErrorMessagesMapperService', ['toErrorMessages']);
        concatenationService = jasmine.createSpyObj('ErrorMessageConcatenationService', ['concat']);

        TestBed.configureTestingModule({
            providers: [
                NgxErrorMsgDirService,
                { provide: ErrorsToErrorMessagesMapperService, useValue: mapper },
                { provide: ErrorMessageConcatenationService, useValue: concatenationService },
                { provide: NGX_ERROR_MSG_MAPPINGS, useValue: {} },
                { provide: NGX_ERROR_MSG_CONFIG, useValue: mockConfig() },
            ],
        });

        service = TestBed.inject(NgxErrorMsgDirService);
        providedMappings = TestBed.inject(NGX_ERROR_MSG_MAPPINGS);
        providedConfig = TestBed.inject(NGX_ERROR_MSG_CONFIG);
    });

    it(`should map messages with the injected data if no inputs set`, () => {
        getTestScheduler().run(({ cold, expectObservable, flush }) => {
            const defaultErrors = null;
            const messages: MappedMessage[] = [];
            const message = '';

            mapper.toErrorMessages.and.returnValue(cold('a', { a: messages }));
            concatenationService.concat.and.returnValue(message);

            expectObservable(service.vm$).toBe('a', { a: { messages, message } });
            flush();
            expect(mapper.toErrorMessages).toHaveBeenCalledWith(
                defaultErrors,
                providedMappings,
                defaultCtx,
                providedConfig,
            );
            expect(concatenationService.concat).toHaveBeenCalledWith(
                messages,
                providedConfig.separator,
            );
        });
    });

    it(`should map messages using merged injected data and date set via setters`, () => {
        getTestScheduler().run(({ cold, expectObservable, flush }) => {
            const errors = { required: true };
            const ctx = { mySuperData: 123 };
            const mappings = { required: 'This field is required and nothing will change it.' };
            const config = mockConfig({ separator: ' | ' });
            const messages: MappedMessage[] = [{ error: 'required', message: mappings.required }];
            const message = 'concatenated message';

            service.setErrors(errors);
            service.setConfig(config);
            service.setContext(ctx);
            service.setMappings(mappings);

            mapper.toErrorMessages.and.returnValue(cold('a', { a: messages }));
            concatenationService.concat.and.returnValue(message);

            expectObservable(service.vm$).toBe('a', { a: { messages, message } });
            flush();
            expect(mapper.toErrorMessages).toHaveBeenCalledWith(
                errors,
                mergeMappings(providedMappings, mappings),
                ctx,
                mergeConfigs(providedConfig, config),
            );
            expect(concatenationService.concat).toHaveBeenCalledWith(messages, config.separator);
        });
    });
});
