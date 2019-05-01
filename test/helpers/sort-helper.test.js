const { ignoreCase } = require('../../src/helpers/sort-helper');

describe('sort-helper', () => {

    it('lowercase', () => {
        const input = ['bb', 'aa'].sort(ignoreCase);
        const output = ['aa', 'bb'];
        expect(input).toEqual(output);
    });

    it('uppercase', () => {
        const input = ['BB', 'aa'].sort(ignoreCase);
        const output = ['aa', 'BB'];
        expect(input).toEqual(output);
    });

    it('mix', () => {
        const input = ['BB', 'aa'].sort(ignoreCase);
        const output = ['aa', 'BB'];
        expect(input).toEqual(output);
    });

});
