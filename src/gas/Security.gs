// GM001 - 経営ダッシュボード セキュリティ管理
// 旧DM001から移行・統一

/**
 * セキュリティ管理クラス
 * GM001経営ダッシュボードのセキュリティ機能
 */
class Security {
  
  /**
   * ユーザー認証
   */
  static authenticateUser() {
    const user = Session.getActiveUser();
    const email = user.getEmail();
    
    if (!email) {
      throw new Error('認証エラー: ユーザーが特定できません');
    }
    
    const authorizedUsers = this.getAuthorizedUsers();
    if (!authorizedUsers.includes(email)) {
      throw new Error(`認証エラー: 権限がありません (${email})`);
    }
    
    return {
      email: email,
      isAuthenticated: true,
      permissions: this.getUserPermissions(email)
    };
  }
  
  /**
   * 認証済みユーザーリスト取得
   */
  static getAuthorizedUsers() {
    const authorizedEmails = PropertiesService.getScriptProperties().getProperty('AUTHORIZED_USERS');
    return authorizedEmails ? authorizedEmails.split(',') : [];
  }
  
  /**
   * ユーザー権限取得
   */
  static getUserPermissions(email) {
    const permissions = PropertiesService.getScriptProperties().getProperty(`PERMISSIONS_${email}`);
    return permissions ? permissions.split(',') : ['read'];
  }
  
  /**
   * 権限チェック
   */
  static hasPermission(requiredPermission) {
    try {
      const user = this.authenticateUser();
      return user.permissions.includes(requiredPermission) || user.permissions.includes('admin');
    } catch (error) {
      console.error('権限チェックエラー:', error);
      return false;
    }
  }
  
  /**
   * 管理者権限チェック
   */
  static isAdmin() {
    return this.hasPermission('admin');
  }
  
  /**
   * 操作ログ記録
   */
  static logOperation(operation, details = {}) {
    try {
      const user = Session.getActiveUser();
      const logEntry = {
        timestamp: new Date().toISOString(),
        user: user.getEmail(),
        operation: operation,
        details: details,
        projectCode: 'GM001'
      };
      
      // ログシートに記録
      this.writeToLogSheet(logEntry);
      
    } catch (error) {
      console.error('操作ログ記録エラー:', error);
    }
  }
  
  /**
   * ログシートへの書き込み
   */
  static writeToLogSheet(logEntry) {
    try {
      const logSheetId = PropertiesService.getScriptProperties().getProperty('LOG_SHEET_ID');
      if (!logSheetId) return;
      
      const sheet = SpreadsheetApp.openById(logSheetId).getActiveSheet();
      sheet.appendRow([
        logEntry.timestamp,
        logEntry.user,
        logEntry.operation,
        JSON.stringify(logEntry.details),
        logEntry.projectCode
      ]);
      
    } catch (error) {
      console.error('ログシート書き込みエラー:', error);
    }
  }
  
  /**
   * センシティブデータの暗号化
   */
  static encryptSensitiveData(data) {
    try {
      // 簡易暗号化（実用時はより強固な方法を推奨）
      const encrypted = Utilities.base64Encode(JSON.stringify(data));
      return encrypted;
    } catch (error) {
      console.error('データ暗号化エラー:', error);
      return null;
    }
  }
  
  /**
   * センシティブデータの復号化
   */
  static decryptSensitiveData(encryptedData) {
    try {
      const decrypted = Utilities.base64Decode(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('データ復号化エラー:', error);
      return null;
    }
  }
  
  /**
   * セキュリティ監査
   */
  static performSecurityAudit() {
    const auditResults = {
      timestamp: new Date().toISOString(),
      projectCode: 'GM001',
      checks: []
    };
    
    // 基本的なセキュリティチェック
    auditResults.checks.push({
      name: '認証設定確認',
      status: this.getAuthorizedUsers().length > 0 ? 'PASS' : 'FAIL'
    });
    
    auditResults.checks.push({
      name: 'ログ機能確認',
      status: PropertiesService.getScriptProperties().getProperty('LOG_SHEET_ID') ? 'PASS' : 'FAIL'
    });
    
    // 監査結果をログに記録
    this.logOperation('SECURITY_AUDIT', auditResults);
    
    return auditResults;
  }
}