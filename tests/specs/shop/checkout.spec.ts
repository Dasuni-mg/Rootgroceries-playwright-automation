import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';
import { onepayCards, checkoutAddress } from '../../data/checkoutData';

test.describe('Checkout', () => {

  test('should complete checkout and validate order confirmation @smoke', async ({
    page, shopPage, productPage, cartPage, checkoutPage, orderConfirmationPage, loginPage
  }) => {
    const { validUser } = loginData;

    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await shopPage.open();

    const productCount = await shopPage.productCards.count();
    expect(productCount).toBeGreaterThan(0);

    const productCards = shopPage.productCards;
    const productNames = await productCards.locator('a.product-name').allInnerTexts();
    let selectedProduct: string | null = null;

    for (let i = 0; i < productNames.length; i++) {
      await page.getByRole('link', { name: productNames[i] }).and(page.locator('.product-name')).click();
      await productPage.waitForPageLoaded();
      if (await productPage.addToCartButton.isEnabled()) {
        selectedProduct = productNames[i];
        break;
      }
      await page.goBack();
      await page.waitForTimeout(500);
    }
    expect(selectedProduct).toBeTruthy();

    await productPage.addToCart();

    await cartPage.open();
    await expect(cartPage.cartLayout).toBeVisible();
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);

    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/checkout/, { timeout: 15000 });
    await expect(checkoutPage.checkoutLayout).toBeVisible({ timeout: 10000 });

    await checkoutPage.fillAddress(checkoutAddress.addressLine1, checkoutAddress.city, checkoutAddress.district, checkoutAddress.postalCode);
    await checkoutPage.fillContact(checkoutAddress.phone);
    await checkoutPage.selectDeliveryWindow('09:00-12:00');

    const paymentFrames = await checkoutPage.paymentFrames;
    const card = onepayCards.visa1;

    if (paymentFrames.length > 0) {
      await checkoutPage.fillCardDetails(card.cardNumber, card.expiry, card.cvv);
    } else {
      const cardInputs = checkoutPage.page.locator('input[name="cardnumber"], input[name="card-number"]');
      if (await cardInputs.first().isVisible().catch(() => false)) {
        await checkoutPage.fillCardDetails(card.cardNumber, card.expiry, card.cvv);
      }
    }

    await checkoutPage.placeOrder();

    await orderConfirmationPage.waitForConfirmation(30000);

    const info = await orderConfirmationPage.getConfirmationInfo();
    expect(info.orderNumber).toMatch(/rg-\d+/i);
    expect(info.status).toMatch(/placed/i);
    expect(info.paymentMethod).toBeTruthy();

    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('should complete checkout with Mastercard and validate order', async ({
    page, shopPage, productPage, cartPage, checkoutPage, orderConfirmationPage, loginPage
  }) => {
    const { validUser } = loginData;

    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await shopPage.open();

    const productNames = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    let selectedProduct: string | null = null;

    for (let i = 0; i < productNames.length; i++) {
      await page.getByRole('link', { name: productNames[i] }).and(page.locator('.product-name')).click();
      await productPage.waitForPageLoaded();
      if (await productPage.addToCartButton.isEnabled()) {
        selectedProduct = productNames[i];
        break;
      }
      await page.goBack();
      await page.waitForTimeout(500);
    }
    expect(selectedProduct).toBeTruthy();

    await productPage.addToCart();

    await cartPage.open();
    await cartPage.proceedToCheckout();

    await expect(checkoutPage.checkoutLayout).toBeVisible({ timeout: 10000 });

    await checkoutPage.fillAddress(checkoutAddress.addressLine1, checkoutAddress.city, checkoutAddress.district, checkoutAddress.postalCode);
    await checkoutPage.fillContact(checkoutAddress.phone);
    await checkoutPage.selectDeliveryWindow('09:00-12:00');

    const card = onepayCards.master1;
    const paymentFrames = await checkoutPage.paymentFrames;
    if (paymentFrames.length > 0) {
      await checkoutPage.fillCardDetails(card.cardNumber, card.expiry, card.cvv);
    } else {
      const cardInputs = checkoutPage.page.locator('input[name="cardnumber"]');
      if (await cardInputs.first().isVisible().catch(() => false)) {
        await checkoutPage.fillCardDetails(card.cardNumber, card.expiry, card.cvv);
      }
    }

    await checkoutPage.placeOrder();

    await orderConfirmationPage.waitForConfirmation(30000);

    const info = await orderConfirmationPage.getConfirmationInfo();
    expect(info.orderNumber).toMatch(/rg-\d+/i);
    expect(info.status).toMatch(/placed/i);
    expect(info.paymentMethod).toBeTruthy();

    expect(await cartPage.getItemCount()).toBe(0);
  });

});
