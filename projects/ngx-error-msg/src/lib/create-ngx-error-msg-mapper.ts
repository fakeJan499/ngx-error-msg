import { Injectable, Type } from '@angular/core';
import { ErrorMessageMappings, NgxErrorMsgService } from './ngx-error-msg.service';

type MapperFactory = () => ErrorMessageMappings;

abstract class NgxErrorMsgCreatedService extends NgxErrorMsgService {
    protected override errorMsgMappings: ErrorMessageMappings = {};
}

/**
 * Create an injectable class that extends `NgxErrorMsgService` with the given mappings.
 *
 * Accepts an error mappings object or a factory function. The factory function is executed in injection context.
 *
 * @param base The error message mappings or a factory function that returns the mappings.
 *
 * @example createMapper({required: 'My error message'})
 * @example createMapper(() => inject(MyService).getMappings())
 */
export const createNgxErrorMsgMapper = (
    base: ErrorMessageMappings | MapperFactory,
): Type<NgxErrorMsgCreatedService> => {
    if (typeof base === 'function') {
        return createMapperClass(base);
    }

    return createMapperClass(() => base);
};

const createMapperClass = (factory: MapperFactory): Type<NgxErrorMsgCreatedService> => {
    @Injectable()
    class Mapper extends NgxErrorMsgCreatedService {
        protected override errorMsgMappings = factory();
    }

    return Mapper;
};
