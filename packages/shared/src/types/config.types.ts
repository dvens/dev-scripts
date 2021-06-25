export interface Config {
    // Root folder
    root: string;

    // Source folder
    source: string;
    pages: string;
    components: string;
    nodeModules: string;
    dotenv: string;

    // Entries
    clientEntry: string[];
    serverEntry: string[];

    // Node.js App
    port: number;

    // Public folder
    public: string;

    // Assets Folder
    assets: string;
    images: string;
    svg: string;
    favicons: string;

    // Data folder
    data: string;

    // Styles Folder
    styles: string;

    // Dist Folder
    dist: string;
    clientDist: string;
    serverDist: string;

    // Config legacy prefix
    legacyPrefix: string;

    // Assets dist folders
    imagesOutputPath: string;
    svgOutputPath: string;
    fontsOutputPath: string;
    jsOutputPath: string;
    cssOutputPath: string;
    publicPath: string;

    // Service worker options
    injectManifest: boolean;
    swSrc: string;

    // Webpack copy config
    copy: Record<string, unknown> | null;
}

export type Polyfill = Array<{
    name: string;
    path: string;
    test?: string;
    nomodule?: boolean;
    module?: boolean;
}>;
export interface Polyfills {
    coreJs?: boolean;
    regeneratorRuntime?: boolean;
    webcomponents?: boolean;
    fetch?: boolean;
    intersectionObserver?: boolean;
    minify?: boolean;
    hash?: boolean;
    customPolyfills?: Polyfill;
}

export interface PolyfillLoader {
    polyfillsDir: string;
    relativePathToPolyfills: string;
    manifestDir: string;
    modern: {
        files: Array<{
            path: string;
            module?: boolean;
        }>;
    };

    legacy: {
        test: string;
        files: Array<{
            path: string;
            module?: boolean;
        }>;
    };
    polyfills: Polyfills;
}
