import { defaultConfig, NgxErrorMsgConfig } from '../data/config';

export const mockConfig = (config: Partial<NgxErrorMsgConfig> = {}): NgxErrorMsgConfig => ({
    ...defaultConfig,
    ...config,
});
