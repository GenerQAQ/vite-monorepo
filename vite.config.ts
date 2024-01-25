import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import compressionPlugin from 'vite-plugin-compression';
import { viteMockServe } from 'vite-plugin-mock';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import legacy from '@vitejs/plugin-legacy';
import path, { resolve } from 'path';
import fs from 'fs';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { ElementPlusResolver as elementPlusResolver } from 'unplugin-vue-components/resolvers';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const PROJECTFOLDER = 'projects';
const HOST = '0.0.0.0';
const PORT = 5173;
const SERVER: Record<string, { MOCKIP: string; MOCKPORT: number }> = {
    demo: {
        MOCKIP: '0.0.0.0',
        MOCKPORT: 8888
    }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const env = loadEnv(mode, process.cwd(), '');

    // 获取 dev后缀 配置的环境变量
    const npm_config_project = process.env.npm_config_project || '';
    if (!npm_config_project) {
        throw new Error('缺少指定模块!, 请使用 --project=[module_name]');
    }

    /**
     * 获取指定的单页面入口
     */
    const getEnterPages = () => {
        const PAGE_PATH = resolve(__dirname, `./src/${PROJECTFOLDER}`); // 指定要查询的目录
        const entryFiles = fs.readdirSync(PAGE_PATH); // 获取到指定目录下的所有文件名
        if (!entryFiles.includes(npm_config_project)) {
            throw new Error(`未找到指定模块: ${npm_config_project}, 请检查是否拼写错误`);
        }
        return {
            [npm_config_project]: resolve(__dirname, `src/${PROJECTFOLDER}/${npm_config_project}/index.html`)
        };
    };

    // 获取对应的本地服务地址
    const MOCKIP = SERVER[npm_config_project]?.MOCKIP || '';
    const MOCKPORT = SERVER[npm_config_project]?.MOCKPORT || '';

    return {
        root: resolve(__dirname, `src/${PROJECTFOLDER}/${npm_config_project}`),
        base: `/${npm_config_project}/`, // 开发或生产环境服务的公共基础路径
        envDir: resolve(__dirname), // 用于加载 .env 文件的目录
        resolve: {
            alias: {
                '@': path.join(__dirname, './src'),
                '@Project': path.join(__dirname, `./src/${PROJECTFOLDER}`)
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use '@Project/${npm_config_project}/styles/element/light.scss';
                        @use '@Project/${npm_config_project}/styles/element/dark.scss';
                    `
                }
            },
            postcss: {
                plugins: [tailwindcss, autoprefixer]
            }
        },
        plugins: [
            vue(),
            vueJsx(),
            autoImport({
                imports: ['vue', 'pinia', 'vue-router', '@vueuse/core', 'vitest'],
                dts: resolve(__dirname, './auto-imports.d.ts'),
                eslintrc: {
                    // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
                    enabled: true,
                    // 生成文件地址和名称
                    filepath: path.resolve(__dirname, './.eslintrc-auto-import.json'),
                    globalsPropValue: true
                },
                resolvers: [
                    elementPlusResolver({
                        importStyle: 'sass'
                    })
                ]
            }),
            components({
                dirs: [resolve(__dirname, `src/${PROJECTFOLDER}/${npm_config_project}/components`)],
                resolvers: [
                    elementPlusResolver({
                        importStyle: 'sass'
                    })
                ]
            }),
            viteMockServe({
                localEnabled: mode === 'development' // 在开发环境开启mock
            }),
            chunkSplitPlugin({
                strategy: 'default',
                customSplitting: {
                    __commonjsHelpers__: [/some unreachable check/], // override
                    vendor: [/node_modules/],
                    vue: [/vue/, /vue-router/],
                    common: [/src\/utils/, /src\/components/]
                }
            }),
            legacy({
                renderLegacyChunks: false,
                targets: ['defaults', 'not IE 11']
            }),
            compressionPlugin({
                verbose: true, // 输出压缩成功
                disable: false, // 是否禁用
                threshold: 10240, // 体积大于阈值会被压缩，单位是b
                algorithm: 'gzip', // 压缩算法
                ext: '.gz' // 生成的压缩包后缀
            }),
            visualizer() // 构建分析
        ],
        server: {
            // 在开发服务器启动时自动在浏览器中打开应用程序
            open: true,
            // 服务器监听地址
            host: HOST,
            // 服务器端口
            port: PORT,
            // 服务器自定义代理规则
            proxy: {
                [`/${npm_config_project}/${env.VITE_APP_BASE_API}`]: {
                    target: `http://${MOCKIP}:${MOCKPORT}`,
                    changeOrigin: true, // 将host header的源更改为target URL
                    ws: true, // 用于代理 WS(S) 请求
                    rewrite: (path) => path.replace(`/${npm_config_project}/${env.VITE_APP_BASE_API}`, '')
                }
            }
        },
        test: {
            root: resolve(__dirname, '.'),
            include: [resolve(__dirname, `test/${npm_config_project}/*.{test,spec}.?(c|m)[jt]s?(x)`)],
            globals: true,
            environment: 'jsdom',
            reporters: ['html'],
            outputFile: resolve(__dirname, `test/${npm_config_project}/html/index.html`),
            server: {
                deps: {
                    inline: ['element-plus']
                }
            },
            coverage: {
                enabled: true,
                reportsDirectory: resolve(__dirname, `test/${npm_config_project}/coverage`),
                reporter: ['html']
            }
        },
        build: {
            outDir: resolve(__dirname, `dist/${npm_config_project}`), // 指定输出路径
            assetsInlineLimit: 4096, // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求
            emptyOutDir: true, // Vite 会在构建时清空该目录
            rollupOptions: {
                input: getEnterPages()
            }
        },
        esbuild: {
            drop: mode === 'production' ? ['console', 'debugger'] : [] // 删除 console.* debugger; 函数的调用
        }
    };
});
