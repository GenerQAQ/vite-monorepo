import { createApp } from 'vue';
import './styles/index.scss';
import App from './App.vue';
import store from '@Project/store';
import router from '@Project/router';

createApp(App).use(store).use(router).mount('#app');
