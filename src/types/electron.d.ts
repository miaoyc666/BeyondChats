declare global {
  interface Window {
    electron: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      getAppVersion: () => Promise<string>;
      getAppPath: () => Promise<string>;
      openDevTools: () => Promise<void>;
      closeDevTools: () => Promise<void>;
      sendToWebView: (webviewId: string, message: any) => Promise<void>;
      send: (channel: string, data: any) => void;
      on: (channel: string, listener: (...args: any[]) => void) => void;
      once: (channel: string, listener: (...args: any[]) => void) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
    };
  }
}

export {};
