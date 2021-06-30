import { devConfig, getWorkboxConfig } from '@dev-scripts/shared';
import { existsSync } from 'fs';
import { generateSW, injectManifest } from 'workbox-build';

async function generateServiceWorker() {
    const workboxConfig = getWorkboxConfig();

    if (!devConfig.injectManifest) {
        const { count, size } = await generateSW(workboxConfig);
        console.log(`Generated, which will precache ${count} files, totaling ${size} bytes.`);
    } else {
        if (!workboxConfig.swSrc && existsSync(workboxConfig.swSrc))
            throw new Error('Please add a valid Service Worker Source');

        const { count, size } = await injectManifest(workboxConfig);
        console.log(`Generated, which will precache ${count} files, totaling ${size} bytes.`);
    }
}

export default generateServiceWorker;
