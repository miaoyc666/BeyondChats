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
      getPreloadPath: (scriptName?: string) => Promise<string>;
      saveSession: (data: { providerId: string }) => Promise<{ success: boolean }>;
      loadSession: (data: { providerId: string }) => Promise<{ exists: boolean; sessionData?: any }>;
      openExternal: (url: string) => Promise<void>;
      send: (channel: string, data: any) => void;
      on: (channel: string, listener: (...args: any[]) => void) => void;
      once: (channel: string, listener: (...args: any[]) => void) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
    };
  }
}

export {};
