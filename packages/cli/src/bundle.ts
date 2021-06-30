import { projectDirectory } from '@dev-scripts/shared';
import * as webpack from 'webpack';

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

/**
 * Creates application bundles from the source files.
 */
export function bundle() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig).run((err, stats) => {
            if (err) {
                return reject(err);
            }

            console.info(stats && stats.toString(webpackConfig[0].stats));

            if (stats && stats.hasErrors()) {
                return reject(new Error('Webpack compilation errors'));
            }

            return resolve(true);
        });
    });
}
