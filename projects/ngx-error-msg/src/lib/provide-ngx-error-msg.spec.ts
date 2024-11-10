import { Component, inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { defaultConfig, NGX_ERROR_MSG_CONFIG } from './config';
import { mockConfig } from './internal/testing/mock-config';
import { NgxErrorMsgService } from './ngx-error-msg.service';
import { provideNgxErrorMsg } from './provide-ngx-error-msg';

@Injectable()
class TestService extends NgxErrorMsgService {
    protected override errorMsgMappings = {};
}

@Component({
    template: '',
    standalone: true,
})
class TestComponent {
    readonly config = inject(NGX_ERROR_MSG_CONFIG);
}

describe(`provideNgxErrorMsg`, () => {
    it(`should provide by class provider`, () => {
        TestBed.configureTestingModule({
            providers: [provideNgxErrorMsg(TestService)],
        });

        const service = TestBed.inject(NgxErrorMsgService);

        expect(service).toBeInstanceOf(TestService);
    });

    it(`should provide by existing provider`, () => {
        TestBed.configureTestingModule({
            providers: [TestService, provideNgxErrorMsg({ useExisting: TestService })],
        });

        const customService = TestBed.inject(TestService);
        const mapperService = TestBed.inject(NgxErrorMsgService);

        expect(mapperService)
            .withContext('references should point to the same object')
            .toBe(customService);
    });

    it(`should provide by factory provider`, () => {
        TestBed.configureTestingModule({
            providers: [
                provideNgxErrorMsg({
                    useFactory: () => new TestService(),
                }),
            ],
        });

        const service = TestBed.inject(NgxErrorMsgService);

        expect(service).toBeInstanceOf(TestService);
    });

    it(`should provide default config if no config used`, () => {
        TestBed.configureTestingModule({
            providers: [provideNgxErrorMsg(TestService)],
        });

        const config = TestBed.inject(NGX_ERROR_MSG_CONFIG);

        expect(config).toEqual(defaultConfig);
    });

    it(`should provide config`, () => {
        const expectedConfig = mockConfig({ errorsLimit: 5 });
        TestBed.configureTestingModule({
            providers: [provideNgxErrorMsg(TestService, expectedConfig)],
        });

        const config = TestBed.inject(NGX_ERROR_MSG_CONFIG);

        expect(config).toEqual(expectedConfig);
    });

    it(`should provide config from parent injector if no config used`, () => {
        const rootConfig = mockConfig({ errorsLimit: -123456789 });
        TestBed.configureTestingModule({
            providers: [provideNgxErrorMsg(TestService, rootConfig)],
            imports: [TestComponent],
        });
        TestBed.overrideComponent(TestComponent, {
            set: { providers: [provideNgxErrorMsg(TestService)] },
        });

        const config = TestBed.createComponent(TestComponent).componentInstance.config;

        expect(config).toEqual(rootConfig);
    });

    describe(`config validation`, () => {
        it(`should throw error if errors limit is not an integer`, () => {
            expect(() => provideNgxErrorMsg(TestService, { errorsLimit: 1.5 })).toThrowError();
        });
    });
});
