import { devConfig } from '@dev-scripts/shared';
import { sync } from 'del';

export async function clean() {
    sync(devConfig.dist);
}
