// GM001 - 経営ダッシュボード ユーティリティ
// 旧DM001から移行・統一

/**
 * ユーティリティ関数集
 * GM001経営ダッシュボードで使用する共通関数
 */
class Utils {
  
  /**
   * 日付フォーマット
   */
  static formatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
    if (!date) return '';
    return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), format);
  }
  
  /**
   * 数値フォーマット（通貨）
   */
  static formatCurrency(value, currency = 'JPY') {
    if (value === null || value === undefined) return '¥0';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency
    }).format(value);
  }
  
  /**
   * パーセンテージフォーマット
   */
  static formatPercentage(value, decimals = 2) {
    if (value === null || value === undefined) return '0.00%';
    return (value * 100).toFixed(decimals) + '%';
  }
  
  /**
   * 安全なJSON解析
   */
  static safeJsonParse(jsonString, defaultValue = {}) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON解析エラー:', error);
      return defaultValue;
    }
  }
  
  /**
   * エラーハンドリング
   */
  static handleError(error, context = 'GM001') {
    const errorMsg = `[${context}] エラー: ${error.message}`;
    console.error(errorMsg);
    console.error(error.stack);
    
    // 必要に応じて通知
    if (Config.getNotificationConfig().enableNotifications) {
      this.sendErrorNotification(errorMsg);
    }
  }
  
  /**
   * エラー通知送信
   */
  static sendErrorNotification(message) {
    try {
      const config = Config.getNotificationConfig();
      if (config.emailRecipients) {
        MailApp.sendEmail({
          to: config.emailRecipients,
          subject: '[GM001] システムエラー通知',
          body: message
        });
      }
    } catch (notificationError) {
      console.error('通知送信エラー:', notificationError);
    }
  }
  
  /**
   * データ検証
   */
  static validateData(data, schema) {
    // 基本的なデータ検証
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    for (const field in schema) {
      if (schema[field].required && !data[field]) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * キャッシュ管理
   */
  static getCache(key, ttl = 300) {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(key);
    
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < ttl * 1000) {
        return data.value;
      }
    }
    
    return null;
  }
  
  static setCache(key, value, ttl = 300) {
    const cache = CacheService.getScriptCache();
    const data = {
      value: value,
      timestamp: Date.now()
    };
    cache.put(key, JSON.stringify(data), ttl);
  }
}