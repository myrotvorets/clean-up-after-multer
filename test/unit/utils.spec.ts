import { promises } from 'fs';
import { normalizeFiles, unlink } from '../../lib/utils';

const mockedUnlink = jest.spyOn(promises, 'unlink');

beforeEach(() => jest.resetAllMocks());

describe('unlink', () => {
    it('should return a Promise', () => {
        mockedUnlink.mockResolvedValueOnce();
        expect(unlink('something')).toEqual(expect.any(Promise));
    });

    it('should return true on success', () => {
        mockedUnlink.mockResolvedValueOnce();
        return expect(unlink('something'))
            .resolves.toBe(true)
            .then(() => expect(mockedUnlink).toHaveBeenCalledTimes(1));
    });

    it('should return Error on failure', () => {
        mockedUnlink.mockRejectedValueOnce(new Error('VERY FATAL ERROR'));
        return expect(unlink('something'))
            .resolves.toStrictEqual(expect.any(Error))
            .then(() => expect(mockedUnlink).toHaveBeenCalledTimes(1));
    });
});

describe('normalizeFiles', () => {
    it('should handle the case with no files', () => {
        const input = {};
        const expected: ReturnType<typeof normalizeFiles> = [];
        const actual = normalizeFiles(input);
        expect(actual).toStrictEqual(expected);
    });

    it('should handle the case when `file` is set', () => {
        const input = {
            file: { path: 'somepath' },
        };

        const expected = [input.file];
        const actual = normalizeFiles(input);
        expect(actual).toStrictEqual(expected);
    });

    it('should handle the case when `files` is an empty array', () => {
        const input = {
            files: [],
        };
        const expected: ReturnType<typeof normalizeFiles> = input.files;
        const actual = normalizeFiles(input);
        expect(actual).toStrictEqual(expected);
    });

    it('should handle the case when `files` is an array', () => {
        const input = {
            files: [{ path: 'somepath' }],
        };

        const expected: ReturnType<typeof normalizeFiles> = input.files;
        const actual = normalizeFiles(input);
        expect(actual).toStrictEqual(expected);
    });

    it('should handle the case when `files` is an object', () => {
        const input = {
            files: {
                key1: [{ path: '1.1' }, { path: '1.2' }],
                key2: [],
                key3: [{ path: '3.1' }],
                key4: [{ path: '4.1' }, { path: '4.2' }, { path: '4.3' }],
            },
        };

        const expected = [
            { path: '1.1' },
            { path: '1.2' },
            { path: '3.1' },
            { path: '4.1' },
            { path: '4.2' },
            { path: '4.3' },
        ];

        const actual = normalizeFiles(input);
        expect(actual).toStrictEqual(expected);
    });
});
