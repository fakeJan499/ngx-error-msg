import { TestBed } from '@angular/core/testing';
import { NgxErrorMsgDirService } from './ngx-error-msg-dir.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

describe(`NgxErrorMsgDirService`, () => {
    let service: NgxErrorMsgDirService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NgxErrorMsgDirService, provideNgxErrorMsg(NgxErrorMsgDirService)],
        });

        service = TestBed.inject(NgxErrorMsgDirService);
    });

    describe(`vm$`, () => {
        it(`should emit mapped errors using given conversion record`, done => {
            const expectedError = 'My error message';
            const expectedErrors = [{ error: 'myError', message: expectedError }];
            service.setErrorMsgMappings({
                myError: expectedError,
            });
            service.setErrors({ myError: true });

            service.vm$.subscribe(({ message, messages }) => {
                expect(message).toEqual(expectedError);
                expect(messages).toEqual(expectedErrors);
                done();
            });
        });

        it(`should emit nulls if error cannot be mapped`, done => {
            service.setErrorMsgMappings({});
            service.setErrors({ myError: true });

            service.vm$.subscribe(({ message, messages }) => {
                expect(message).toBeNull();
                expect(messages).toBeNull();
                done();
            });
        });

        it(`should emit nulls if there's no error to be mapped`, done => {
            service.setErrors(null);

            service.vm$.subscribe(({ message, messages }) => {
                expect(message).toBeNull();
                expect(messages).toBeNull();
                done();
            });
        });

        it(`should use config merged from injected one and the one provided by the directive`, done => {
            const myErrorMessage = 'My error message';
            const anotherErrorMessage = 'Another error message';
            const expectedError = `${myErrorMessage} ${anotherErrorMessage}`;
            const expectedErrors = [
                { error: 'myError', message: myErrorMessage },
                { error: 'anotherError', message: anotherErrorMessage },
            ];
            service.setErrorMsgMappings({
                myError: myErrorMessage,
                anotherError: anotherErrorMessage,
            });
            service.setErrors({ myError: true, anotherError: true });
            service.setConfig({ errorsLimit: 2 });

            service.vm$.subscribe(({ message, messages }) => {
                expect(message).toEqual(expectedError);
                expect(messages).toEqual(expectedErrors);
                done();
            });
        });

        it(`should use context to determine error messages`, done => {
            const errorPrefix = 'My error message';
            const errorSuffixFromCtx = 'use ctx to determine the result';
            const expectedError = `${errorPrefix} ${errorSuffixFromCtx}`;
            const expectedErrors = [{ error: 'myError', message: expectedError }];
            service.setErrorMsgMappings({
                myError: (_, ctx) => `${errorPrefix} ${ctx}`,
            });
            service.setErrors({ myError: true });
            service.setContext(errorSuffixFromCtx);

            service.vm$.subscribe(({ message, messages }) => {
                expect(message).toEqual(expectedError);
                expect(messages).toEqual(expectedErrors);
                done();
            });
        });
    });
});
