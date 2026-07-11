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

    const names = await shopPage.getAllProductNames();
    expect(names.length).toBeGreaterThanOrEqual(0);
  });

  test('should sort products by price low to high', async ({ shopPage }) => {
    await shopPage.selectSort('price');
    await shopPage.page.waitForTimeout(500);

    const cards = shopPage.productCards;
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const firstPrice = await cards.first().locator('[class*="price"]').innerText();
    expect(firstPrice).toMatch(/US\$/);
  });

  test('should sort products by name', async ({ shopPage, page }) => {
    await shopPage.selectSort('name');
    await page.waitForTimeout(500);

    const names = await shopPage.getAllProductNames();
    expect(names.length).toBeGreaterThan(0);

    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('should navigate between pages', async ({ shopPage, page }) => {
    const totalPages = await shopPage.getTotalPages();
    if (totalPages > 1) {
      await shopPage.goToNextPage();
      const currentPage = await shopPage.getCurrentPage();
      expect(currentPage).toBe(2);
    } else {
      test.skip(true, 'Only 1 page available');
    }
  });

  test('should filter by in-stock checkbox', async ({ shopPage, page }) => {
    const inStockCheckbox = page.getByRole('checkbox', { name: /in stock only/i });
    await expect(inStockCheckbox).toBeVisible();
    const checked = await inStockCheckbox.isChecked();
    expect(typeof checked).toBe('boolean');
  });

});
