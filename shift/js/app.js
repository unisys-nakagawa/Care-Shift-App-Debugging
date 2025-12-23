import { AppController } from './controllers/AppController.js';

const LIFF_ID = '2008611458-kaP7KYRo';
let userProfile = null;

/**
 * アプリケーションのエントリーポイント
 */
stener('DOMContentLoaded', async () => {
    try {
        // LIFFの初期化
        await liff.init({ liffId: LIFF_ID });
        
        // ログイン状態を確認
        if (!liff.isLoggedIn()) {
            // 未ログインの場合はログインページへリダイレクト
            window.location.href = 'login.html';
            return;
        }
        
        // プロフィール情報を取得
        userProfile = await liff.getProfile();
        console.log('ユーザープロフィール:', userProfile);
        
        // プロフィール表示
        displayUserProfile();

        // アプリケーションコントローラーを初期化
        const app = new AppController();
        
        // グローバルに公開
        window.app = app;
        window.userProfile = userProfile;
        
        console.log('シフト管理アプリケーションが起動しました');
        
    } catch (error) {
        console.error('LIFF初期化エラー:', error);
        alert('アプリケーションの初期化に失敗しました');
    }
});

function displayUserProfile() {
    if (!userProfile) return;
    
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (userInfo && userAvatar && userName) {
        userAvatar.src = userProfile.pictureUrl || 'https://via.placeholder.com/32';
        userName.textContent = userProfile.displayName;
        userInfo.style.display = 'flex';
    }
}