import { test, expect } from '../../fixtures';

test.describe('Product Search', () => {

  test.beforeEach(async ({ shopPage }) => {
    await shopPage.open();
  });

  test('should display search input on shop page', async ({ shopPage }) => {
    await expect(shopPage.searchInput).toBeVisible();
    await expect(shopPage.searchInput).toHaveAttribute('placeholder', 'Search groceries');
  });

  test('should filter products by search query', async ({ shopPage }) => {
    const initialCount = await shopPage.getProductCardsCount();
    expect(initialCount).toBeGreaterThan(0);

    await shopPage.search('Milka');

    const allNames = await shopPage.getAllProductNames();
    expect(allNames.length).toBeGreaterThan(0);
    for (const name of allNames) {
      expect(name.toLowerCase()).toContain('milka');
    }
  });

  test('should show no results for non-existent product', async ({ shopPage }) => {
    await shopPage.search('zzzznonexistentproductzzzz');

    const count = await shopPage.getProductCardsCount();
    expect(count).toBe(0);

    await expect(shopPage.productGrid).not.toBeVisible();
  });

  test('should clear search and restore all products', async ({ shopPage, page }) => {
    const initialCount = await shopPage.getProductCardsCount();
    expect(initialCount).toBeGreaterThan(0);

    await shopPage.search('zzzznonexistentproductzzzz');
    const filteredCount = await shopPage.getProductCardsCount();
    expect(filteredCount).toEqual(0);

    await shopPage.clearSearch();
    await shopPage.searchInput.press('Enter');
    await page.waitForTimeout(500);
    const restoredCount = await shopPage.getProductCardsCount();
    expect(restoredCount).toEqual(initialCount);
  });

  test('should return to page 1 after searching', async ({ shopPage }) => {
    if (await shopPage.nextPageButton.isVisible().catch(() => false)) {
      await shopPage.goToNextPage();
      const pageNumAfterNav = await shopPage.getCurrentPage();
      expect(pageNumAfterNav).toBeGreaterThan(1);

      await shopPage.search('Milka');
      const pageNumAfterSearch = await shopPage.getCurrentPage();
      expect(pageNumAfterSearch).toEqual(1);
    }
  });

  test('should search case-insensitively', async ({ shopPage }) => {
    await shopPage.search('cookie');
    const lowerNames = await shopPage.getAllProductNames();

    await shopPage.clearSearch();
    await shopPage.search('COOKIE');
    const upperNames = await shopPage.getAllProductNames();

    expect(lowerNames.length).toBeGreaterThan(0);
    expect(upperNames.length).toEqual(lowerNames.length);
  });

});
