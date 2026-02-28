/**
 * Debug utilities for BeyondChats
 * 
 * Usage:
 * - import { debugLog, setDebugMode } from '@/utils/debug'
 * - setDebugMode(true)  // Enable debug mode
 * - debugLog('message', data)
 */

let debugMode = import.meta.env.VITE_DEBUG === 'true';

/**
 * Enable or disable debug mode
 */
export const setDebugMode = (enabled: boolean): void => {
  debugMode = enabled;
  if (debugMode) {
    console.log('%c🐛 DEBUG MODE ENABLED', 'color: #ff6b6b; font-weight: bold; font-size: 14px;');
  } else {
    console.log('%c🐛 DEBUG MODE DISABLED', 'color: #868e96; font-weight: bold; font-size: 14px;');
  }
};

/**
 * Get current debug mode status
 */
export const isDebugMode = (): boolean => debugMode;

/**
 * Log a debug message
 */
export const debugLog = (title: string, data?: any): void => {
  if (!debugMode) return;
  
  const timestamp = new Date().toLocaleTimeString();
  console.group(`%c[${timestamp}] ${title}`, 'color: #0066cc; font-weight: bold;');
  
  if (data !== undefined) {
    console.log(data);
  }
  
  console.groupEnd();
};

/**
 * Log debug info with different levels
 */
export const debugInfo = (message: string, data?: any): void => {
  if (!debugMode) return;
  console.log('%cℹ️ INFO', 'color: #0066cc;', message, data || '');
};

export const debugWarn = (message: string, data?: any): void => {
  if (!debugMode) return;
  console.log('%c⚠️  WARN', 'color: #ff9800;', message, data || '');
};

export const debugError = (message: string, data?: any): void => {
  if (!debugMode) return;
  console.log('%c❌ ERROR', 'color: #f44336;', message, data || '');
};

export const debugSuccess = (message: string, data?: any): void => {
  if (!debugMode) return;
  console.log('%c✅ SUCCESS', 'color: #4caf50;', message, data || '');
};

/**
 * Log performance metrics
 */
export const debugPerformance = (label: string): (() => void) => {
  if (!debugMode) return () => {};
  
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(
      `%c⏱️  ${label}: ${duration}ms`,
      'color: #9c27b0;'
    );
  };
};

/**
 * Log API calls
 */
export const debugAPI = (method: string, url: string, data?: any): void => {
  if (!debugMode) return;
  
  console.group(`%c🌐 API: ${method} ${url}`, 'color: #00bcd4; font-weight: bold;');
  if (data) {
    console.log('Data:', data);
  }
  console.groupEnd();
};

/**
 * Enable/disable debug mode from window object for console access
 */
if (typeof window !== 'undefined') {
  (window as any).__debug = {
    enable: () => setDebugMode(true),
    disable: () => setDebugMode(false),
    status: () => isDebugMode(),
  };
  
  if (debugMode) {
    console.log(
      '%c💡 Debug tools available: window.__debug.enable(), window.__debug.disable(), window.__debug.status()',
      'color: #0066cc; font-size: 12px;'
    );
  }
}

/**
 * Export debug object for Vue components
 */
export const debug = {
  setEnabled: setDebugMode,
  isEnabled: isDebugMode,
  log: debugLog,
  info: debugInfo,
  warn: debugWarn,
  error: debugError,
  success: debugSuccess,
  performance: debugPerformance,
  api: debugAPI,
};
