export function getDefaultMode() {
    return process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
}
