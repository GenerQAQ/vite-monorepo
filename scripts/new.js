import fs from 'fs';
import { resolve } from 'path';

console.log('请输入要生成的项目文件名称，会生成在 /src/projects 目录下:');

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
        copyFolderSync(resolve('./scripts/template'), targetPath);
        console.log('模板复制成功!');
        // 复制成功时退出程序
        process.exit(0);
    } catch (err) {
        console.error('复制模板失败:', err);
    }
});

// 复制文件夹
const copyFolderSync = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });

    const files = fs.readdirSync(src);
    for (const file of files) {
        const current = fs.lstatSync(resolve(src, file));
        if (current.isDirectory()) {
            copyFolderSync(resolve(src, file), resolve(dest, file));
        } else if (current.isSymbolicLink()) {
            const symlink = fs.readlinkSync(resolve(src, file));
            fs.symlinkSync(symlink, resolve(dest, file));
        } else {
            fs.copyFileSync(resolve(src, file), resolve(dest, file));
        }
    }
};
