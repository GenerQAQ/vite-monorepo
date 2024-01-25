<script setup lang="ts">
import { Sunny, Moon, Calendar } from '@element-plus/icons-vue';
import { isDark, toggleDark } from '@/utils/dark';
import { dayjs } from 'element-plus';
import { useUserStore } from '@Project/demo-1/store/user';

const day = ref(dayjs().add(1, 'month').startOf('month'));

const store = useUserStore();
</script>

<template>
    <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            <img src="/assets/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue DEMO" />
    <div class="box">
        <el-tag>{{ store.user }}</el-tag>
        <el-switch
            v-model="isDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="() => toggleDark"
        />
        <el-countdown format="DD [days] HH:mm:ss" :value="day">
            <template #title>
                <el-icon :size="12">
                    <calendar />
                </el-icon>
                Still to go until next month
            </template>
        </el-countdown>
        <div>{{ day.format('YYYY-MM-DD') }}</div>
    </div>
</template>

<style lang="scss" src="./index.scss" scoped></style>
