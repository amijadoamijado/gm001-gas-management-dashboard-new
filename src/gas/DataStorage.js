/**
 * GM001 DataStorage - データ保存・管理システム
 * プロジェクトコード: GM001
 */

class DataStorage {
  constructor() {
    this.spreadsheetId = CONFIG.SPREADSHEET_ID;
    this.spreadsheet = SpreadsheetApp.openById(this.spreadsheetId);
  }

  /**
   * データをスプレッドシートに保存
   * @param {string} sheetName - シート名
   * @param {Array} data - 保存するデータ
   * @returns {boolean} 成功/失敗
   */
  saveData(sheetName, data) {
    try {
      let sheet = this.spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = this.spreadsheet.insertSheet(sheetName);
      }
      
      // 既存データをクリア
      sheet.clear();
      
      // 新しいデータを設定
      if (data && data.length > 0) {
        sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
      }
      
      return true;
    } catch (error) {
      console.error('Data save error:', error);
      return false;
    }
  }

  /**
   * スプレッドシートからデータを取得
   * @param {string} sheetName - シート名
   * @returns {Array} データ配列
   */
  getData(sheetName) {
    try {
      const sheet = this.spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        return [];
      }
      
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      
      if (lastRow === 0 || lastCol === 0) {
        return [];
      }
      
      return sheet.getRange(1, 1, lastRow, lastCol).getValues();
    } catch (error) {
      console.error('Data get error:', error);
      return [];
    }
  }

  /**
   * メタデータの保存
   * @param {Object} metadata - メタデータ
   */
  saveMetadata(metadata) {
    try {
      const properties = PropertiesService.getScriptProperties();
      properties.setProperties({
        'LAST_UPDATE': new Date().toISOString(),
        'METADATA': JSON.stringify(metadata)
      });
    } catch (error) {
      console.error('Metadata save error:', error);
    }
  }

  /**
   * メタデータの取得
   * @returns {Object} メタデータ
   */
  getMetadata() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const metadataString = properties.getProperty('METADATA');
      return metadataString ? JSON.parse(metadataString) : {};
    } catch (error) {
      console.error('Metadata get error:', error);
      return {};
    }
  }
}