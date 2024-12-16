import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { RequestLike, normalizeFiles, unlink as unlinkFile } from './utils';

export type UnlinkFunction = (path: string) => Promise<unknown>;

export function cleanupFilesAfterMulter(req: RequestLike, unlink: UnlinkFunction = unlinkFile): Promise<unknown> {
    const files = normalizeFiles(req);
    const promises = files
        .filter((file) => file.path)
        .map((file) =>
            unlink(file.path).catch(() => {
                /* */
            }),
        );

    return Promise.all(promises);
}

export function cleanUploadedFilesMiddleware(unlink: UnlinkFunction = unlinkFile): RequestHandler {
    return function cleanUpAfterMulterMiddleware(req: Request, res: Response, next: NextFunction): void {
        void cleanupFilesAfterMulter(req, unlink).finally(next);
    };
}
