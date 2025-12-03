# 介護スタッフ向けシフト管理アプリ

## プロジェクト概要

介護スタッフのシフト管理を効率化するWebアプリケーションのプロトタイプです。

## ディレクトリ構造

```
shift-app/
├── index.html              # エントリーポイント
├── css/
│   └── style.css          # スタイルシート
└── js/
    ├── app.js             # アプリケーション起動
    ├── models/            # データモデル
    │   ├── Staff.js       # スタッフモデル
    │   └── Shift.js       # シフトモデル
    ├── views/             # UI表示
    │   ├── CalendarView.js    # カレンダー表示
    │   ├── StaffListView.js   # スタッフリスト表示
    │   └── ModalView.js       # モーダル表示
    └── controllers/       # ロジック制御
        └── AppController.js   # アプリケーション制御
```

## 主要機能

### 1. 視点切り替え
- **スタッフ視点**: 自分のシフトと募集中シフトを確認
- **調整者視点**: 全スタッフのシフトを管理・調整

### 2. カレンダー表示
- 月間カレンダー形式でシフトを表示
- 日付クリックで詳細表示
- ステータス別の色分け（確定/未確定/募集中/勤務可）

### 3. スタッフ管理
- スタッフ情報の表示（資格、経験、スキル）
- スキルによる検索機能（今後実装予定）

### 4. シフト詳細
- モーダルでシフト詳細を表示
- スタッフ情報と募集条件の確認

## 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: レスポンシブデザイン、Flexbox、Grid
- **JavaScript (ES6 Modules)**: クラスベースのオブジェクト指向設計

## クラス設計

### Models（データ層）

#### Staff クラス
```javascript
- プロパティ: id, name, skills, experience, gender
- メソッド: hasSkill(), hasAllSkills(), toString()
```

#### StaffManager クラス
```javascript
- スタッフの追加、取得、検索
- サンプルデータのロード
```

#### Shift クラス
```javascript
- プロパティ: date, time, status, staffId, facility, requirements
- メソッド: isConfirmed(), isRecruiting(), hasStaff(), assignStaff()
```

#### ShiftManager クラス
```javascript
- シフトの追加、取得、検索
- 日付範囲指定、スタッフ指定での取得
- サンプルデータのロード
```

### Views（表示層）

#### CalendarView クラス
```javascript
- カレンダーのレンダリング
- 日付クリックイベントの管理
```

#### StaffListView クラス
```javascript
- スタッフリストのレンダリング
- 表示/非表示の切り替え
```

#### ModalView クラス
```javascript
- シフト詳細モーダルの表示
- モーダルの開閉管理
```

### Controllers（制御層）

#### AppController クラス
```javascript
- モデルとビューの仲介
- 視点切り替えの制御
- イベントハンドリング
- アプリケーション全体の状態管理
```

## 今後の拡張予定

### 機能追加
- [ ] シフトの追加・編集・削除機能
- [ ] スタッフの追加・編集機能
- [ ] スキルマッチング機能
- [ ] シフト応募機能
- [ ] 通知機能
- [ ] データの永続化（LocalStorage/API）
- [ ] 月の切り替え機能
- [ ] フィルター・検索機能

### 技術的改善
- [ ] TypeScriptへの移行
- [ ] ユニットテストの追加
- [ ] API連携
- [ ] 状態管理ライブラリの導入
- [ ] バンドラーの導入（Webpack/Vite）

## 注意事項

- 現在はサンプルデータで動作
- データの永続化は未実装
- 一部の機能（応募、編集、削除）は表示のみです
- プロトタイプ版のため、ライセンスは未定