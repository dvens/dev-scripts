import { merge } from 'webpack-merge';

import { ClientBase, createClientBaseConfig } from './client.base';

const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

const createClientProdConfig = (options: ClientBase) => {
    const baseConfig = createClientBaseConfig(options) as any;

    const prodConfig = {
        devtool: generateSourceMap ? 'source-map' : false,
    };

    return merge(baseConfig, prodConfig);
};

export default createClientProdConfig;
