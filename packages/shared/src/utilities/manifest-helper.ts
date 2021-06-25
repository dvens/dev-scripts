import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

interface Options {
    cache?: boolean;
    manifestPath: string;
    prependPath?: string;
}

let manifest: any;
let defaults: Options = {
    cache: true,
    manifestPath: '',
    prependPath: '',
};

function loadManifest() {
    if (manifest && defaults.cache) return manifest;

    try {
        return JSON.parse(fs.readFileSync(defaults.manifestPath, 'utf8'));
    } catch (err) {
        throw new Error('Asset Manifest could not be loaded.');
    }
}

export function lookup(source: string) {
    manifest = loadManifest();

    if (manifest[source]) return `${defaults.prependPath}${manifest[source]}`;
    else return '';
}

export function getManifest() {
    return manifest || loadManifest();
}

export function getSources() {
    manifest = manifest || loadManifest();
    return Object.keys(manifest);
}

export function getStylesheetSources() {
    return getSources().filter((file) => file.match(/\.css$/));
}

export function getJavascriptSources() {
    return getSources().filter((file) => file.match(/\.js$/));
}

export function getImageSources() {
    return getSources().filter((file) => file.match(/\.(png|jpe?g|gif|webp|bmp)$/));
}

export function getImages() {
    return getImageSources().map((source) => lookup(source));
}

export function assetPath(source: string) {
    return lookup(source);
}

export function manifestHelper(opts: Options) {
    manifest = null;

    const options = {
        ...defaults,
        ...opts,
    };

    defaults = options;

    return function (_: Request, res: Response, next: NextFunction) {
        res.locals.getSources = getSources;
        res.locals.getStylesheetSources = getStylesheetSources;
        res.locals.getJavascriptSources = getJavascriptSources;
        res.locals.getImageSources = getImageSources;
        res.locals.getImages = getImages;
        res.locals.getManifest = getManifest;
        res.locals.assetPath = assetPath;

        next();
    };
}
