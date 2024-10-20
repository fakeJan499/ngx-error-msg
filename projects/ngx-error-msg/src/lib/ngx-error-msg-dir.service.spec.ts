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
    });
});