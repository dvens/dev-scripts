import { run } from '@dev-scripts/shared';

import { clean } from './clean';
import { start } from './start';

export async function dev() {
    await run(clean);
    await run(start);
}
