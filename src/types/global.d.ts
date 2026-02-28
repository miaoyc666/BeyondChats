/// <reference types="vite/client" />

import type { ElectronAPI } from './electron';

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
