# GM001-gas-management-dashboard

## プロジェクトID: GM001
## カテゴリ: Google Apps Script Management Dashboard（ダッシュボード系）
## 開発開始: 2024-01-15
## ステータス: Active
## 統一形式移行: 2025-06-21

### 概要
Google Apps Scriptベースの経営ダッシュボード。リアルタイムでビジネスメトリクスを可視化し、経営判断をサポート。

### 主な機能
- **リアルタイムダッシュボード**: 主要KPIの自動更新と表示
- **データ統合**: 複数のデータソースから自動収集
- **カスタマイズ可能**: ドラッグ&ドロップでウィジェット配置
- **アラート機能**: 閾値超過時の自動通知
- **レポート自動生成**: 定期レポートの自動作成と配信

### 技術スタック
- **フロントエンド**: Google Apps Script (HTML Service) + Chart.js
- **バックエンド**: Google Apps Script
- **データベース**: Google Sheets
- **データソース**: Google Analytics, Salesforce API等

### 成果
- 経営判断のスピード向上
- データドリブンな意思決定の実現
- レポート作成工数の削減

### プロジェクト構造
```
gm001-gas-management-dashboard/
├── src/
│   ├── main.gs              # メインスクリプト
│   ├── dataCollector.gs     # データ収集ロジック
│   ├── dashboardUI.gs       # ダッシュボードUI
│   └── widgets/            # 各種ウィジェット
├── assets/
│   ├── styles.css          # スタイルシート
│   └── charts/             # グラフコンポーネント
└── README.md
```

### 関連リンク
- **GitHub**: https://github.com/amijadoamijado/gm001-gas-management-dashboard-new
- **関連プロジェクト**: RF001-gas-report-formatter-pro
- **旧リポジトリ**: gas-management-dashboard（DM001から移行）

### 統一形式移行履歴
- **2025-06-21**: DM001からGM001へプロジェクトコード統一
- **プロジェクト名**: gas-management-dashboard → gm001-gas-management-dashboard
- **目的**: リポジトリ命名規則統一・管理効率向上