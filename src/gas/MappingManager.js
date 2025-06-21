/**
 * GM001 MappingManager - データマッピング管理システム
 * プロジェクトコード: GM001
 */

class MappingManager {
  constructor() {
    this.storage = new DataStorage();
    this.mappings = {};
  }

  /**
   * データマッピングを作成
   * @param {string} sourceName - ソース名
   * @param {Array} sourceColumns - ソースカラム
   * @param {Array} targetColumns - ターゲットカラム
   * @returns {Object} マッピング結果
   */
  createMapping(sourceName, sourceColumns, targetColumns) {
    try {
      const mapping = {
        id: this.generateMappingId(),
        sourceName: sourceName,
        sourceColumns: sourceColumns,
        targetColumns: targetColumns,
        mappingRules: this.generateAutoMapping(sourceColumns, targetColumns),
        createdAt: new Date().toISOString(),
        isActive: true
      };

      this.mappings[mapping.id] = mapping;
      this.saveMappings();

      return {
        success: true,
        mappingId: mapping.id,
        mapping: mapping
      };
    } catch (error) {
      console.error('Mapping creation error:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * 自動マッピングルール生成
   * @param {Array} sourceColumns - ソースカラム
   * @param {Array} targetColumns - ターゲットカラム
   * @returns {Array} マッピングルール
   */
  generateAutoMapping(sourceColumns, targetColumns) {
    const rules = [];
    const commonMappings = {
      '日付': ['date', 'day', '日時'],
      '金額': ['amount', 'price', '価格', '金額'],
      '数量': ['quantity', 'count', '個数'],
      '名前': ['name', 'title', '名称']
    };

    sourceColumns.forEach((sourceCol, sourceIndex) => {
      targetColumns.forEach((targetCol, targetIndex) => {
        const similarity = this.calculateSimilarity(sourceCol, targetCol);
        if (similarity > 0.7) {
          rules.push({
            sourceIndex: sourceIndex,
            targetIndex: targetIndex,
            sourceColumn: sourceCol,
            targetColumn: targetCol,
            confidence: similarity,
            rule: 'direct_mapping'
          });
        }
      });
    });

    return rules;
  }

  /**
   * 文字列の類似度計算
   * @param {string} str1 - 文字列1
   * @param {string} str2 - 文字列2
   * @returns {number} 類似度（0-1）
   */
  calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // レーベンシュタイン距離を簡略化
    const maxLength = Math.max(s1.length, s2.length);
    const distance = this.levenshteinDistance(s1, s2);
    return 1 - (distance / maxLength);
  }

  /**
   * レーベンシュタイン距離計算
   * @param {string} str1 - 文字列1
   * @param {string} str2 - 文字列2
   * @returns {number} 距離
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * マッピングID生成
   * @returns {string} ユニークID
   */
  generateMappingId() {
    return 'mapping_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * マッピング保存
   */
  saveMappings() {
    try {
      const properties = PropertiesService.getScriptProperties();
      properties.setProperty('DATA_MAPPINGS', JSON.stringify(this.mappings));
    } catch (error) {
      console.error('Mapping save error:', error);
    }
  }

  /**
   * マッピング読み込み
   */
  loadMappings() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const mappingsString = properties.getProperty('DATA_MAPPINGS');
      this.mappings = mappingsString ? JSON.parse(mappingsString) : {};
    } catch (error) {
      console.error('Mapping load error:', error);
      this.mappings = {};
    }
  }
}