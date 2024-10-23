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

    describe(`errorMessage$`, () => {
        it(`should emit mapped errors using given conversion record`, done => {
            const expectedError = 'My error message';
            service.setErrorMsgMappings({
                myError: expectedError,
            });
            service.setErrors({ myError: true });

            service.errorMessage$.subscribe(message => {
                expect(message).toEqual(expectedError);
                done();
            });
        });

        it(`should emit null if error cannot be mapped`, done => {
            service.setErrorMsgMappings({});
            service.setErrors({ myError: true });

            service.errorMessage$.subscribe(message => {
                expect(message).toBeNull();
                done();
            });
        });

        it(`should emit null if there's no error to be mapped`, done => {
            service.setErrors(null);

            service.errorMessage$.subscribe(message => {
                expect(message).toBeNull();
                done();
            });
        });

        it(`should use config merged from injected one and the one provided by the directive`, done => {
            const myErrorMessage = 'My error message';
            const anotherErrorMessage = 'Another error message';
            const expectedError = `${myErrorMessage} ${anotherErrorMessage}`;
            service.setErrorMsgMappings({
                myError: myErrorMessage,
                anotherError: anotherErrorMessage,
            });
            service.setErrors({ myError: true, anotherError: true });
            service.setConfig({ errorsLimit: 2 });

            service.errorMessage$.subscribe(message => {
                expect(message).toEqual(expectedError);
                done();
            });
        });

        it(`should use context to determine error message`, done => {
            service.setErrorMsgMappings({
                myError: (_, ctx) => `My error message ${ctx}`,
            });
            service.setErrors({ myError: true });
            service.setContext('use ctx to determine the result');

            service.errorMessage$.subscribe(message => {
                expect(message).toEqual('My error message use ctx to determine the result');
                done();
            });
        });
    });
});
