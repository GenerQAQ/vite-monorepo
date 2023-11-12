import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: '测试首页 - demo-1'
        },
        component: () => import('@Project/views/Home/index.vue')
    }
];

const router: Router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    // 刷新后滚动事件
    scrollBehavior(to, from, savedPosition) {
        console.log('切换路由: to - from', to, from);
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    },
    routes
});

// 全局路由前置守卫，在进入路由前触发，导航在所有守卫 resolve 完之前一直处于等待中。
router.beforeEach((to, from) => {
    console.log('全局路由前置守卫: to - from', to, from);
    // 设置页面标题
    document.title = to.meta.title ?? import.meta.env.VITE_APP_TITLE;
    // 路由进度开始
    if (!NProgress.isStarted()) {
        NProgress.start();
    }
});

// 全局路由后置守卫
router.afterEach((to, from) => {
    console.log('全局路由后置守卫: to - from', to, from);
    // 路由进度结束
    NProgress.done();
});

export default router;
