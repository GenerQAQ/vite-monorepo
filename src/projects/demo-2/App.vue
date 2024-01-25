<script setup lang="ts">
import { useUserStore } from '@Project/demo-2/store/user';
import { getUser } from '@/api/modules/user';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue';

const store = useUserStore();

const init = async () => {
    const { code, data } = await getUser();
    if (code === 0) {
        store.user = data.name;
    }
};

onMounted(() => {
    ElMessage.success('Welcome to this template!');
    init();
});
</script>

<template>
    <el-config-provider :locale="zhCn" size="small">
        <el-container class="main-container">
            <el-header>🗿 Vite-Monorepo</el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu>
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon><location /></el-icon>
                                <span>Navigator One</span>
                            </template>
                            <el-menu-item-group title="Group One">
                                <el-menu-item index="1-1">item one</el-menu-item>
                                <el-menu-item index="1-2">item two</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="Group Two">
                                <el-menu-item index="1-3">item three</el-menu-item>
                            </el-menu-item-group>
                            <el-sub-menu index="1-4">
                                <template #title>item four</template>
                                <el-menu-item index="1-4-1">item one</el-menu-item>
                            </el-sub-menu>
                        </el-sub-menu>
                        <el-menu-item index="2">
                            <el-icon><icon-menu /></el-icon>
                            <span>Navigator Two</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <el-icon><document /></el-icon>
                            <span>Navigator Three</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <el-icon><setting /></el-icon>
                            <span>Navigator Four</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main><router-view /></el-main>
            </el-container>
        </el-container>
    </el-config-provider>
</template>
