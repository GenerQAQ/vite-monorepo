import { createApp } from 'vue';
import './styles/index.scss';
import App from './App.vue';
import store from '@Project/demo-1/store';
import router from '@Project/demo-1/router';

createApp(App).use(store).use(router).mount('#app');
