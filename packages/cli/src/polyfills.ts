import {
    copyPolyfills,
    devConfig,
    getDefaultMode,
    getPolyfills,
    projectDirectory,
} from '@dev-scripts/shared';
import fs from 'fs';

const IS_PRODUCTION = getDefaultMode() === 'production';
let config: any = null;

try {
    config = require(`${projectDirectory}/config/polyfills.config.js`)(devConfig);
} catch (e) {
    console.error(
        `polyfills.config.js is missing add the following file: "config/polyfills.config.js" to the root`,
    );
}

async function generatePolyfills() {
    const polyfills = (await getPolyfills(config)) as any[];

    if (IS_PRODUCTION) {
        await copyPolyfills(config, polyfills);
    }

    // Generate polyfill-manifest.json
    const data = {
        ...config,
        generatedPolyfills: polyfills.map(({ test, nomodule, module, name }) => ({
            test,
            module,
            nomodule,
            name,
        })),
    };

    await fs.writeFileSync(`${data.manifestDir}polyfills-manifest.json`, JSON.stringify(data));
}

export default generatePolyfills;
