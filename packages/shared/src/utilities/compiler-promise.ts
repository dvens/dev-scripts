import chalk from 'chalk';

import { format } from './run';

export const logMessage = (message: any, level: string = 'info') => {
    const color =
        level === 'error'
            ? 'red'
            : level === 'warning'
            ? 'yellow'
            : level === 'info'
            ? 'blue'
            : 'white';
    console.log(`[${new Date().toISOString()}]`, chalk[color](message));
};

export function createCompilationPromise(name: string, compiler: any) {
    return new Promise((resolve, reject) => {
        let timeStart = new Date();
        compiler.hooks.compile.tap(name, () => {
            timeStart = new Date();
            logMessage(`[${format(timeStart)}] Compiling '${name}'...`);
        });

        compiler.hooks.done.tap(name, (stats: any) => {
            const timeEnd = new Date();
            const time = timeEnd.getTime() - timeStart.getTime();
            if (stats.hasErrors()) {
                console.info(`[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`);
                reject(new Error('Compilation failed!'));
            } else {
                console.info(
                    `[${format(timeEnd)}] Finished '${name}' compilation after ${time} ms`,
                );
                resolve(stats);
            }
        });
    });
}
