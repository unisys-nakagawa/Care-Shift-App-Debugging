// LIFF IDを設定（LINE Developersコンソールから取得）
const LIFF_ID = '2008611458-kaP7KYRo'; // ここにLIFF IDを設定してください

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    
    try {
        // LIFF IDが設定されていない場合
        if (LIFF_ID === 'YOUR_LIFF_ID_HERE') {
            showError('LIFF IDが設定されていません。コード内のLIFF_IDを更新してください。');
            showLoading(false);
            return;
        }

        // LIFFの初期化（自動ログイン有効）
        await liff.init({ 
            liffId: LIFF_ID,
            withLoginOnExternalBrowser: true // 外部ブラウザでも自動ログイン
        });
        
        // ログイン状態の確認
        if (liff.isLoggedIn()) {
            await displayUserProfile();
        } else {
            // 自動的にログイン処理を実行
            liff.login();
        }
    } catch (error) {
        console.error('LIFF初期化エラー:', error);
        showError('LIFFの初期化に失敗しました: ' + error.message);
    }
    
    showLoading(false);
});

// ログイン処理
async function login() {
    try {
        if (!liff.isLoggedIn()) {
            // LINEログイン画面へリダイレクト
            liff.login();
        }
    } catch (error) {
        console.error('ログインエラー:', error);
        showError('ログインに失敗しました: ' + error.message);
    }
}

// ログアウト処理
function logout() {
    if (confirm('ログアウトしますか?')) {
        liff.logout();
        window.location.reload();
    }
}

// ユーザープロフィールの取得と表示
async function displayUserProfile() {
    try {
        const profile = await liff.getProfile();
        
        // プロフィール情報を表示
        document.getElementById('userPicture').src = profile.pictureUrl || 'https://via.placeholder.com/80';
        document.getElementById('userName').textContent = profile.displayName;
        document.getElementById('userId').textContent = profile.userId.substring(0, 15) + '...';
        document.getElementById('userStatus').textContent = profile.statusMessage || 'ステータスメッセージなし';
        
        // プロフィール画面を表示
        showProfileView();
        
        // コンソールにIDトークンを出力（開発用）
        const idToken = liff.getIDToken();
        console.log('ID Token:', idToken);
        
        // アクセストークンの取得（開発用）
        const accessToken = liff.getAccessToken();
        console.log('Access Token:', accessToken);
        
    } catch (error) {
        console.error('プロフィール取得エラー:', error);
        showError('プロフィールの取得に失敗しました: ' + error.message);
    }
}

// ビュー切り替え
function showLoginView() {
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('profileView').style.display = 'none';
}

function showProfileView() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('profileView').style.display = 'block';
}

// ローディング表示
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

// エラー表示
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    // 5秒後に自動で非表示
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// LIFF環境の確認（デバッグ用）
function checkLiffEnvironment() {
    console.log('LIFF環境情報:');
    console.log('- isInClient:', liff.isInClient());
    console.log('- isLoggedIn:', liff.isLoggedIn());
    console.log('- OS:', liff.getOS());
    console.log('- Language:', liff.getLanguage());
    console.log('- Version:', liff.getVersion());
    console.log('- LineVersion:', liff.getLineVersion());
}

// シフトアプリへのページ遷移
function goToShiftApp() {
    window.location.href = '../shift/ShiftApp.html';
}