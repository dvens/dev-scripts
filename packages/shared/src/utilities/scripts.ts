import fs from 'fs';

import { PolyfillLoader } from './../types/config.types';
import { lookup } from './manifest-helper';
import { createDevLoaderScript, createProdLoaderScript } from './polyfills/loader-script';

const polyfillManifest: any = null;

function getPolyfillManifest(dir: string) {
    if (polyfillManifest) return polyfillManifest;

    try {
        return JSON.parse(fs.readFileSync(dir, 'utf8'));
    } catch (err) {
        throw new Error('Polyfill Manifest could not be loaded.');
    }
}

export const getScripts = async ({
    isDebug,
    manifestPath,
}: {
    isDebug: boolean;
    manifestPath: string;
}) => {
    const polyfillConfig: PolyfillLoader = {
        polyfillsDir: '',
        manifestDir: '',
        relativePathToPolyfills: '',
        modern: {
            files: [{ path: lookup('main.js') }],
        },
        legacy: {
            test: "'noModule' in HTMLScriptElement.prototype",
            files: [
                {
                    path: lookup('legacy-main.js'),
                },
            ],
        },
        polyfills: {
            coreJs: true,
            regeneratorRuntime: true,
            minify: true,
            hash: true,
        },
    };

    if (isDebug) {
        const { scripts } = createDevLoaderScript(polyfillConfig);
        return { scripts, code: null };
    } else {
        const manifest = getPolyfillManifest(manifestPath);
        const { polyfills, code } = await createProdLoaderScript(
            { ...polyfillConfig, ...manifest },
            manifest.generatedPolyfills,
        );

        return { scripts: polyfills, code };
    }
};
