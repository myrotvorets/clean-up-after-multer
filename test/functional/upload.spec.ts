import type { Readable } from 'stream';
import express, { NextFunction } from 'express';
import request from 'supertest';
import * as utils from '../../lib/utils';
import { cleanUploadedFilesMiddleware } from '../../lib';

const mockedUnlink = jest.spyOn(utils, 'unlink');

let app: express.Express;

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

function buildApp(): express.Express {
    const application = express();
    application.disable('x-powered-by');
    return application;
}

beforeEach(() => {
    jest.resetAllMocks();
    app = buildApp();
});

describe('cleanUploadedFilesMiddleware', () => {
    it('should handle the case with no files', () => {
        mockedUnlink.mockResolvedValueOnce(true);
        app.use('/', (req, res, next: NextFunction) => {
            res.json({});
            next();
        });

        app.use(cleanUploadedFilesMiddleware());

        return request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/u)
            .expect({})
            .expect(() => expect(mockedUnlink).not.toHaveBeenCalled());
    });

    it('should succeed even if unlink() fails', () => {
        mockedUnlink.mockRejectedValueOnce(new Error());
        app.use('/', (req, res, next: NextFunction) => {
            req.files = [{ ...file }, { ...file }];
            res.json({});
            next();
        });

        app.use(cleanUploadedFilesMiddleware());

        return request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/u)
            .expect({})
            .expect(() => {
                expect(mockedUnlink).toHaveBeenCalledTimes(2);
                expect(mockedUnlink).toHaveBeenCalledWith(file.path);
            });
    });

    it('should skip files with undefined path', () => {
        mockedUnlink.mockResolvedValueOnce(true);
        app.use('/', (req, res, next: NextFunction) => {
            req.file = { ...file, path: (undefined as unknown) as string };
            res.json({});
            next();
        });

        app.use(cleanUploadedFilesMiddleware());

        return request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/u)
            .expect({})
            .expect(() => expect(mockedUnlink).not.toHaveBeenCalled());
    });
});
