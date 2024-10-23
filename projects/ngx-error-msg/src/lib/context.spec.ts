import { TestBed } from '@angular/core/testing';
import { NGX_ERROR_MSG_CONTEXT, NgxErrorMsgContext, provideNgxErrorMsgContext } from './context';

describe(`provideNgxErrorMsgContext`, () => {
    it(`should provide context value`, () => {
        const expectedContext: NgxErrorMsgContext = {
            name: 'context',
            myKey: [1, 2, 3],
            nested: { key: 0 },
        };
        TestBed.configureTestingModule({ providers: [provideNgxErrorMsgContext(expectedContext)] });

        const context = TestBed.inject(NGX_ERROR_MSG_CONTEXT);

        expect(context).toEqual(expectedContext);
    });
});
