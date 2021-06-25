export function normalizePath(path: string) {
    if (path.startsWith('/')) {
        return path.substring(1, path.length);
    }

    return path;
}

export function removeDoubleSlash(path: string) {
    return path.replace(/([^:]\/)\/+/g, '$1');
}
