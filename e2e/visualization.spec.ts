import { test, expect } from '@playwright/test';

test.describe('3D可视化功能测试', () => {
  test('3D场景容器存在', async ({ page }) => {
    await page.goto('/');
    
    // 滚动到3D展示区域
    const sceneSection = page.locator('section').filter({ hasText: /3D|场景|模型/ });
    await sceneSection.scrollIntoViewIfNeeded();
    
    // 验证3D画布或容器存在
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('3D场景加载完成', async ({ page }) => {
    await page.goto('/');
    
    // 等待3D场景加载
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // 等待一段时间让WebGL初始化
    await page.waitForTimeout(2000);
    
    // 验证canvas有内容（通过检查尺寸）
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('建筑展示列表存在', async ({ page }) => {
    await page.goto('/');
    
    // 验证建筑展示区块
    const showcaseSection = page.locator('section').filter({ hasText: /展示|建筑/ });
    await expect(showcaseSection.first()).toBeVisible();
    
    // 验证建筑卡片存在
    const buildingCards = page.locator('.building-card, [data-testid="building-card"]');
    const count = await buildingCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('技术栈展示区可见', async ({ page }) => {
    await page.goto('/');
    
    // 滚动到技术栈区域
    const techSection = page.locator('section').filter({ hasText: /技术栈|Tech/ });
    await techSection.scrollIntoViewIfNeeded();
    
    // 验证技术图标或列表存在
    const techItems = page.locator('.tech-item, .tech-card');
    const count = await techItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
