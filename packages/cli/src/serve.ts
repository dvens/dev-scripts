import { devConfig, logMessage, run } from '@dev-scripts/shared';
import { existsSync } from 'fs';
import * as nodemon from 'nodemon';

async function runServer() {
    const serverPath = `${devConfig.serverDist}/server.js`;

    if (!existsSync(serverPath)) {
        logMessage(
            `Could not find ${serverPath}! Please run 'yarn build' before running 'yarn start'`,
            'error',
        );

        process.exit(1);
    }

    nodemon({
        script: serverPath,
    });
}

export async function serve() {
    await run(runServer);
}
