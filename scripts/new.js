import fs from 'fs';
import { resolve } from 'path';

console.log('请输入要生成的项目文件名称，会生成在 /src/projects 目录下:');

// 复制文件夹
const copyFolderSync = (src, dest, projectName) => {
    // 创建目标文件夹，如果不存在则递归创建
    fs.mkdirSync(dest, { recursive: true });

    // 获取源文件夹内的所有文件和子文件夹
    const files = fs.readdirSync(src);
    for (const file of files) {
        // 获取当前文件或子文件夹的信息
        const current = fs.lstatSync(resolve(src, file));

        // 如果是子文件夹，则递归调用copyFolderSync
        if (current.isDirectory()) {
            copyFolderSync(resolve(src, file), resolve(dest, file), projectName);
        }
        // 如果是符号链接，则创建相应的符号链接
        else if (current.isSymbolicLink()) {
            const symlink = fs.readlinkSync(resolve(src, file));
            fs.symlinkSync(symlink, resolve(dest, file));
        }
        // 如果是文件，则复制文件并替换内容
        else {
            // 读取文件内容
            const fileContent = fs.readFileSync(resolve(src, file), 'utf-8');

            // 替换文件内容中的@Project/template为@Project/文件夹名称
            const updatedContent = fileContent.replace(/@Project\/template/g, `@Project/${projectName}`);

            // 将更新后的内容写入目标文件
            fs.writeFileSync(resolve(dest, file), updatedContent, 'utf-8');
        }
    }
};

// process.stdin属性是流程模块的内置应用程序编程接口，用于侦听用户输入，它使用on()函数来监听事件。
process.stdin.on('data', async (chunk) => {
    // 获取输入的信息
    const content = String(chunk).trim().toString();

    // 使用正则表达式验证输入是否符合字母和横线的规则
    const isValidInput = /^[a-zA-Z\d-]+$/.test(content);
    if (!isValidInput) {
        console.error('格式错误，请重新输入，只允许字母和横线');
        return;
    }

    console.log(`将在 /src/projects 目录下创建 ${content} 文件夹`);
    const targetPath = resolve('./src/projects', content);

    // 判断同名文件夹是否存在
    const pageExists = fs.existsSync(targetPath);
    if (pageExists) {
        console.error('页面已经存在，请重新输入');
        return;
    }

    // 复制template目录到/src/projects下并改名为输入的值
    try {
        copyFolderSync(resolve('./scripts/template'), targetPath, content);
        console.log('模板复制成功!');
        // 复制成功时退出程序
        process.exit(0);
    } catch (err) {
        console.error('复制模板失败:', err);
    }
});
