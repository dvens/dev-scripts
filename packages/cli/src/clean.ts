import { devConfig } from '@dev-scripts/shared';
import { sync } from 'del';

async function clean() {
    sync(devConfig.dist);
}

export default clean;
