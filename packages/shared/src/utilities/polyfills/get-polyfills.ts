import crypto from 'crypto';
import { existsSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { minify } from 'terser';

import { PolyfillLoader } from '../../types/config.types';

export async function getPolyfills(config?: PolyfillLoader) {
    if (!config) return null;

    const polyfills: any[] = [];
    const instructions = [...(config.polyfills.customPolyfills || [])];

    if (config.polyfills.coreJs) {
        instructions.push({
            name: 'core-js',
            path: require.resolve('core-js-bundle/minified.js'),
            nomodule: true,
        });
    }

    if (config.polyfills.regeneratorRuntime) {
        instructions.push({
            name: 'regenerator-runtime',
            path: require.resolve('regenerator-runtime/runtime'),
            nomodule: true,
        });
    }

    if (config.polyfills.fetch) {
        instructions.push({
            name: 'fetch',
            test: "!('fetch' in window)",
            path: require.resolve('whatwg-fetch/dist/fetch.umd.js'),
        });
    }

    if (config.polyfills.intersectionObserver) {
        instructions.push({
            name: 'intersection-observer',
            test: "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
            path: require.resolve('intersection-observer/intersection-observer.js'),
        });
    }

    if (config.polyfills.webcomponents) {
        instructions.push({
            name: 'webcomponents',
            test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || (window.ShadyDOM && window.ShadyDOM.force)",
            path: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
        });

        instructions.push({
            name: 'custom-elements-es5-adapter',
            test: "!('noModule' in HTMLScriptElement.prototype) && 'getRootNode' in Element.prototype",
            path: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
        });
    }

    instructions.forEach(async (instruction) => {
        if (!instruction.name || !instruction.path) {
            throw new Error(`A polyfill should have a name and a path property.`);
        }

        const codePath = resolve(instruction.path);
        if (!codePath || !existsSync(codePath) || !statSync(codePath).isFile()) {
            throw new Error(`Could not find a file at ${instruction.path}`);
        }

        let code = readFileSync(codePath, 'utf-8');

        if (config.polyfills.minify) {
            const minified = await minify(code);
            if (minified.code) code = minified.code;
        }

        const name = config.polyfills.hash
            ? `${instruction.name}.${createContentHash(code)}`
            : instruction.name;
        const url = `${config.polyfillsDir}${name}.js`;

        // Push polyfill when path and name exists.
        polyfills.push({
            name: name,
            test: instruction.test,
            nomodule: !!instruction.nomodule,
            module: !!instruction.module,
            url,
            code,
        });
    });

    return polyfills;
}

function createContentHash(content: string) {
    return crypto.createHash('md4').update(content).digest('hex');
}
