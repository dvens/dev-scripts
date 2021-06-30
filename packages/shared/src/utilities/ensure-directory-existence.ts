import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export function ensureDirectoryExistence(filePath: string) {
    const direcname = dirname(filePath);
    if (existsSync(direcname)) {
        return true;
    }
    ensureDirectoryExistence(direcname);
    mkdirSync(direcname);

    return true;
}
