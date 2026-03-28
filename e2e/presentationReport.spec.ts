/**
 * PresentationReport 构建器测试
 * 纯函数单元测试（Node 环境，无需浏览器）
 */

import { test, expect } from '@playwright/test';
import { buildPresentationReport } from '../src/lib/ai/presentationReport';
import type { RecognitionResult } from '../src/types/ai';

// 加载 fixture (ES module compatible with type assertion)
import fixtureData from './fixtures/recognition-result.fixture.json' with { type: 'json' };
const fixture: RecognitionResult = fixtureData as RecognitionResult;

test.describe('buildPresentationReport', () => {
  test('should return deterministic output for same input', () => {
    const report1 = buildPresentationReport(fixture);
    const report2 = buildPresentationReport(fixture);
    
    expect(report1).toEqual(report2);
  });

  test('should have correct structure', () => {
    const report = buildPresentationReport(fixture);
    
    expect(report).toHaveProperty('headline');
    expect(report).toHaveProperty('confidenceBand');
    expect(report).toHaveProperty('confidence');
    expect(report).toHaveProperty('evidenceBullets');
    expect(report).toHaveProperty('crossView');
    expect(report).toHaveProperty('uncertainties');
    expect(report).toHaveProperty('nextShots');
  });

  test('headline should contain name, category, era, year', () => {
    const report = buildPresentationReport(fixture);
    
    expect(report.headline).toContain(fixture.name);
    expect(report.headline).toContain(fixture.category);
    expect(report.headline).toContain(fixture.era);
    expect(report.headline).toContain(fixture.year);
  });

  test('confidenceBand should match threshold', () => {
    const report = buildPresentationReport(fixture);
    
    // fixture confidence is 0.92, should be '高'
    expect(report.confidenceBand).toBe('高');
    expect(report.confidence).toBe(fixture.confidence);
  });

  test('evidenceBullets should have 3-8 items', () => {
    const report = buildPresentationReport(fixture);
    
    expect(report.evidenceBullets.length).toBeGreaterThanOrEqual(3);
    expect(report.evidenceBullets.length).toBeLessThanOrEqual(8);
  });

  test('evidenceBullets should not contain empty strings or undefined', () => {
    const report = buildPresentationReport(fixture);
    
    for (const bullet of report.evidenceBullets) {
      expect(bullet).not.toBe('');
      expect(bullet).not.toBeNull();
      expect(bullet).not.toBeUndefined();
      expect(typeof bullet).toBe('string');
    }
  });

  test('nextShots should have at least 3 items', () => {
    const report = buildPresentationReport(fixture);
    
    expect(report.nextShots.length).toBeGreaterThanOrEqual(3);
    expect(report.nextShots.length).toBeLessThanOrEqual(8);
  });

  test('crossView should have correct structure', () => {
    const report = buildPresentationReport(fixture);
    
    expect(report.crossView).toHaveProperty('imageCount');
    expect(report.crossView).toHaveProperty('consistency');
    expect(report.crossView).toHaveProperty('verdict');
    
    expect(typeof report.crossView.imageCount).toBe('number');
    expect(typeof report.crossView.consistency).toBe('number');
    expect(typeof report.crossView.verdict).toBe('string');
  });

  test('crossView verdict should be calibrated based on consistency', () => {
    const report = buildPresentationReport(fixture);
    
    // fixture has consistency 0.89 and imageCount 4
    expect(report.crossView.imageCount).toBe(4);
    expect(report.crossView.consistency).toBe(0.89);
    expect(report.crossView.verdict).toContain('一致性高');
  });

  test('should handle low confidence result', () => {
    const lowConfidenceFixture: RecognitionResult = {
      ...fixture,
      confidence: 0.55,
      fusion: {
        imageCount: 1,
        consistency: 0.60,
        crossViewSummary: '单视角识别',
      },
    };
    
    const report = buildPresentationReport(lowConfidenceFixture);
    
    expect(report.confidenceBand).toBe('低');
    expect(report.headline).toContain('初判');
    expect(report.headline).toContain('建议补拍确认');
  });

  test('should handle medium confidence result', () => {
    const mediumConfidenceFixture: RecognitionResult = {
      ...fixture,
      confidence: 0.75,
    };
    
    const report = buildPresentationReport(mediumConfidenceFixture);
    
    expect(report.confidenceBand).toBe('中');
    expect(report.headline).toContain('研判');
    expect(report.headline).toContain('较可能');
  });

  test('uncertainties should be relevant to data quality', () => {
    const lowQualityFixture: RecognitionResult = {
      ...fixture,
      confidence: 0.55,
      fusion: {
        imageCount: 1,
        consistency: 0.60,
        crossViewSummary: '单视角',
      },
      components: {
        ...fixture.components!,
        confidence: 0.60,
      },
    };
    
    const report = buildPresentationReport(lowQualityFixture);
    
    // Should have uncertainties about low confidence and single view
    const uncertaintiesText = report.uncertainties.join(' ');
    expect(uncertaintiesText).toContain('置信度偏低');
    expect(uncertaintiesText).toContain('视角数量不足');
  });

  test('evidence bullets should only derive from existing fields', () => {
    const minimalFixture: RecognitionResult = {
      name: '测试建筑',
      category: '民居',
      era: '明清',
      year: '未知',
      location: '未知',
      features: ['传统民居'],
      description: '测试描述',
      confidence: 0.70,
    };

    const report = buildPresentationReport(minimalFixture);

    // Should still work with minimal data
    expect(report.evidenceBullets.length).toBeGreaterThanOrEqual(1);
    expect(report.nextShots.length).toBeGreaterThanOrEqual(3);
  });

  // Guardrail tests
  test('should NOT include location uncertainty when location is specific (e.g., 北京)', () => {
    const report = buildPresentationReport(fixture);

    // fixture.location is '北京', should NOT trigger location uncertainty
    const hasLocationUncertainty = report.uncertainties.some(u =>
      u.includes('地理定位不确定')
    );
    expect(hasLocationUncertainty).toBe(false);
  });

  test('should use confidence as consistency and specific verdict when fusion is missing', () => {
    const fixtureWithoutFusion: RecognitionResult = {
      ...fixture,
      fusion: undefined,
      confidence: 0.75,
    };

    const report = buildPresentationReport(fixtureWithoutFusion);

    // When fusion is missing, imageCount must be 1
    expect(report.crossView.imageCount).toBe(1);
    // consistency must equal confidence (clamped 0..1)
    expect(report.crossView.consistency).toBe(0.75);
    // verdict must be the exact specified string
    expect(report.crossView.verdict).toBe('未提供多视角融合一致性指标，当前为单视角研判。');
  });
});
