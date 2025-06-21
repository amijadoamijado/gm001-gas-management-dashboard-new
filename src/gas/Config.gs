// GM001 - 経営ダッシュボード設定管理
// 旧DM001から移行・統一

/**
 * システム設定管理クラス
 * 経営ダッシュボードの基本設定を管理
 */
class Config {
  constructor() {
    this.APP_NAME = 'GM001-経営ダッシュボード';
    this.VERSION = '2.0.0';
    this.PROJECT_CODE = 'GM001';
  }
  
  /**
   * スプレッドシート設定
   */
  static getSpreadsheetConfig() {
    return {
      mainSheetId: PropertiesService.getScriptProperties().getProperty('MAIN_SHEET_ID'),
      dataSheetId: PropertiesService.getScriptProperties().getProperty('DATA_SHEET_ID'),
      configSheetId: PropertiesService.getScriptProperties().getProperty('CONFIG_SHEET_ID')
    };
  }
  
  /**
   * API設定
   */
  static getApiConfig() {
    return {
      baseUrl: PropertiesService.getScriptProperties().getProperty('API_BASE_URL'),
      apiKey: PropertiesService.getScriptProperties().getProperty('API_KEY'),
      timeout: 30000
    };
  }
  
  /**
   * 通知設定
   */
  static getNotificationConfig() {
    return {
      emailRecipients: PropertiesService.getScriptProperties().getProperty('EMAIL_RECIPIENTS'),
      slackWebhook: PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK'),
      enableNotifications: PropertiesService.getScriptProperties().getProperty('ENABLE_NOTIFICATIONS') === 'true'
    };
  }
  
  /**
   * ダッシュボード設定
   */
  static getDashboardConfig() {
    return {
      refreshInterval: 300000, // 5分
      maxDataPoints: 1000,
      chartType: 'line',
      enableRealtime: true
    };
  }
}