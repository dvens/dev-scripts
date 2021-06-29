import {
    createCompilationPromise,
    devConfig,
    logMessage,
    projectDirectory,
} from '@dev-scripts/shared';
import browserSync from 'browser-sync';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const browserSyncServer = browserSync.create();
const server = express();

let webpackConfig: any;

try {
    webpackConfig = require(`${projectDirectory}/webpack.config.js`)(
        process.env.NODE_ENV || 'development',
    );
} catch (e) {
    console.error(
        `${projectDirectory}/webpack.config.js is not found. Add a webpack.config.js to the root of your project`,
    );
}

const watchOptions = {
    // ignored: /node_modules/,
};

async function start() {
    const [clientConfig, serverConfig] = webpackConfig;
    const serverEntry = path.resolve(devConfig.serverDist, 'server.js');

    clientConfig.entry.main = [`webpack-hot-middleware/client`, ...clientConfig.entry.main];

    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    const multiCompiler = webpack([clientConfig, serverConfig]);

    const clientModernCompiler: any = multiCompiler.compilers.find(
        (compiler) => compiler.name === 'client',
    );
    const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server');

    const clientModernPromise = createCompilationPromise('client', clientModernCompiler);
    const serverPromise = createCompilationPromise('server', serverCompiler);

    server.use(
        webpackDevMiddleware(clientModernCompiler, {
            publicPath: clientConfig.output.publicPath,
            stats: clientConfig.stats,
            serverSideRender: true,
        }),
    );

    server.use(webpackHotMiddleware(clientModernCompiler));

    server.use(devConfig.publicPath, express.static(devConfig.publicPath));

    let appPromise: Promise<any>;
    let appPromiseResolve: (value?: any) => void = () => {
        /** noop */
    };
    let appPromiseIsResolved = true;
    serverCompiler &&
        serverCompiler.hooks.compile.tap('server', () => {
            if (!appPromiseIsResolved) return;
            appPromiseIsResolved = false;
            appPromise = new Promise((resolve) => (appPromiseResolve = resolve));
        });

    let app: any;

    server.use((req, res) => {
        appPromise.then(() => app.handle(req, res)).catch((error) => console.error(error));
    });

    function checkForUpdate(fromUpdate?: boolean) {
        const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
        if (!app.hot) {
            throw new Error(`${hmrPrefix}Hot Module Replacement is disabled.`);
        }
        if (app.hot.status() !== 'idle') {
            return Promise.resolve();
        }
        return app.hot
            .check(true)
            .then((updatedModules: any) => {
                if (!updatedModules) {
                    if (fromUpdate) {
                        logMessage(`${hmrPrefix}Update applied.`, 'info');
                    }
                    return;
                }
                if (updatedModules.length === 0) {
                    logMessage(`${hmrPrefix}Nothing hot updated.`, 'info');
                } else {
                    logMessage(`${hmrPrefix}Updated modules:`, 'info');
                    updatedModules.forEach((moduleId: number) =>
                        logMessage(`${hmrPrefix} - ${moduleId}`, 'info'),
                    );
                    checkForUpdate(true);
                }
            })
            .catch((error: { stack: string; message: string }) => {
                if (['abort', 'fail'].includes(app.hot.status())) {
                    logMessage(`${hmrPrefix}Cannot apply update.`, 'warning');
                    delete require.cache[require.resolve(serverEntry)];

                    app = require(serverEntry).default;

                    logMessage(`${hmrPrefix}App has been reloaded.`, 'warning');
                } else {
                    logMessage(
                        `${hmrPrefix}Update failed: ${error.stack || error.message}`,
                        'warning',
                    );
                }
            });
    }

    serverCompiler &&
        serverCompiler.watch(watchOptions, (error, stats) => {
            if (app && !error && stats && !stats.hasErrors()) {
                checkForUpdate().then(() => {
                    appPromiseIsResolved = true;
                    appPromiseResolve();
                });
            }
        });

    // Wait until client and server are compiled
    try {
        await clientModernPromise;
        await serverPromise;

        logMessage('Launching server...', 'info');

        // Load compiled src/server.js as a middleware
        app = require(serverEntry).default;
        appPromiseIsResolved = true;
        appPromiseResolve();

        // Launch the development server with Browsersync and HMR
        await new Promise((resolve, reject) =>
            browserSyncServer.init(
                {
                    // https://www.browsersync.io/docs/options
                    server: devConfig.serverEntry,
                    middleware: [server],
                    open: false,
                    ...(devConfig.port ? { port: devConfig.port } : null),
                    files: [
                        {
                            match: ['src/pages/_document.tsx', 'src/pages/_app.tsx'],
                            fn: function () {
                                browserSyncServer.reload();
                            },
                        },
                    ],
                },

                (error, bs) => (error ? reject(error) : resolve(bs)),
            ),
        );

        logMessage(`Server launched!`, 'info');
    } catch (error) {
        logMessage(error, 'error');
    }
}

export default start;
