import { inject, Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createNgxErrorMsgMapper } from './create-ngx-error-msg-mapper';
import { NgxErrorMsgService } from './ngx-error-msg.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

describe(`createNgxErrorMsgMapper`, () => {
    it(`should create an injectable class extending NgxErrorMsgService`, () => {
        const Mapper = createNgxErrorMsgMapper({});
        TestBed.configureTestingModule({
            providers: [Mapper, provideNgxErrorMsg({ useExisting: Mapper })],
        });

        const instance = TestBed.inject(Mapper);

        expect(Mapper).toBeInstanceOf(Function);
        expect(instance).toBeInstanceOf(NgxErrorMsgService);
    });

    it(`should create an injectable class extending NgxErrorMsgService from a factory function`, () => {
        const Mapper = createNgxErrorMsgMapper(() => ({}));
        TestBed.configureTestingModule({
            providers: [Mapper, provideNgxErrorMsg({ useExisting: Mapper })],
        });

        const instance = TestBed.inject(Mapper);

        expect(Mapper).toBeInstanceOf(Function);
        expect(instance).toBeInstanceOf(NgxErrorMsgService);
    });

    it(`should create class with given mappings`, done => {
        const mappings = {
            required: 'This is a custom error message of created mapper',
        };
        const Mapper = createNgxErrorMsgMapper(mappings);
        TestBed.configureTestingModule({
            providers: [Mapper, provideNgxErrorMsg({ useExisting: Mapper })],
        });

        const instance = TestBed.inject(Mapper);

        instance.toErrorMessage({ required: true })?.subscribe(message => {
            expect(message).toEqual(mappings.required);
            done();
        });
    });

    it(`should create class with given mappings as a factory`, done => {
        const mappings = {
            required: 'This is a custom error message of created mapper',
        };
        const Mapper = createNgxErrorMsgMapper(() => mappings);
        TestBed.configureTestingModule({
            providers: [Mapper, provideNgxErrorMsg({ useExisting: Mapper })],
        });

        const instance = TestBed.inject(Mapper);

        instance.toErrorMessage({ required: true })?.subscribe(message => {
            expect(message).toEqual(mappings.required);
            done();
        });
    });

    it(`should execute factory in injection context`, done => {
        const mappings = { min: 'This error message is from injected value' };
        const injectionToken = new InjectionToken<typeof mappings>('injectionToken');
        const Mapper = createNgxErrorMsgMapper(() => inject(injectionToken));
        TestBed.configureTestingModule({
            providers: [
                Mapper,
                provideNgxErrorMsg({ useExisting: Mapper }),
                { provide: injectionToken, useValue: mappings },
            ],
        });

        const instance = TestBed.inject(Mapper);

        instance.toErrorMessage({ min: true })?.subscribe(message => {
            expect(message).toEqual(mappings.min);
            done();
        });
    });

    it(`should create a class that's extendable`, () => {
        const Mapper = createNgxErrorMsgMapper({});

        @Injectable()
        class Extended extends Mapper {}

        TestBed.configureTestingModule({
            providers: [Extended, provideNgxErrorMsg({ useExisting: Extended })],
        });

        const instance = TestBed.inject(Extended);

        expect(instance).toBeInstanceOf(Mapper);
        expect(instance).toBeInstanceOf(Extended);
    });
});
