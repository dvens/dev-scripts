import { minify } from 'terser';

import { Polyfill, PolyfillLoader } from './../../types/config.types';

const EMPTY_ENTRIES = {
    test: '',
    files: [],
};

export interface ScriptProps {
    src: string;
    type: null | string;
    nomodule: boolean;
}

/**
 * Loader utility thats being used to load scripts dynamically.
 */
const loadScriptFunction = `
  function loadScript(src, module) {
    return new Promise(function (resolve, reject) {
      document.head.appendChild(Object.assign(
        document.createElement('script'),
        { src: src, onload: resolve, onerror: reject },
        module ? { type: 'module' } : undefined
      ));
    });
  }`;

/**
 * Creates polyfill string with a variable where polyfills are being added when their test is valid.
 */
const createPolyfillLoader = (polyfills: Polyfill, relativePath: string) => {
    if (!polyfills.length) return '';
    const filteredPolyfills = polyfills.filter((polyfill) => polyfill.test);

    let code = 'var polyfills = []\n';

    filteredPolyfills.forEach((polyfill) => {
        code += `if(${polyfill.test}) {
            polyfills.push(loadScript('${relativePath}${polyfill.name}.js', ${Boolean(
            polyfill.module,
        )} ) )
        }\n`;
    });

    return code;
};

const asArrayLiteral = (arr: any[]) => `[${arr.map((e) => `${JSON.stringify(e)}`).join(',')}]`;

/*
 * Creates an entry loader based upon the amount of items, it will use an foreach when there are more multiple entries.
 * Prefix from the config.legacyPrefix is being used for legacy entries.
 */
const entryLoaderCreator = (files: any[]) => {
    const generatedFiles = files.map((file) => {
        return {
            path: file.path,
            module: file.module || false,
        };
    });

    return generatedFiles.length === 1
        ? `loadScript('${generatedFiles[0].path}', ${Boolean(generatedFiles[0].module)})`
        : `${asArrayLiteral(
              generatedFiles,
          )}.forEach(function (entry) { loadScript(entry.path, entry.module); })`;
};

/**
 * Creates an function that returns a promise or single executable loadEntries fucntion.
 */
const createExecuteLoadEntries = (polyfills: Polyfill) => {
    if (polyfills && polyfills.length) {
        return 'polyfills.length ? Promise.all(polyfills).then(loadEntries) : loadEntries();';
    }
    return 'loadEntries()';
};

const createEntriesLoader = (config: PolyfillLoader, polyfills: Polyfill) => {
    const { modern = EMPTY_ENTRIES, legacy = EMPTY_ENTRIES } = config;
    const loadModern = entryLoaderCreator(modern.files);
    const loadLegacy = entryLoaderCreator(legacy.files);

    const entriesTest = legacy.test
        ? `${legacy.test} ? ${loadModern} : ${loadLegacy};`
        : `${loadModern}`;

    return `
        function loadEntries() {
            ${entriesTest}
        }

        ${createExecuteLoadEntries(polyfills)}
    `;
};

const createScripts = (polyfills: Polyfill, config: PolyfillLoader): ScriptProps[] => {
    if (polyfills.length === 0) return [];

    const filteredPolyfills = polyfills.filter((polyfill) => !polyfill.test);

    return filteredPolyfills.map((polyfill) => {
        const props: ScriptProps = {
            src: `${config.relativePathToPolyfills}${polyfill.name}.js`,
            type: null,
            nomodule: false,
        };

        if (polyfill.module) {
            props.type = 'module';
        }

        if (polyfill.nomodule) {
            props.nomodule = true;
        }

        return props;
    });
};

/**
 * Creates a production loader script that executed immediately.
 */
const createProdLoaderScript = async (config: PolyfillLoader, polyfills: Polyfill) => {
    const code = `
    (function () {
        ${loadScriptFunction}
        ${createPolyfillLoader(polyfills, config.relativePathToPolyfills)}
        ${createEntriesLoader(config, polyfills)}
    })();`;

    let finalizedCode: string | undefined = code;

    if (config.polyfills.minify) {
        const minified = await minify(code);
        finalizedCode = minified.code;
    }

    return {
        polyfills: createScripts(polyfills, config),
        code: finalizedCode,
    };
};

/**
 * Creates a development loader script that executed immediately.
 */
const createDevLoaderScript = (config: PolyfillLoader) => {
    const { modern } = config;

    return {
        scripts: modern.files.map((file) => ({
            src: file.path,
            type: null,
            nomodule: false,
        })),
    };
};

export { createProdLoaderScript, createDevLoaderScript };
