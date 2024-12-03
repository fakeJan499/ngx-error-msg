import { TestBed } from '@angular/core/testing';
import { ErrorMessageMappings, mergeMappings, NGX_ERROR_MSG_MAPPINGS } from './mappings';

describe(`NGX_ERROR_MSG_MAPPINGS`, () => {
    it(`should provide an empty object by default`, () => {
        const mappings = TestBed.inject(NGX_ERROR_MSG_MAPPINGS);

        expect(mappings).toEqual({});
    });
});

describe(`mergeMappings`, () => {
    it(`should extend object passed as first arg with props and values form the second arg`, () => {
        const mappingsCloserToRoot: ErrorMessageMappings = { a: 'My message' };
        const mappingsCloserToLeaf: ErrorMessageMappings = { b: () => 'Message B' };

        const result = mergeMappings(mappingsCloserToRoot, mappingsCloserToLeaf);

        expect(result).toEqual({ a: mappingsCloserToRoot['a'], b: mappingsCloserToLeaf['b'] });
    });

    it(`should define values from the second arg above the ones from the first arg`, () => {
        const mappingsCloserToRoot: ErrorMessageMappings = { root: 'My message' };
        const mappingsCloserToLeaf: ErrorMessageMappings = { leaf: () => 'Message A' };

        const resultKeys = Object.keys(mergeMappings(mappingsCloserToRoot, mappingsCloserToLeaf));

        expect(resultKeys).toEqual(['leaf', 'root']);
    });

    it(`should override value if second argument has the same key`, () => {
        const mappingsCloserToRoot: ErrorMessageMappings = { a: 'My message' };
        const mappingsCloserToLeaf: ErrorMessageMappings = { a: () => 'Message A' };

        const result = mergeMappings(mappingsCloserToRoot, mappingsCloserToLeaf);

        expect(result).toEqual({ a: mappingsCloserToLeaf['a'] });
    });

    it(`should use the second argument if the first one is null`, () => {
        const mappingsCloserToRoot = null;
        const mappingsCloserToLeaf: ErrorMessageMappings = { a: () => 'Message A' };

        const result = mergeMappings(mappingsCloserToRoot, mappingsCloserToLeaf);

        expect(result).toEqual(mappingsCloserToLeaf);
    });
});
