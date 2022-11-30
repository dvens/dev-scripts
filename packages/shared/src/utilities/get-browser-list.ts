import { defaults } from 'browserslist';
import * as browserslist from 'browserslist';

const browsersListConfig = ['chrome 64', 'edge 79', 'firefox 67', 'opera 51', 'safari 12'];

/**
 * Finds the supported browsers. Uses a user-defined configuration if defined,
 * otherwise uses a default set of supported browsers
 * @returns {string[]}
 */
export function findSupportedBrowsers(browsers = []) {
    // generate default list
    const browserslistDefaultTargets = browserslist(defaults);
    // empty call causes browserslist to find a user-defined configuration
    // for example in .bowerslistrc or the package.json
    const userTargets = browserslist();

    const userHasDefinedTargets =
        userTargets.length !== browserslistDefaultTargets.length ||
        userTargets.some((e) => !browserslistDefaultTargets.includes(e));

    if (userHasDefinedTargets && userTargets.includes('ie 11')) {
        throw new Error(
            'Your browserslist configuration should not include ie 11.\n' +
                'The browserslists configuration is for the modern build.\n',
        );
    }

    return userHasDefinedTargets ? userTargets : browserslist([...browsersListConfig, ...browsers]);
}
