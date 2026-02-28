/**
 * WebView Preload Script
 * This script runs in the isolated context of WebView
 */

// 由于 WebView 使用分离的分区，不需要特别的 API 暴露
// WebView 会自动管理存储和 session
console.log('[WebView Preload] Loaded successfully');
