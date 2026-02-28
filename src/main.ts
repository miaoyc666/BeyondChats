import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import router from './router';
import { setDebugMode, debugLog } from './utils/debug';

// Initialize debug mode
const debugMode = import.meta.env.VITE_DEBUG === 'true';
setDebugMode(debugMode);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');

// Log app initialization
debugLog('BeyondChats App Initialized', {
  debugMode,
  version: import.meta.env.VITE_APP_VERSION || '0.1.0',
  env: import.meta.env.MODE,
});
