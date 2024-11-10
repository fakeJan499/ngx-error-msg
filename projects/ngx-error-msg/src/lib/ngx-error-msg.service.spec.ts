import { Component, inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { map, timer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { NgxErrorMsgConfig } from './config';
import { NgxErrorMsgContext, provideNgxErrorMsgContext } from './context';
import { mockConfig } from './internal/testing/mock-config';
import { NgxErrorMsgService } from './ngx-error-msg.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

@Injectable()
class PrimaryMapper extends NgxErrorMsgService {
    protected override readonly errorMsgMappings = {
        required: 'This field is required.',
        override: () => 'This is an overridden error.',
        mapperUsingContext: (_: any, ctx: NgxErrorMsgContext) =>
            `This is a message using context: ${ctx.name}`,
        lastPrimaryError: () => 'This is the last primary error.',
    };
}

@Injectable()
class NestedMapper extends NgxErrorMsgService {
    protected override readonly errorMsgMappings = {
        nested: () => 'This is a nested error.',
        override: 'This is a nested overridden error.',
        minlength: (error: any) =>
            `This field must be at least ${error.minlength} characters long.`,
        observable: () => timer(10000).pipe(map(() => 'This is an async error message mapping.')),
    };
}

@Component({
    template: '',
    standalone: true,
})
class TestComponent {
    readonly nestedMapper = inject(NgxErrorMsgService);
}

const getService = (
    config?: Partial<NgxErrorMsgConfig>,
    ctx?: NgxErrorMsgContext,
): NgxErrorMsgService => {
    TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [
            provideNgxErrorMsg(PrimaryMapper, config),
            ctx ? provideNgxErrorMsgContext(ctx) : [],
        ],
    });

    TestBed.overrideComponent(TestComponent, {
        set: {
            providers: [provideNgxErrorMsg(NestedMapper, config)],
        },
    });

    return TestBed.createComponent(TestComponent).componentInstance.nestedMapper;
};

describe('NgxErrorMsgService', () => {
    it('should be created', () => {
        const service = getService();

        expect(service).toBeTruthy();
    });

    describe(`toErrorMessage`, () => {
        it('should return static error message', done => {
            const service = getService();

            service.toErrorMessage({ nested: true })?.subscribe(message => {
                expect(message).toBe('This is a nested error.');
                done();
            });
        });

        it('should return static error message with error specific content', done => {
            const service = getService();

            service.toErrorMessage({ minlength: { minlength: 123 } })?.subscribe(message => {
                expect(message).toBe(`This field must be at least ${123} characters long.`);
                done();
            });
        });

        it('should return null if error is not mapped', () => {
            const service = getService();

            const message = service.toErrorMessage({ notMapped: true });

            expect(message).toBeNull();
        });

        it('should return null if there are no errors', () => {
            const service = getService();

            const message = service.toErrorMessage(null);

            expect(message).toBeNull();
        });

        it('should return error message from parent mapper if message not mapped by itself', done => {
            const service = getService();

            service.toErrorMessage({ required: true })?.subscribe(message => {
                expect(message).toBe('This field is required.');
                done();
            });
        });

        it('should traverse error mappers chain cascade', done => {
            const service = getService();

            service.toErrorMessage({ override: true })?.subscribe(message => {
                expect(message).toBe('This is a nested overridden error.');
                done();
            });
        });

        it('should support async error mapping', done => {
            const service = getService();

            new TestScheduler((actual, expected) => expected(actual).toEqual(expected)).run(() => {
                service.toErrorMessage({ observable: true })?.subscribe(message => {
                    expect(message).toBe('This is an async error message mapping.');
                    done();
                });
            });
        });

        it('should limit errors prioritizing by errors by the order in the errorsMap', done => {
            const service = getService({ errorsLimit: 3 });

            service
                .toErrorMessage({
                    required: true,
                    lastPrimaryError: true,
                    override: true,
                    nested: true,
                })
                ?.subscribe(message => {
                    expect(message).toBe(
                        'This is a nested error. This is a nested overridden error. This field is required.',
                    );
                    done();
                });
        });

        it('should not limit errors if errorsLimit is negative', done => {
            const service = getService({ errorsLimit: -1 });

            service
                .toErrorMessage({
                    required: true,
                    lastPrimaryError: true,
                    override: true,
                    nested: true,
                })
                ?.subscribe(message => {
                    expect(message).toBe(
                        'This is a nested error. This is a nested overridden error. This field is required. This is the last primary error.',
                    );
                    done();
                });
        });

        it('should pass context to error message mapper', done => {
            const config = undefined;
            const context: NgxErrorMsgContext = { name: 'some contextual value' };
            const service = getService(config, context);

            service.toErrorMessage({ mapperUsingContext: true })?.subscribe(message => {
                expect(message).toBe('This is a message using context: some contextual value');
                done();
            });
        });

        it('should concat messages with separator', done => {
            const config = mockConfig({ separator: ' | ', errorsLimit: -1 });
            const service = getService(config);

            service.toErrorMessage({ required: true, nested: true })?.subscribe(message => {
                expect(message).toBe('This is a nested error. | This field is required.');
                done();
            });
        });
    });

    describe(`toErrorMessages`, () => {
        it('should return null if error is not mapped', () => {
            const service = getService();

            const result = service.toErrorMessages({ notMapped: true });

            expect(result).toBeNull();
        });

        it('should return null if there are no errors', () => {
            const service = getService();

            const result = service.toErrorMessage(null);

            expect(result).toBeNull();
        });

        it('should limit errors prioritizing by errors by the order in the errorsMap', done => {
            const error = {
                required: true,
                lastPrimaryError: true,
                override: true,
                nested: true,
            };
            const expectedResult = [
                { error: 'nested', message: 'This is a nested error.' },
                { error: 'override', message: 'This is a nested overridden error.' },
                { error: 'required', message: 'This field is required.' },
            ];
            const service = getService({ errorsLimit: 3 });

            service.toErrorMessages(error)?.subscribe(result => {
                expect(result).toEqual(expectedResult);
                done();
            });
        });

        it('should not limit errors if errorsLimit is negative', done => {
            const error = {
                required: true,
                lastPrimaryError: true,
                override: true,
                nested: true,
                observable: true,
            };
            const expectedResult = [
                { error: 'nested', message: 'This is a nested error.' },
                { error: 'override', message: 'This is a nested overridden error.' },
                { error: 'observable', message: 'This is an async error message mapping.' },
                { error: 'required', message: 'This field is required.' },
                { error: 'lastPrimaryError', message: 'This is the last primary error.' },
            ];
            const service = getService({ errorsLimit: -1 });

            new TestScheduler((actual, expected) => expected(actual).toEqual(expected)).run(() => {
                service.toErrorMessages(error)?.subscribe(result => {
                    expect(result).toEqual(expectedResult);
                    done();
                });
            });
        });

        it('should pass context to error message mapper', done => {
            const config = undefined;
            const context: NgxErrorMsgContext = { name: 'some contextual value' };
            const error = { mapperUsingContext: true };
            const expectedResult = [
                {
                    error: 'mapperUsingContext',
                    message: 'This is a message using context: some contextual value',
                },
            ];
            const service = getService(config, context);

            service.toErrorMessages(error)?.subscribe(result => {
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });
});
