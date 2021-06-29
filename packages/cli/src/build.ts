import { run } from '@dev-scripts/shared';

import bundle from './bundle';
import clean from './clean';
import generatePolyfills from './polyfills';
import generateServiceWorker from './sw';

async function build() {
    await run(clean);
    await run(bundle);
    await run(generatePolyfills);
    await run(generateServiceWorker);
}

export default build;
