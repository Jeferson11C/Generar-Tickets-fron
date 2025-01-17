import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import axios from 'axios';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

import router from "./router/index.js";


createApp(App)
    .use(router)
    .use(axios)
    .component('pv-button', Button)
    .component('pv-textarea', Textarea)
    .use(PrimeVue, {ripple: true})
    .mount('#app');