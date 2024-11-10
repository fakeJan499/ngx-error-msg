import { defaultConfig, NgxErrorMsgConfig } from '../../config';

export const mockConfig = (config: Partial<NgxErrorMsgConfig>): NgxErrorMsgConfig => ({
    ...defaultConfig,
    ...config,
});
