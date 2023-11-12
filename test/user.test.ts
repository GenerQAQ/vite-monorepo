import { mount } from '@vue/test-utils';
import { useUserStore } from '@Project/store/user';
import home from '@Project/views/Home/index.vue';

// 单元测试环境下，需要显式的激活pinia
setActivePinia(createPinia());
let store = useUserStore();

const testData = {
    user: 'tim'
};

describe('Store User Check', () => {
    test('set user', () => {
        store.user = testData.user;
        expect(store.user === testData.user).toBe(true);
    });

    test('show user', () => {
        const wrapper = mount(home, {
            global: {
                mocks: {
                    store
                }
            }
        });

        expect(wrapper.html()).toContain(testData.user);
    });
});
