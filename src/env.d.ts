// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference types="vite/client" />

declare module '*.vue' {
    import { type DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
