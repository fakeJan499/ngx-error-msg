import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxErrorMsgService } from '../../mappers';
import { NGX_ERROR_MSG_CONFIG } from '../data/config';
import { NGX_ERROR_MSG_MAPPINGS } from '../data/mappings';
import { mockConfig } from '../testing/mock-config';
import { mockDataProvider } from '../testing/mock-data-provider';
import { provideNgxErrorMsg, withConfig, withMappings } from './provide';
import { DataProviderKind } from './types';

describe(`provideNgxErrorMsg`, () => {
    it(`should create providers array with NgxErrorMsgService`, () => {
        TestBed.configureTestingModule({ providers: [provideNgxErrorMsg(mockDataProvider())] });
        const service = TestBed.inject(NgxErrorMsgService);

        expect(service).toBeDefined();
    });

    it(`should create providers array with providers defined in data`, () => {
        const injectionTokenA = new InjectionToken<string>('testA');
        const injectionTokenB = new InjectionToken<string>('testB');
        const injectionTokenC = new InjectionToken<string>('testC');
        const testDataA = mockDataProvider({
            provide: injectionTokenA,
            useFactory: () => 'testA',
        });
        const testDataB = mockDataProvider([
            {
                provide: injectionTokenB,
                useFactory: () => 'testB',
            },
            {
                provide: injectionTokenC,
                useFactory: () => 'testC',
            },
        ]);
        TestBed.configureTestingModule({ providers: [provideNgxErrorMsg(testDataA, testDataB)] });
        const testA = TestBed.inject(injectionTokenA);
        const testB = TestBed.inject(injectionTokenB);
        const testC = TestBed.inject(injectionTokenC);

        expect(testA).toBe('testA');
        expect(testB).toBe('testB');
        expect(testC).toBe('testC');
    });
});

describe(`withConfig`, () => {
    it(`should create data provider of kind 'Config'`, () => {
        const dataProvider = withConfig({});

        expect(dataProvider.__kind).toBe(DataProviderKind.Config);
    });

    it(`should create data provider with provided config`, () => {
        const configData = mockConfig({ separator: 'test separator' });
        const dataProvider = withConfig(configData);
        TestBed.configureTestingModule({ providers: [dataProvider.providers] });

        const config = TestBed.inject(NGX_ERROR_MSG_CONFIG);

        expect(config.separator).toBe('test separator');
    });
});

describe(`withMappings`, () => {
    it(`should create data provider of kind 'Mappings'`, () => {
        const dataProvider = withMappings({});

        expect(dataProvider.__kind).toBe(DataProviderKind.Mappings);
    });

    it(`should create data provider with provided mappings`, () => {
        const mappingsData = { a: 'testA', b: 'testB' };
        const dataProvider = withMappings(mappingsData);
        TestBed.configureTestingModule({ providers: [dataProvider.providers] });

        const mappings = TestBed.inject(NGX_ERROR_MSG_MAPPINGS);

        expect(mappings).toEqual(mappingsData);
    });
});
