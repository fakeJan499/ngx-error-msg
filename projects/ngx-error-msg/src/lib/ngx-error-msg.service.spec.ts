import { Component, inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { map, timer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { NgxErrorMsgConfig } from './config';
import { NgxErrorMsgService } from './ngx-error-msg.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

@Injectable()
class PrimaryMapper extends NgxErrorMsgService {
    protected override readonly errorMsgMappings = {
        required: 'This field is required.',
        override: () => 'This is an overridden error.',
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

const getService = (config?: Partial<NgxErrorMsgConfig>): NgxErrorMsgService => {
    TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [provideNgxErrorMsg(PrimaryMapper, config)],
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
});
