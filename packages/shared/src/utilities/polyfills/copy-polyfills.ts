import { writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { PolyfillLoader } from 'src/types/config.types';

export async function copyPolyfills(
    config: PolyfillLoader,
    polyfills: { code: string; url: string }[],
) {
    return new Promise(async (resolve) => {
        await mkdirp(config.polyfillsDir);
        await polyfills.forEach(async (polyfill) => {
            await writeFileSync(polyfill.url, polyfill.code);
        });

        resolve(true);
    });
}
