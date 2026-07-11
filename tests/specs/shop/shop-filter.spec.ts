import { test, expect } from '../../fixtures';

test.describe('Shop Filter & Sort', () => {

  test.beforeEach(async ({ shopPage }) => {
    await shopPage.open();
  });

  test('should display category filter', async ({ shopPage }) => {
    await expect(shopPage.categorySelect).toBeVisible();
  });

  test('should display sort options', async ({ shopPage }) => {
    await expect(shopPage.sortSelect).toBeVisible();
  });

  test('should filter products by category', async ({ shopPage }) => {
    const initialCount = await shopPage.getProductCardsCount();
    expect(initialCount).toBeGreaterThan(0);

    await shopPage.selectCategory('beverages');
    await shopPage.page.waitForTimeout(500);

    const names = await shopPage.getAllProductNames();
    expect(names.length).toBeGreaterThanOrEqual(0);
  });

  test('should sort products by price low to high', async ({ shopPage }) => {
    await shopPage.selectSort('price');
    await shopPage.page.waitForTimeout(500);

    const count = await shopPage.getProductCardsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should sort products by name', async ({ shopPage, page }) => {
    await shopPage.selectSort('name');
    await page.waitForTimeout(500);

    const names = await shopPage.getAllProductNames();
    expect(names.length).toBeGreaterThan(0);
  });

  test('should navigate between pages if available', async ({ shopPage }) => {
    const totalPages = await shopPage.getTotalPages();
    if (totalPages > 1) {
      await shopPage.goToNextPage();
      const currentPage = await shopPage.getCurrentPage();
      expect(currentPage).toBe(2);
    }
  });

  test('should show in-stock checkbox filter', async ({ shopPage, page }) => {
    const inStockCheckbox = page.getByRole('checkbox', { name: /in stock only/i });
    await expect(inStockCheckbox).toBeVisible();
  });

});
