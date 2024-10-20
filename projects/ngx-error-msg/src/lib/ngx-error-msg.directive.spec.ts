import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { NgxErrorMsgDirService } from './ngx-error-msg-dir.service';
import { NgxErrorMsgDirective } from './ngx-error-msg.directive';
import { ErrorMessageMappings } from './ngx-error-msg.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

@Component({
    template: `
        <div *ngxErrorMsg="errors; mappings: errorMapping; let message">
            {{ message }}
        </div>
    `,
    standalone: true,
    imports: [NgxErrorMsgDirective],
})
class HostComponent {
    errors: ValidationErrors | null = null;
    errorMapping: ErrorMessageMappings = {};
}

@Injectable()
class MockNgxErrorMsgDirService extends NgxErrorMsgDirService {
    override setErrors = jasmine.createSpy('setErrors');
    override setErrorMsgMappings = jasmine.createSpy('setErrorMsgMappings');
    override errorMessage$: Observable<string | null> = of(null);
}

describe(`NgxErrorMsgDirective`, () => {
    let fixture: ComponentFixture<HostComponent>;
    let directiveService: MockNgxErrorMsgDirService;

    beforeEach(async () => {
        TestBed.overrideDirective(NgxErrorMsgDirective, {
            set: {
                providers: [],
            },
        });

        TestBed.configureTestingModule({
            imports: [NgxErrorMsgDirective, HostComponent],
            providers: [
                MockNgxErrorMsgDirService,
                {
                    provide: NgxErrorMsgDirService,
                    useExisting: MockNgxErrorMsgDirService,
                },
                provideNgxErrorMsg({ useExisting: MockNgxErrorMsgDirService }),
            ],
        });

        await TestBed.compileComponents();

        directiveService = TestBed.inject(MockNgxErrorMsgDirService);
        fixture = TestBed.createComponent(HostComponent);
    });

    it(`should set errors on service when input is set`, () => {
        const errors = { required: true };

        fixture.componentInstance.errors = errors;
        fixture.detectChanges();

        expect(directiveService.setErrors).toHaveBeenCalledWith(errors);
    });

    it(`should set errors mapping on service when input is set`, () => {
        const mapping = { myError: 'Test error message' };

        fixture.componentInstance.errorMapping = mapping;
        fixture.detectChanges();

        expect(directiveService.setErrorMsgMappings).toHaveBeenCalledWith(mapping);
    });

    it(`should display message`, () => {
        const errorMessage = 'Error';
        directiveService.errorMessage$ = of(errorMessage);

        fixture.detectChanges();
        const messageElement = fixture.debugElement.query(By.css('div'));
        expect(messageElement.nativeElement.textContent.trim()).toEqual(errorMessage);
    });

    it(`should display empty string if error message is null`, () => {
        const errorMessage = null;
        directiveService.errorMessage$ = of(errorMessage);

        fixture.detectChanges();
        const messageElement = fixture.debugElement.query(By.css('div'));
        expect(messageElement.nativeElement.textContent.trim()).toEqual('');
    });
});
