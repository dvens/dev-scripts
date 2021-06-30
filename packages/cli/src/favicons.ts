import { devConfig, projectDirectory } from '@dev-scripts/shared';
import favicons from 'favicons';
import fs from 'fs';
import prettier from 'prettier';

let config = {
    source: '',
    faviconsPlugin: {},
    folder: '',
    outputFile: '',
};

try {
    config = require(`${projectDirectory}/config/favicons.config.js`)(devConfig);
} catch (e) {
    /** noop */
}

async function generateFavicons() {
    if (!config.source) return;

    await favicons(config.source, config.faviconsPlugin, async (error, response) => {
        if (error) throw new Error(error.message);

        response.images.forEach((image) => {
            fs.writeFileSync(`${config.folder}/${image.name}`, image.contents);
        });

        response.files.forEach((file) => {
            fs.writeFileSync(`${config.folder}/${file.name}`, file.contents);
        });

        const metaTags = response.html
            .map((html) => {
                return html.replace('">', '" />');
            })
            .join('\n');

        prettier.resolveConfigFile().then((filePath) => {
            if (filePath) {
                prettier.resolveConfig(filePath).then((options) => {
                    const formatted = prettier.format(
                        `
                    import { Fragment, h } from '@atomify/jsx';
                    export const renderFavicons = () => {
                        return (
                        <Fragment>
                            ${metaTags}
                        </Fragment>
                        )
                    }
                    `,
                        options || {},
                    );

                    fs.writeFileSync(config.outputFile, formatted);
                });
            }
        });
    });
}

export default generateFavicons;