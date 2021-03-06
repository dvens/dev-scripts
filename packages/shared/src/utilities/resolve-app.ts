import { realpathSync } from 'fs';
import { resolve } from 'path';

const appDirectory = realpathSync(process.cwd());
const resolveApp = (relativePath: string) => resolve(appDirectory, relativePath);

export default resolveApp;
