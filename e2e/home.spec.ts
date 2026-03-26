import { test, expect } from '@playwright/test';

test.describe('首页功能测试', () => {
  test('首页正常加载并显示标题', async ({ page }) => {
    await page.goto('/');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/古建智识/);
    
    // 验证主标题存在
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('古建智识');
  });

  test('导航栏所有链接可点击', async ({ page }) => {
    await page.goto('/');
    
    // 检查导航链接
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // 验证导航栏可见
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('页面包含核心功能区块', async ({ page }) => {
    await page.goto('/');
    
    // 验证功能特性区块
    const featuresSection = page.locator('section').filter({ hasText: /功能|特性/ });
    await expect(featuresSection.first()).toBeVisible();
    
    // 验证使用流程区块
    const howItWorksSection = page.locator('section').filter({ hasText: /使用|流程/ });
    await expect(howItWorksSection.first()).toBeVisible();
  });

  test('页脚信息显示正确', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('2026');
  });
});
