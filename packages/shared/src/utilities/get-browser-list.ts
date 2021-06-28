import browserslist, { defaults } from 'browserslist';

const browsersListConfig = [
    'last 2 Chrome major versions',
    'last 2 ChromeAndroid major versions',
    'last 2 Firefox major versions',
    'last 2 Edge major versions',
    'last 2 Safari major versions',
    'last 2 iOS major versions',
];

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
