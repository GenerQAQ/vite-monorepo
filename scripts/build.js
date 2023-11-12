import { spawn } from 'child_process';
import fs from 'fs/promises';
import { resolve } from 'path';

const projectsPath = resolve('./src/projects');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildProject = async (project) => {
    const projectPath = resolve(projectsPath, project);

    // Split the npm command into its components
    const buildCommand = 'npm';
    const buildArgs = ['run', 'build', `--project=${project}`];

    console.log(`开始打包项目 ${project}`);

    const buildProcess = spawn(buildCommand, buildArgs, { cwd: projectPath, stdio: 'inherit' });

    return new Promise((resolve, reject) => {
        buildProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`项目 ${project} 打包完成`);
                resolve();
            } else {
                console.error(`项目 ${project} 打包失败，退出码: ${code}`);
                reject(new Error(`项目 ${project} 打包失败`));
            }
        });
    });
};

const buildAllProjects = async () => {
    try {
        const projectFolders = await fs.readdir(projectsPath);

        for (const project of projectFolders) {
            await buildProject(project);
            // 添加一些延迟，以防止同时进行太多子进程导致问题
            await sleep(1000);
        }

        console.log('所有项目打包完成');
    } catch (err) {
        console.error('打包过程中发生错误:', err);
    }
};

// 调用主函数
buildAllProjects();
