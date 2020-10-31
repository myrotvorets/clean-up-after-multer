import type { Readable } from 'stream';
import { cleanupFilesAfterMulter } from '../../lib';
import * as utils from '../../lib/utils';

const file: Express.Multer.File = {
    path: '/somewhere/between/the/sacred/silence/and/sleep',
    fieldname: 'fieldname',
    originalname: 'originalname',
    encoding: '',
    size: 1,
    mimetype: 'image/jpeg',
    destination: '/',
    filename: 'filename',
    buffer: (undefined as unknown) as Buffer,
    stream: (undefined as unknown) as Readable,
};

describe('cleanupFilesAfterMulter', () => {
    it('should handle the case with no files', () => {
        const unlink = jest.fn();
        unlink.mockResolvedValueOnce(true);

        return expect(cleanupFilesAfterMulter({}, unlink))
            .resolves.toStrictEqual(expect.any(Array))
            .then(() => expect(unlink).not.toHaveBeenCalled());
    });

    it('should succeed even if unlink() fails', () => {
        const unlink = jest.fn();
        unlink.mockRejectedValueOnce(new Error());

        const req = {
            file: { ...file },
        };

        return expect(cleanupFilesAfterMulter(req, unlink))
            .resolves.toStrictEqual(expect.any(Array))
            .then(() => expect(unlink).toHaveBeenCalled());
    });

    it('should skip files with undefined path', () => {
        const unlink = jest.fn();
        unlink.mockResolvedValueOnce(true);

        const req = {
            file: { ...file, path: (undefined as unknown) as string },
        };

        return expect(cleanupFilesAfterMulter(req, unlink))
            .resolves.toStrictEqual(expect.any(Array))
            .then(() => expect(unlink).not.toHaveBeenCalled());
    });

    it('should default to the internal unlink()', () => {
        const unlink = jest.spyOn(utils, 'unlink').mockResolvedValueOnce(true);

        const req = {
            file: { ...file },
        };

        return expect(cleanupFilesAfterMulter(req))
            .resolves.toStrictEqual(expect.any(Array))
            .then(() => expect(unlink).toHaveBeenCalledWith(file.path));
    });
});
