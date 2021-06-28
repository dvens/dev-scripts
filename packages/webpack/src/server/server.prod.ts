import { merge } from 'webpack-merge';

import { createServerBaseConfig, ServerBase } from './server.base';

const createServerProdConfig = (options: ServerBase) => {
    const baseConfig = createServerBaseConfig(options) as any;

    const prodConfig = {};

    return merge(baseConfig, prodConfig);
};

export default createServerProdConfig;
