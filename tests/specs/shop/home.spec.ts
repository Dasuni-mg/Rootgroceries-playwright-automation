import { test, expect } from '../../fixtures/fixtures';

test.describe('Homepage', () => {

  test('should display hero section with heading @smoke @regression', async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.heroSubtext).toBeVisible();
  });

  test('should display shop by category section @regression', async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.shopByCategoryHeading).toBeVisible();
  });

  test('should have hero call-to-action links @regression', async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.shopLink).toBeVisible();
    await expect(homePage.trackOrdersLink).toBeVisible();
  });

  test('should display all products section @regression', async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.allProductsHeading).toBeVisible();
    const count = await homePage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('view all link navigates to shop page @regression', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.viewAllLink.click();
    await expect(page).toHaveURL(/\/shop/);
  });

});
