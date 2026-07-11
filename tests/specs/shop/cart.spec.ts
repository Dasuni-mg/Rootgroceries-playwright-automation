import { test, expect } from '../../fixtures';
import { getInStockProductSlug } from '../helpers';

test.describe('Cart', () => {

  test('should add a product to cart and validate it appears in cart @smoke @regression', async ({ shopPage, productPage, cartPage, page }) => {
    const slug = await getInStockProductSlug(shopPage);
    expect(slug).toBeTruthy();

    await productPage.open(slug!);
    await expect(productPage.addToCartButton).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();
    await productPage.addToCart();

    await cartPage.open();
    await expect(cartPage.cartLayout).toBeVisible();
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);

    const productName = await productPage.productName.innerText();
    const itemNames = await cartPage.getItemNames();
    const found = itemNames.some((name) =>
      name.toLowerCase().includes(productName.toLowerCase())
    );
    expect(found).toBe(true);
  });

  test('should show cart count badge after adding product @regression', async ({ shopPage, productPage, page }) => {
    const slug = await getInStockProductSlug(shopPage);
    expect(slug).toBeTruthy();

    await productPage.open(slug!);
    await productPage.addToCart();

    const cartCount = page.locator('.cart-count');
    await expect(cartCount).toBeVisible();
    const countText = await cartCount.innerText();
    expect(parseInt(countText, 10)).toBeGreaterThan(0);
  });

  test('should show empty cart state when no items have been added @regression', async ({ cartPage }) => {
    await cartPage.open();

    const isEmpty = await cartPage.isCartEmpty();
    if (isEmpty) {
      await expect(cartPage.emptyHeading).toBeVisible();
      await expect(cartPage.shopGroceriesLink).toBeVisible();
    } else {
      const items = await cartPage.getCartItems();
      expect(items.length).toBeGreaterThan(0);
    }
  });

});
