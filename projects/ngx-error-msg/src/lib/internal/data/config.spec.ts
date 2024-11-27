import { TestBed } from '@angular/core/testing';
import { mockConfig } from '../testing/mock-config';
import { NGX_ERROR_MSG_CONFIG, NgxErrorMsgConfig, defaultConfig, mergeConfigs } from './config';

describe(`NGX_ERROR_MSG_CONFIG`, () => {
    it(`should provide a valid config by default`, () => {
        const config = TestBed.inject(NGX_ERROR_MSG_CONFIG);

        expect(config).toEqual(defaultConfig);
    });
});

describe(`mergeConfigs`, () => {
    it(`should override value for the keys passed as second argument`, () => {
        const configCloserToRoot = mockConfig();
        const configCloserToLeaf: Partial<NgxErrorMsgConfig> = { errorsLimit: 10 };

        const result = mergeConfigs(configCloserToRoot, configCloserToLeaf);

        expect(result).toEqual({ ...configCloserToRoot, errorsLimit: 10 });
    });
});
