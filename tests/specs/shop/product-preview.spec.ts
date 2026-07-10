import { test, expect } from '../../fixtures';

test.describe('Product Preview', () => {

  test('should navigate to product detail when clicking a product name', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const productCount = await shopPage.productCards.count();
    expect(productCount).toBeGreaterThan(0);

    const productNames = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    const firstProductName = productNames[0];
    await page.getByRole('link', { name: firstProductName }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();

    await expect(productPage.productName).toBeVisible();
    const detailName = await productPage.productName.innerText();
    expect(detailName).toEqual(firstProductName);
  });

  test('should display product price and stock status', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const pNames2 = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: pNames2[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();

    await expect(productPage.price).toBeVisible();
    const priceText = await productPage.price.innerText();
    expect(priceText).toMatch(/US\$\d+(\.\d{2})?/);

    await expect(productPage.stockStatus).toBeVisible();
  });

  test('should increase and decrease quantity', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const pNames3 = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: pNames3[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();

    const initialQty = await productPage.getQuantity();

    await productPage.increaseQuantityButton.click();
    await page.waitForTimeout(200);
    let qty = await productPage.getQuantity();
    expect(qty).toEqual(initialQty + 1);

    if (initialQty > 1) {
      await productPage.decreaseQuantityButton.click();
      await page.waitForTimeout(200);
      qty = await productPage.getQuantity();
      expect(qty).toEqual(initialQty);
    }
  });

  test('should disable decrease button at minimum quantity', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const pNames4 = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: pNames4[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();

    const qty = await productPage.getQuantity();
    if (qty <= 1) {
      await expect(productPage.decreaseQuantityButton).toBeDisabled();
    }
  });

  test('should see add to cart button', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const pNames5 = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: pNames5[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();

    await expect(productPage.addToCartButton).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('should navigate directly to product page via URL', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const hrefs = await shopPage.productCards.locator('a.product-name').evaluateAll(
      (links) => links.map((l) => l.getAttribute('href'))
    );
    const slug = hrefs[0]!.replace('/product/', '');

    await productPage.open(slug);

    await expect(productPage.productName).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/product/${slug}$`));
  });

  test('should get full product info', async ({ shopPage, productPage, page }) => {
    await shopPage.open();

    const pNames6 = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: pNames6[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();

    const info = await productPage.getProductInfo();
    expect(info.name).toBeTruthy();
    expect(info.price).toMatch(/US\$/);
    expect(info.imageUrl).toBeTruthy();
    expect(typeof info.inStock).toBe('boolean');
    expect(info.currentQuantity).toBeGreaterThanOrEqual(1);
  });

});
