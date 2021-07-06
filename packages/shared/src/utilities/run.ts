import * as ora from 'ora';

export function format(time: Date) {
    return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

function run(fn: any, options = undefined) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    const start = new Date();

    const spinner = ora(
        `[${format(start)}] Starting '${task.name}${options ? ` (${options})` : ''}'...`,
    ).start();

    return task(options).then((resolution: any) => {
        const end = new Date();
        const time = end.getTime() - start.getTime();

        spinner.text = `[${format(end)}] Finished '${task.name}${
            options ? ` (${options})` : ''
        }' after ${time} ms`;
        spinner.stop();

        return resolution;
    });
}

if (require.main === module && process.argv.length > 2) {
    delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle

    const module = require(`./${process.argv[2]}.ts`); // eslint-disable-line import/no-dynamic-require

    run(module).catch((err: { stack: string }) => {
        console.error(err.stack);
        process.exit(1);
    });
}

export default run;
