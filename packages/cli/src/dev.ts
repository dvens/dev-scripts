import { run } from '@dev-scripts/shared';

import { clean } from './clean';
import { generatePolyfills } from './polyfills';
import { start } from './start';

export async function dev() {
    await run(clean);
    await run(start);
    await run(generatePolyfills);
}
