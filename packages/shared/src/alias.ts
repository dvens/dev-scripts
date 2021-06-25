import { projectDirectory } from './config';
import resolveApp from './utilities/resolve-app';

const striptSlashStar = (string: string) => string.replace('/*', '');

let aliases = {};

try {
    // Get alliases from tsconfig
    const tsconfig = require(`${projectDirectory}/tsconfig.json`);
    aliases = tsconfig.compilerOptions.paths;
} catch (e) {}

function setAliasConfig() {
    const aliasKeys = Object.keys(aliases);
    const webpackAliases = aliasKeys.reduce((obj: any, key: string) => {
        const aliasPath = striptSlashStar(aliases[key as keyof typeof aliases][0]).replace(
            './',
            '',
        );

        obj[striptSlashStar(key) as keyof typeof obj] = resolveApp(aliasPath);

        return obj;
    }, {});

    return webpackAliases;
}

export const alias = setAliasConfig();
