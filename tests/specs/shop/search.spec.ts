import { test, expect } from '../../fixtures';

test.describe('Product Search', () => {

  test.beforeEach(async ({ shopPage }) => {
    await shopPage.open();
  });

  test('should display search input on shop page @regression', async ({ shopPage }) => {
    await expect(shopPage.searchInput).toBeVisible();
    await expect(shopPage.searchInput).toHaveAttribute('placeholder', 'Search groceries');
  });

  test('should filter products by search query @smoke @regression', async ({ shopPage }) => {
    const initialCount = await shopPage.getProductCardsCount();
    expect(initialCount).toBeGreaterThan(0);

    await shopPage.search('Vanilla');

    const allNames = await shopPage.getAllProductNames();
    expect(allNames.length).toBeGreaterThan(0);
    for (const name of allNames) {
      expect(name.toLowerCase()).toContain('vanilla');
    }
  });

  test('should show no results for non-existent product @regression', async ({ shopPage }) => {
    await shopPage.search('zzzznonexistentproductzzzz');

    const count = await shopPage.getProductCardsCount();
    expect(count).toBe(0);

    await expect(shopPage.productGrid).not.toBeVisible();
  });

  test('should clear search and restore all products @regression', async ({ shopPage, page }) => {
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

  test('should return relevant results after searching @regression', async ({ shopPage }) => {
    await shopPage.search('Vanilla');
    const names = await shopPage.getAllProductNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain('vanilla');
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
