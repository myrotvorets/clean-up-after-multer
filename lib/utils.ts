import { unlink as fsUnlink } from 'node:fs/promises';

export async function unlink(path: string): Promise<true | Error> {
    try {
        await fsUnlink(path); // lgtm[js/path-injection]
        return true;
    } catch (e) {
        return e as Error;
    }
}

export type FileLike = Pick<Express.Multer.File, 'path'>;

export interface RequestLike {
    file?: FileLike;
    files?: Record<string, FileLike[]> | FileLike[];
}

export function normalizeFiles(req: RequestLike): FileLike[] {
    if (!req.file && !req.files) {
        return [];
    }

    if (req.file) {
        return [req.file];
    }

    if (Array.isArray(req.files)) {
        return req.files;
    }

    return Object.entries(req.files!).flatMap((item) => item[1]);
}
