/**
 * GM001 ValidationEngine - データ検証エンジン
 * プロジェクトコード: GM001
 */

class ValidationEngine {
  constructor() {
    this.rules = {};
    this.loadValidationRules();
  }

  /**
   * データ検証実行
   * @param {Array} data - 検証対象データ
   * @param {string} ruleName - 検証ルール名
   * @returns {Object} 検証結果
   */
  validateData(data, ruleName = 'default') {
    if (!data || data.length === 0) {
      return {
        isValid: false,
        errors: ['No data to validate'],
        warnings: [],
        score: 0
      };
    }

    const rule = this.rules[ruleName] || this.rules['default'];
    if (!rule) {
      return {
        isValid: false,
        errors: ['Validation rule not found'],
        warnings: [],
        score: 0
      };
    }

    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 100,
      details: []
    };

    // 各検証ルールを適用
    rule.checks.forEach(check => {
      const checkResult = this.executeValidationCheck(data, check);
      
      if (checkResult.errors.length > 0) {
        result.errors.push(...checkResult.errors);
        result.isValid = false;
        result.score -= check.penalty || 10;
      }
      
      if (checkResult.warnings.length > 0) {
        result.warnings.push(...checkResult.warnings);
        result.score -= (check.penalty || 10) / 2;
      }
      
      result.details.push({
        checkName: check.name,
        passed: checkResult.errors.length === 0,
        errors: checkResult.errors,
        warnings: checkResult.warnings
      });
    });

    result.score = Math.max(result.score, 0);
    return result;
  }

  /**
   * 個別検証チェック実行
   * @param {Array} data - データ
   * @param {Object} check - チェックルール
   * @returns {Object} チェック結果
   */
  executeValidationCheck(data, check) {
    const result = {
      errors: [],
      warnings: []
    };

    switch (check.type) {
      case 'required_columns':
        const missingColumns = this.checkRequiredColumns(data, check.columns);
        if (missingColumns.length > 0) {
          result.errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
        }
        break;
        
      case 'data_types':
        const typeErrors = this.checkDataTypes(data, check.rules);
        result.errors.push(...typeErrors);
        break;
        
      case 'value_range':
        const rangeErrors = this.checkValueRanges(data, check.ranges);
        result.errors.push(...rangeErrors);
        break;
        
      case 'uniqueness':
        const duplicateErrors = this.checkUniqueness(data, check.columns);
        result.errors.push(...duplicateErrors);
        break;
        
      case 'completeness':
        const completenessIssues = this.checkCompleteness(data, check.threshold);
        if (completenessIssues.emptyRate > check.threshold) {
          result.warnings.push(`High empty rate: ${(completenessIssues.emptyRate * 100).toFixed(1)}%`);
        }
        break;
    }

    return result;
  }

  /**
   * 必須カラムチェック
   * @param {Array} data - データ
   * @param {Array} requiredColumns - 必須カラム
   * @returns {Array} 不足カラム
   */
  checkRequiredColumns(data, requiredColumns) {
    if (!data || data.length === 0) return requiredColumns;
    
    const headers = data[0] || [];
    return requiredColumns.filter(col => !headers.includes(col));
  }

  /**
   * データ型チェック
   * @param {Array} data - データ
   * @param {Object} typeRules - 型ルール
   * @returns {Array} 型エラー
   */
  checkDataTypes(data, typeRules) {
    const errors = [];
    
    if (!data || data.length < 2) return errors;
    
    const headers = data[0];
    const dataRows = data.slice(1);
    
    Object.entries(typeRules).forEach(([columnName, expectedType]) => {
      const columnIndex = headers.indexOf(columnName);
      if (columnIndex === -1) return;
      
      dataRows.forEach((row, rowIndex) => {
        const value = row[columnIndex];
        if (value !== null && value !== undefined && value !== '') {
          const isValid = this.validateDataType(value, expectedType);
          if (!isValid) {
            errors.push(`Row ${rowIndex + 2}, Column '${columnName}': Expected ${expectedType}, got '${value}'`);
          }
        }
      });
    });
    
    return errors;
  }

  /**
   * 個別データ型検証
   * @param {*} value - 値
   * @param {string} expectedType - 期待型
   * @returns {boolean} 有効かどうか
   */
  validateDataType(value, expectedType) {
    switch (expectedType.toLowerCase()) {
      case 'number':
        return !isNaN(parseFloat(value));
      case 'date':
        return !isNaN(Date.parse(value));
      case 'string':
        return typeof value === 'string';
      case 'boolean':
        return value === true || value === false || value === 'true' || value === 'false';
      default:
        return true;
    }
  }

  /**
   * 値範囲チェック
   * @param {Array} data - データ
   * @param {Object} ranges - 範囲ルール
   * @returns {Array} 範囲エラー
   */
  checkValueRanges(data, ranges) {
    const errors = [];
    // 範囲チェックの実装
    return errors;
  }

  /**
   * 一意性チェック
   * @param {Array} data - データ
   * @param {Array} uniqueColumns - 一意性が必要なカラム
   * @returns {Array} 重複エラー
   */
  checkUniqueness(data, uniqueColumns) {
    const errors = [];
    // 一意性チェックの実装
    return errors;
  }

  /**
   * 完全性チェック
   * @param {Array} data - データ
   * @param {number} threshold - 闾値
   * @returns {Object} 完全性情報
   */
  checkCompleteness(data, threshold) {
    if (!data || data.length === 0) {
      return { emptyRate: 1, totalCells: 0, emptyCells: 0 };
    }
    
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
    
    return {
      emptyRate: totalCells > 0 ? emptyCells / totalCells : 0,
      totalCells: totalCells,
      emptyCells: emptyCells
    };
  }

  /**
   * 検証ルール読み込み
   */
  loadValidationRules() {
    // デフォルトルールを設定
    this.rules = {
      'default': {
        name: '基本検証',
        checks: [
          {
            name: 'データ存在チェック',
            type: 'completeness',
            threshold: 0.5,
            penalty: 20
          }
        ]
      }
    };
  }
}