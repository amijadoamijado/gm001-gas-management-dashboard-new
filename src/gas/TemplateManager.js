/**
 * GM001 TemplateManager - テンプレート管理システム
 * プロジェクトコード: GM001
 */

class TemplateManager {
  constructor() {
    this.storage = new DataStorage();
    this.templates = {};
  }

  /**
   * テンプレート作成
   * @param {string} name - テンプレート名
   * @param {Object} structure - テンプレート構造
   * @returns {Object} 作成結果
   */
  createTemplate(name, structure) {
    try {
      const template = {
        id: this.generateTemplateId(),
        name: name,
        structure: structure,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        isActive: true
      };

      this.templates[template.id] = template;
      this.saveTemplates();

      return {
        success: true,
        templateId: template.id,
        template: template
      };
    } catch (error) {
      console.error('Template creation error:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * テンプレート適用
   * @param {string} templateId - テンプレートID
   * @param {Array} data - 適用対象データ
   * @returns {Object} 適用結果
   */
  applyTemplate(templateId, data) {
    try {
      const template = this.templates[templateId];
      if (!template) {
        throw new Error('Template not found');
      }

      const result = this.transformDataWithTemplate(data, template.structure);
      
      return {
        success: true,
        transformedData: result,
        templateUsed: template.name
      };
    } catch (error) {
      console.error('Template application error:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * テンプレートでデータ変換
   * @param {Array} data - 元データ
   * @param {Object} structure - テンプレート構造
   * @returns {Array} 変換後データ
   */
  transformDataWithTemplate(data, structure) {
    if (!data || data.length === 0) return [];
    
    const transformedData = [];
    const headers = structure.outputColumns || [];
    
    // ヘッダー行を追加
    transformedData.push(headers);
    
    // データ行を変換
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const transformedRow = [];
      
      structure.mappingRules.forEach(rule => {
        let value = '';
        
        if (rule.type === 'direct') {
          value = row[rule.sourceIndex] || '';
        } else if (rule.type === 'calculated') {
          value = this.calculateValue(row, rule.formula);
        } else if (rule.type === 'constant') {
          value = rule.value;
        }
        
        transformedRow.push(value);
      });
      
      transformedData.push(transformedRow);
    }
    
    return transformedData;
  }

  /**
   * 計算値の算出
   * @param {Array} row - データ行
   * @param {string} formula - 計算式
   * @returns {*} 計算結果
   */
  calculateValue(row, formula) {
    try {
      // 簡単な計算式の実装
      if (formula.includes('+')) {
        const parts = formula.split('+');
        return parts.reduce((sum, part) => {
          const index = parseInt(part.trim());
          return sum + (parseFloat(row[index]) || 0);
        }, 0);
      }
      
      return formula;
    } catch (error) {
      console.error('Calculation error:', error);
      return '';
    }
  }

  /**
   * テンプレートID生成
   * @returns {string} ユニークID
   */
  generateTemplateId() {
    return 'template_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * テンプレート保存
   */
  saveTemplates() {
    try {
      const properties = PropertiesService.getScriptProperties();
      properties.setProperty('DATA_TEMPLATES', JSON.stringify(this.templates));
    } catch (error) {
      console.error('Template save error:', error);
    }
  }

  /**
   * テンプレート読み込み
   */
  loadTemplates() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const templatesString = properties.getProperty('DATA_TEMPLATES');
      this.templates = templatesString ? JSON.parse(templatesString) : {};
    } catch (error) {
      console.error('Template load error:', error);
      this.templates = {};
    }
  }

  /**
   * 利用可能テンプレート一覧取得
   * @returns {Array} テンプレート一覧
   */
  getAvailableTemplates() {
    this.loadTemplates();
    return Object.values(this.templates).filter(template => template.isActive);
  }
}