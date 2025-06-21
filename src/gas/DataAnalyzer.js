/**
 * GM001 DataAnalyzer - データ分析エンジン
 * プロジェクトコード: GM001
 */

class DataAnalyzer {
  constructor() {
    this.storage = new DataStorage();
  }

  /**
   * データの統計分析を実行
   * @param {Array} data - 分析対象データ
   * @returns {Object} 分析結果
   */
  analyzeData(data) {
    if (!data || data.length === 0) {
      return { error: 'No data to analyze' };
    }

    const analysis = {
      rowCount: data.length,
      columnCount: data[0] ? data[0].length : 0,
      statistics: {},
      patterns: [],
      recommendations: []
    };

    // 数値カラムの統計分析
    analysis.statistics = this.calculateStatistics(data);
    
    // パターン検出
    analysis.patterns = this.detectPatterns(data);
    
    // 推奨事項生成
    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  /**
   * 基本統計の計算
   * @param {Array} data - データ
   * @returns {Object} 統計結果
   */
  calculateStatistics(data) {
    const stats = {};
    
    // ヘッダー行を除いたデータ
    const dataRows = data.slice(1);
    
    if (dataRows.length === 0) return stats;
    
    // 各カラムの統計を計算
    for (let colIndex = 0; colIndex < data[0].length; colIndex++) {
      const columnName = data[0][colIndex] || `Column_${colIndex}`;
      const columnData = dataRows.map(row => row[colIndex]).filter(val => val !== null && val !== '');
      
      if (columnData.length === 0) continue;
      
      const numericData = columnData.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
      
      if (numericData.length > 0) {
        stats[columnName] = {
          type: 'numeric',
          count: numericData.length,
          min: Math.min(...numericData),
          max: Math.max(...numericData),
          average: numericData.reduce((a, b) => a + b, 0) / numericData.length,
          sum: numericData.reduce((a, b) => a + b, 0)
        };
      } else {
        stats[columnName] = {
          type: 'text',
          count: columnData.length,
          uniqueValues: [...new Set(columnData)].length
        };
      }
    }
    
    return stats;
  }

  /**
   * データパターンの検出
   * @param {Array} data - データ
   * @returns {Array} 検出されたパターン
   */
  detectPatterns(data) {
    const patterns = [];
    
    // 空の値のパターン
    const emptyRate = this.calculateEmptyRate(data);
    if (emptyRate > 0.1) {
      patterns.push({
        type: 'high_empty_rate',
        description: `${(emptyRate * 100).toFixed(1)}% of cells are empty`,
        severity: emptyRate > 0.3 ? 'high' : 'medium'
      });
    }
    
    return patterns;
  }

  /**
   * 推奨事項の生成
   * @param {Object} analysis - 分析結果
   * @returns {Array} 推奨事項
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.rowCount < 100) {
      recommendations.push({
        type: 'data_volume',
        message: 'データ量が少ないため、より精度の高い分析のためにデータを追加することを推奨します。'
      });
    }
    
    return recommendations;
  }

  /**
   * 空の値の率を計算
   * @param {Array} data - データ
   * @returns {number} 空の値の率
   */
  calculateEmptyRate(data) {
    if (!data || data.length === 0) return 1;
    
    let totalCells = 0;
    let emptyCells = 0;
    
    data.forEach(row => {
      if (Array.isArray(row)) {
        row.forEach(cell => {
          totalCells++;
          if (cell === null || cell === undefined || cell === '') {
            emptyCells++;
          }
        });
      }
    });
    
    return totalCells > 0 ? emptyCells / totalCells : 0;
  }
}