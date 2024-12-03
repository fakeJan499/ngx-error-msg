import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { defaultConfig, NgxErrorMsgConfig } from '../data/config';
import { NgxErrorMsgContext } from '../data/context';
import { ErrorMessageMappings } from '../data/mappings';
import { NgxErrorMsgDirService } from './ngx-error-msg-dir.service';
import { NgxErrorMsgDirective } from './ngx-error-msg.directive';

@Component({
    template: `
        <div
            *ngxErrorMsg="
                errors;
                mappings: errorMapping;
                config: config;
                ctx: ctx;
                let mappedErrors
            ">
            {{ mappedErrors.message }}
        </div>
    `,
    standalone: true,
    imports: [NgxErrorMsgDirective],
})
class HostComponent {
    errors: ValidationErrors | null = null;
    errorMapping: ErrorMessageMappings = {};
    config: Partial<NgxErrorMsgConfig> | null = null;
    ctx: NgxErrorMsgContext;
}

@Injectable()
class MockNgxErrorMsgDirService {
    setErrors = jasmine.createSpy('setErrors');
    setMappings = jasmine.createSpy('setMappings ');
    setConfig = jasmine.createSpy('setConfig');
    setContext = jasmine.createSpy('setContext');
    vm$: NgxErrorMsgDirService['vm$'] = of({ message: '', messages: [] });
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

        expect(directiveService.setMappings).toHaveBeenCalledWith(mapping);
    });

    it(`should set config when input is set`, () => {
        const config: Partial<NgxErrorMsgConfig> = { errorsLimit: 997 };

        fixture.componentInstance.config = config;
        fixture.detectChanges();

        expect(directiveService.setConfig).toHaveBeenCalledWith(config);
    });

    it(`should reset config when the value was changed to null`, () => {
        fixture.componentInstance.config = defaultConfig;
        fixture.detectChanges();

        fixture.componentInstance.config = null;
        fixture.detectChanges();

        expect(directiveService.setConfig).toHaveBeenCalledWith({});
    });

    it(`should set context when input is set`, () => {
        const context: NgxErrorMsgContext = 'myContext';

        fixture.componentInstance.ctx = context;
        fixture.detectChanges();

        expect(directiveService.setContext).toHaveBeenCalledWith(context);
    });

    it(`should display message`, () => {
        const errorMessage = 'Error';
        directiveService.vm$ = of({ message: errorMessage, messages: [] });

        fixture.detectChanges();
        const messageElement = fixture.debugElement.query(By.css('div'));
        expect(messageElement.nativeElement.textContent.trim()).toEqual(errorMessage);
    });
});
