import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import showCodeMessage from '@/api/code';
import { formatJsonToUrlParams, type instanceObject } from '@/utils/format';

const BASE_URL = import.meta.env.BASE_URL;
const BASE_PREFIX = import.meta.env.VITE_APP_BASE_API;

// 创建实例
const axiosInstance: AxiosInstance = axios.create({
    // 前缀
    baseURL: BASE_URL + BASE_PREFIX,
    // 超时
    timeout: 1000 * 30,
    // 请求头
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // TODO 在这里可以加上想要在请求发送前处理的逻辑
        // TODO 比如 loading 等
        return config;
    },
    async (error: AxiosError) => {
        return await Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data;
        }
        ElMessage.info(JSON.stringify(response.status));
        return response;
    },
    async (error: AxiosError) => {
        const { response } = error;
        if (response) {
            ElMessage.error(showCodeMessage(response.status));
            return await Promise.reject(response.data);
        }
        ElMessage.warning('网络连接异常,请稍后再试!');
        return await Promise.reject(error);
    }
);
const service = {
    async get<T = any>(url: string, data?: object): Promise<T> {
        return await axiosInstance.get(url, { params: data });
    },

    async post<T = any>(url: string, data?: object): Promise<T> {
        return await axiosInstance.post(url, data);
    },

    async put<T = any>(url: string, data?: object): Promise<T> {
        return await axiosInstance.put(url, data);
    },

    async delete<T = any>(url: string, data?: object): Promise<T> {
        return await axiosInstance.delete(url, data);
    },

    upload: async (url: string, file: FormData | File) =>
        await axiosInstance.post(url, file, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    download: (url: string, data: instanceObject) => {
        window.location.href = `${BASE_URL}${BASE_PREFIX}/${url}?${formatJsonToUrlParams(data)}`;
    }
};

export default service;
