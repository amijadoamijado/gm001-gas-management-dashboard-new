/**
 * GM001 GAS Management Dashboard - メインエントリーポイント
 * プロジェクトコード: GM001
 * 移行日: 2025-06-21
 */

// グローバル設定
const CONFIG = {
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  FOLDER_ID: PropertiesService.getScriptProperties().getProperty('FOLDER_ID'),
  MAX_ROWS: 10000,
  CACHE_DURATION: 600, // 10分
};

/**
 * Webアプリケーションのエントリーポイント
 */
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('GM001 経営ダッシュボード')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ファイルアップロード処理
 * @param {Object} fileData - アップロードされたファイルデータ
 * @returns {Object} 処理結果
 */
function uploadFile(fileData) {
  try {
    const blob = Utilities.newBlob(Utilities.base64Decode(fileData.content), fileData.mimeType, fileData.name);
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const file = folder.createFile(blob);
    
    // ファイル解析を開始
    const analysisResult = analyzeExcelFile(file.getId());
    
    return {
      success: true,
      fileId: file.getId(),
      fileName: file.getName(),
      analysis: analysisResult
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * includeメソッド（HTMLテンプレート用）
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}