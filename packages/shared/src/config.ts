import { Config } from './types/config.types';
import resolveApp from './utilities/resolve-app';

export const projectDirectory = process.env.projectDirectory || process.cwd();

const projectConfig: Config = {
    // Root folder
    root: resolveApp(''),

    // Source folder
    source: resolveApp('src'),
    pages: resolveApp('src/pages'),
    components: resolveApp('src/components'),
    nodeModules: resolveApp('node_modules'),
    dotenv: resolveApp('.env'),

    // Entries
    clientEntry: [resolveApp('src/client/index.ts')],
    serverEntry: [resolveApp('src/server/index.ts')],

    // Node.js App
    port: Number(process.env.PORT) || 3000,

    // Public folder
    public: resolveApp('public'),

    // Assets Folder
    assets: resolveApp('public'),
    images: resolveApp('public/images'),
    svg: resolveApp('public/svg'),
    favicons: resolveApp('public/favicons'),

    // Data folder
    data: resolveApp('public/data'),

    // Styles Folder
    styles: resolveApp('src/styles'),

    // Dist Folder
    dist: resolveApp('build'),
    serverDist: resolveApp('build/server'),
    clientDist: '',

    // Config legacy prefix
    legacyPrefix: 'legacy-',

    // Config publicpath
    publicPath: process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : '/static/',

    // Assets dist folders
    imagesOutputPath: 'images/',
    svgOutputPath: 'svg/',
    fontsOutputPath: 'fonts/',
    jsOutputPath: 'js/',
    cssOutputPath: 'css/',

    // Service worker options
    injectManifest: false,
    swSrc: '',

    // Webpack copy config
    copy: null,
    contenthash: false,
};

// Overwrite config
projectConfig.clientDist = projectConfig.dist;
projectConfig.swSrc = `${projectConfig.root}/sw-precache.js`;

function getProjectConfig() {
    let projectExtendedConfig = {};

    try {
        projectExtendedConfig = require(`${projectDirectory}/config/project.config.js`)(
            projectConfig,
        );
    } catch (e) {
        /** noop */
    }

    const mergedConfig = {
        ...projectConfig,
        ...projectExtendedConfig,
    };

    return mergedConfig;
}

export const devConfig = getProjectConfig();
