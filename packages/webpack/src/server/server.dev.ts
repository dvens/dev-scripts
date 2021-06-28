import webpack from 'webpack';
import { merge } from 'webpack-merge';

import { createServerBaseConfig, ServerBase } from './server.base';

const createServerDevConfig = (options: ServerBase) => {
    const baseConfig = createServerBaseConfig(options) as any;

    const devConfig = {
        plugins: [new webpack.HotModuleReplacementPlugin()],
    };

    return merge(baseConfig, devConfig);
};

export default createServerDevConfig;
