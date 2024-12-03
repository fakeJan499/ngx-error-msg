import { TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
import { NgxErrorMsgContext } from '../data/context';
import { ErrorMessageMappings } from '../data/mappings';
import { ErrorMessagesPrioritizer } from '../prioritizers/types';
import { getTestScheduler } from '../testing/get-test-scheduler';
import { mockConfig } from '../testing/mock-config';
import { mockCtx } from '../testing/mock-ctx';
import { ErrorsToErrorMessagesMapperService } from './errors-to-error-messages-mapper.service';

describe('ErrorsToErrorMessagesMapperService', () => {
    let service: ErrorsToErrorMessagesMapperService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ErrorsToErrorMessagesMapperService],
        });

        service = TestBed.inject(ErrorsToErrorMessagesMapperService);
    });

    it('should map errors using static error message', done => {
        const expectedMessage = 'This is a static message';

        service
            .toErrorMessages({ static: true }, { static: expectedMessage }, mockCtx(), mockConfig())
            .subscribe(message => {
                expect(message).toEqual([{ error: 'static', message: expectedMessage }]);
                done();
            });
    });

    it('should map errors using error specific content for functional mappers', done => {
        const minlength = 123;
        const errors: ValidationErrors = { minlength: { requiredLength: minlength } };
        const mappings: ErrorMessageMappings = {
            minlength: err => `This field must be at least ${err.requiredLength} characters long.`,
        };

        service.toErrorMessages(errors, mappings, mockCtx(), mockConfig()).subscribe(message => {
            expect(message).toEqual([
                {
                    error: 'minlength',
                    message: `This field must be at least ${minlength} characters long.`,
                },
            ]);
            done();
        });
    });

    it('should return empty array if error is not mapped', done => {
        service
            .toErrorMessages({ notMapped: true }, {}, mockCtx(), mockConfig())
            .subscribe(message => {
                expect(message).toEqual([]);
                done();
            });
    });

    it('should return empty array if there are no errors', done => {
        service
            .toErrorMessages(null, { required: 'Some text' }, mockCtx(), mockConfig())
            .subscribe(message => {
                expect(message).toEqual([]);
                done();
            });
    });

    it('should support async error mapping', done => {
        getTestScheduler().run(({ cold }) => {
            const expectedMessage = 'This is an async error message mapping.';
            const errors = { observable: true };
            const mappings = {
                observable: () => cold('-a|', { a: expectedMessage }),
            };

            service
                .toErrorMessages(errors, mappings, mockCtx(), mockConfig())
                .subscribe(message => {
                    expect(message).toEqual([{ error: 'observable', message: expectedMessage }]);
                    done();
                });
        });
    });

    it('should prioritize error messages using messages prioritizer', done => {
        const alphabeticPrioritizer: ErrorMessagesPrioritizer = () => (a, b) => a.localeCompare(b);
        const config = mockConfig({
            messagesPrioritizer: alphabeticPrioritizer,
        });
        const errors = {
            required: true,
            min: true,
            max: true,
        };
        const mappings = {
            min: 'This is a min error.',
            required: 'This is a required field.',
            max: 'This is a max error.',
        };

        service.toErrorMessages(errors, mappings, mockCtx(), config).subscribe(message => {
            expect(message).toEqual([
                { error: 'max', message: mappings['max'] },
                { error: 'min', message: mappings['min'] },
                { error: 'required', message: mappings['required'] },
            ]);
            done();
        });
    });

    it('should limit errors when errors limit is configured', done => {
        const errors = {
            required: true,
            min: true,
            max: true,
            email: true,
        };
        const mappings = {
            min: 'This is a min error.',
            required: 'This is a required field.',
            max: 'This is a max error.',
        };

        service
            .toErrorMessages(errors, mappings, mockCtx(), mockConfig({ errorsLimit: 2 }))
            .subscribe(message => {
                expect(message).toEqual([
                    { error: 'min', message: mappings['min'] },
                    { error: 'required', message: mappings['required'] },
                ]);
                done();
            });
    });

    it('should pass context to error message mappers', done => {
        const errors: ValidationErrors = { mapperUsingContext: true };
        const mappings: ErrorMessageMappings = {
            mapperUsingContext: (_, ctx: NgxErrorMsgContext) =>
                `This is a message using context: ${ctx.name}`,
        };
        const context: NgxErrorMsgContext = { name: 'some contextual value' };

        service.toErrorMessages(errors, mappings, context, mockConfig()).subscribe(message => {
            expect(message).toEqual([
                {
                    error: 'mapperUsingContext',
                    message: `This is a message using context: ${context.name}`,
                },
            ]);
            done();
        });
    });
});
