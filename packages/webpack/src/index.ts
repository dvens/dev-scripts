import createClientDevConfig from './client/client.dev';
import createClientProdConfig from './client/client.prod';
import fontsLoader from './loaders/fonts-loader';
import imageLoader from './loaders/image-loader';
import configureBabelLoader from './loaders/javascript-typescript';
import configureStyleLoader from './loaders/style-loader';
import { getPlugins } from './plugins/plugins';
import createServerDevConfig from './server/server.dev';
import createServerProdConfig from './server/server.prod';

export {
    createClientDevConfig,
    createClientProdConfig,
    fontsLoader,
    imageLoader,
    configureBabelLoader,
    configureStyleLoader,
    getPlugins,
    createServerDevConfig,
    createServerProdConfig,
};
