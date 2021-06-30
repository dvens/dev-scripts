#!/usr/bin/env node
const { program } = require('commander');

const packageJson = require('../package.json');
const semver = require('semver');
const { start } = require('../dist/start');

program.version(packageJson.version);

const requiredVersion = packageJson.engines.node;

function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
        console.log(
            chalk.red(
                'You are using Node ' +
                    process.version +
                    ', but this version of ' +
                    id +
                    ' requires Node ' +
                    wanted +
                    '.\nPlease upgrade your Node version.',
            ),
        );
        process.exit(1);
    }
}

checkNodeVersion(requiredVersion, '@dev-scripts/cli');

program
    .command('start')
    .description('alias of "npm run start" in the current project')
    .allowUnknownOption()
    .action(() => {
        start();
    });

//https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli/bin/vue.js

program.parse(process.argv);
