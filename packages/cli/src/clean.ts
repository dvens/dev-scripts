import { devConfig } from '@dev-scripts/shared';
import del from 'del';

async function clean() {
    del.sync(devConfig.dist);
}

export default clean;
