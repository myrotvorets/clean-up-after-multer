// eslint-disable-next-line import/no-unresolved
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { normalizeFiles, unlink as unlinkFile } from './utils';

export type UnlinkFunction = (path: string) => Promise<unknown>;

export function cleanUploadedFilesMiddleware(unlink: UnlinkFunction = unlinkFile): RequestHandler {
    return function cleanUpAfterMulterMiddleware(req: Request, res: Response, next: NextFunction): void {
        const files = normalizeFiles(req);
        const promises = files
            .filter((file) => file.path)
            .map((file) =>
                unlink(file.path).catch(() => {
                    /* */
                }),
            );
        Promise.all(promises).finally(next);
    };
}
