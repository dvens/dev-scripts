#!/usr/bin/env node
const { program } = require('commander');

const packageJson = require('../package.json');
const semver = require('semver');
const { devConfig } = require('@dev-scripts/shared');

const commands = {
    build: function (args) {
        const { build } = require('../dist/build');
        build(args);
    },
    serve: function (args) {
        const { serve } = require('../dist/serve');
        serve(args);
    },
    dev: function (args) {
        const { dev } = require('../dist/dev');
        dev(args);
    },
};

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

function checkEnv() {
    if (process.env.NODE_ENV && !standardEnv.includes(process.env.NODE_ENV)) {
        log.warn(NON_STANDARD_NODE_ENV);
        console.log(
            chalk.red(
                'You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against.',
            ),
        );
        process.exit(1);
    }
}

const defaultEnv = (command) => (command === 'dev' ? 'development' : 'production');
const standardEnv = ['production', 'development', 'test'];

checkNodeVersion(requiredVersion, '@dev-scripts/cli');

program
    .command('serve')
    .allowUnknownOption()
    .action((options) => {
        process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv('serve');
        checkEnv();
        commands['serve'](options);
    });

program
    .command('dev')
    .allowUnknownOption()
    .action((options) => {
        process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv('dev');
        checkEnv();
        commands['dev'](options);

        const { watchFile } = require('fs');
        const configFile = devConfig.root + '/config/project.config.js';
        watchFile(configFile, (cur, prev) => {
            if (cur.size > 0 || prev.size > 0) {
                console.log(
                    `\n> Found a change in ${CONFIG_FILE}. Restart the server to see the changes in effect.`,
                );
            }
        });
    });

program
    .command('build')
    .allowUnknownOption()
    .action((options) => {
        process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv('build');
        checkEnv();
        commands['build'](options);
    });

program.parse(process.argv);
