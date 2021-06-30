import { join } from 'path';

import { devConfig } from '../config';

function getWorkboxConfig() {
    const workboxConfigPath = join(devConfig.root, 'workbox-config.js');

    let defaultWorboxConfig = {
        // where to output the generated sw
        swDest: join(devConfig.dist, 'sw.js'),
        // directory to match patterns against to be precached
        globDirectory: devConfig.dist,
        // cache any html js and css by default
        globPatterns: [`static/**/*.{js,css,eot,ttf,woff,json}`],
        sourcemap: false,
        runtimeCaching: [
            {
                urlPattern: /\/static\/images\//,
                handler: 'StaleWhileRevalidate',
            },
        ],
    };

    if (devConfig.injectManifest) {
        defaultWorboxConfig = Object.assign(
            {},
            {
                swSrc: devConfig.swSrc,
            },
            defaultWorboxConfig,
        );
    }

    try {
        return require(workboxConfigPath);
    } catch (error) {
        return defaultWorboxConfig;
    }
}

export default getWorkboxConfig;
