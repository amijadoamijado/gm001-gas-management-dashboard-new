/**
 * GM001 RealtimeController - リアルタイム更新制御
 * プロジェクトコード: GM001
 */

class RealtimeController {
  constructor() {
    this.storage = new DataStorage();
    this.updateManager = new RealtimeUpdateManager();
  }

  /**
   * リアルタイム更新開始
   * @param {string} dataSource - データソース
   * @param {number} intervalMinutes - 更新間隔（分）
   * @returns {Object} 開始結果
   */
  startRealtimeUpdate(dataSource, intervalMinutes = 5) {
    try {
      // 既存のトリガーを削除
      this.stopRealtimeUpdate();
      
      // 新しいトリガーを作成
      const trigger = ScriptApp.newTrigger('executeRealtimeUpdate')
        .timeBased()
        .everyMinutes(intervalMinutes)
        .create();
      
      // トリガー情報を保存
      const properties = PropertiesService.getScriptProperties();
      properties.setProperties({
        'REALTIME_TRIGGER_ID': trigger.getUniqueId(),
        'REALTIME_DATA_SOURCE': dataSource,
        'REALTIME_INTERVAL': intervalMinutes.toString()
      });
      
      return {
        success: true,
        triggerId: trigger.getUniqueId(),
        interval: intervalMinutes,
        dataSource: dataSource
      };
    } catch (error) {
      console.error('Realtime update start error:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * リアルタイム更新停止
   * @returns {Object} 停止結果
   */
  stopRealtimeUpdate() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const triggerId = properties.getProperty('REALTIME_TRIGGER_ID');
      
      if (triggerId) {
        const triggers = ScriptApp.getProjectTriggers();
        triggers.forEach(trigger => {
          if (trigger.getUniqueId() === triggerId) {
            ScriptApp.deleteTrigger(trigger);
          }
        });
        
        properties.deleteProperty('REALTIME_TRIGGER_ID');
      }
      
      return {
        success: true,
        message: 'Realtime update stopped'
      };
    } catch (error) {
      console.error('Realtime update stop error:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * リアルタイム更新実行（トリガー関数）
   */
  executeRealtimeUpdate() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const dataSource = properties.getProperty('REALTIME_DATA_SOURCE');
      
      if (!dataSource) {
        console.error('No data source specified for realtime update');
        return;
      }
      
      // データ更新実行
      const updateResult = this.updateManager.updateData(dataSource);
      
      // 更新結果をログに記録
      console.log('Realtime update executed:', updateResult);
      
      // 更新時刻を記録
      properties.setProperty('LAST_REALTIME_UPDATE', new Date().toISOString());
      
    } catch (error) {
      console.error('Realtime update execution error:', error);
    }
  }

  /**
   * リアルタイム更新状態取得
   * @returns {Object} 状態情報
   */
  getStatus() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const triggerId = properties.getProperty('REALTIME_TRIGGER_ID');
      const dataSource = properties.getProperty('REALTIME_DATA_SOURCE');
      const interval = properties.getProperty('REALTIME_INTERVAL');
      const lastUpdate = properties.getProperty('LAST_REALTIME_UPDATE');
      
      return {
        isActive: !!triggerId,
        triggerId: triggerId,
        dataSource: dataSource,
        interval: interval ? parseInt(interval) : null,
        lastUpdate: lastUpdate
      };
    } catch (error) {
      console.error('Status get error:', error);
      return {
        isActive: false,
        error: error.toString()
      };
    }
  }
}