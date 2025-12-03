import { AppController } from './controllers/AppController.js';

/**
 * アプリケーションのエントリーポイント
 */
document.addEventListener('DOMContentLoaded', () => {
    // アプリケーションコントローラーを初期化
    const app = new AppController();
    
    // デバッグ用にグローバルに公開
    window.app = app;
    
    console.log('シフト管理アプリケーションが起動しました');
});