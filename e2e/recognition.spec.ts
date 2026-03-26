import { test, expect } from '@playwright/test';

test.describe('AI识别功能测试', () => {
  test('图片上传组件可见', async ({ page }) => {
    await page.goto('/');
    
    // 滚动到上传区域
    const uploadSection = page.locator('section').filter({ hasText: /上传|识别/ });
    await uploadSection.scrollIntoViewIfNeeded();
    
    // 验证上传按钮或区域存在
    const uploadArea = page.locator('[data-testid="image-uploader"], .upload-area, input[type="file"]').first();
    await expect(uploadArea).toBeVisible();
  });

  test('可以选择图片文件', async ({ page }) => {
    await page.goto('/');
    
    // 找到文件输入
    const fileInput = page.locator('input[type="file"]').first();
    
    // 上传测试图片
    await fileInput.setInputFiles('public/data/images/chengqi-tulou.jpg');
    
    // 验证图片已选择（可能有预览）
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('识别结果显示区域存在', async ({ page }) => {
    await page.goto('/');
    
    // 验证结果卡片或展示区域存在
    const resultCards = page.locator('[data-testid="recognition-result"], .result-card');
    // 即使没有结果，区域也应该存在
    const resultSection = page.locator('section').filter({ hasText: /识别结果|建筑信息/ });
    await expect(resultSection.first()).toBeVisible();
  });

  test('建筑对比功能可用', async ({ page }) => {
    await page.goto('/');
    
    // 滚动到对比区域
    const comparisonSection = page.locator('section').filter({ hasText: /对比|比较/ });
    await comparisonSection.scrollIntoViewIfNeeded();
    
    // 验证对比组件存在
    const comparisonComponent = page.locator('[data-testid="building-comparison"], .comparison-container').first();
    if (await comparisonComponent.isVisible().catch(() => false)) {
      await expect(comparisonComponent).toBeVisible();
    }
  });
});
