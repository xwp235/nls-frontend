import { createApp, h } from 'vue';
import Loading from './Loading.vue';

let count = 0;
let appInstance = null;

const element = document.createElement('div');
element.classList.add('app-loading');

const app = createApp({
    data() {
        return {
            count: 0
        };
    },
    methods: {
        showLoading() {
            if (this.count === 0) {
                const loadingComponent = h(Loading);
                this.$mountLoading = this.$mount(element, loadingComponent);
                if (!element.parentNode) {
                    document.body.appendChild(element);
                }
            }
            this.count++;
        },
        hideLoading() {
            this.count--;
            if (this.count === 0) {
                this.$unmount(this.$mountLoading);
                document.body.removeChild(element);
            }
        }
    }
});

export const showLoading = () => {
    if (!appInstance) {
        appInstance = app.mount();
    }
    appInstance.showLoading();
};

export const hideLoading = () => {
    if (!appInstance) {
        throw new Error('Loading not initialized');
    }
    appInstance.hideLoading();
};
