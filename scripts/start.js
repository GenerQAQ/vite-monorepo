import inquirer from 'inquirer';
import { execaCommand } from 'execa';
import { resolve, dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PAGE_PATH = resolve(__dirname, '../src/projects');
const entryFiles = fs.readdirSync(PAGE_PATH);

(async () => {
    try {
        const { mono: prd } = await inquirer.prompt([
            {
                type: 'list',
                message: '选择要启动的项目：',
                name: 'mono',
                default: entryFiles[0],
                choices: entryFiles.map((p) => ({ name: p, value: p }))
            }
        ]);

        const cmd = `npm run dev --project=${prd}`;
        await execaCommand(cmd, { stdio: 'inherit' });
    } catch (err) {
        console.error('发生错误：', err);
    }
})();
