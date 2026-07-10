import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';

const ONEPAY_CARDS = {
  visa1: { cardNumber: '4508750015741019', expiry: '01/39', cvv: '100' },
  visa2: { cardNumber: '4012000033330026', expiry: '01/39', cvv: '100' },
  master1: { cardNumber: '5123450000000008', expiry: '01/39', cvv: '100' },
  master2: { cardNumber: '5111111111111118', expiry: '01/39', cvv: '100' },
};

test.describe('Checkout', () => {

  test('should complete checkout with OnePay Visa card @smoke', async ({
    page, shopPage, productPage, cartPage, checkoutPage, orderConfirmationPage, loginPage
  }) => {
    const { validUser } = loginData;

    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await shopPage.open();

    const productCount = await shopPage.productCards.count();
    expect(productCount).toBeGreaterThan(0);

    const productNames = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: productNames[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();
    await productPage.addToCart();

    await cartPage.open();
    await expect(cartPage.cartLayout).toBeVisible();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);

    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/checkout/, { timeout: 15000 });
    await expect(checkoutPage.checkoutLayout).toBeVisible({ timeout: 10000 });

    if (await checkoutPage.fullNameInput.isVisible().catch(() => false)) {
      await checkoutPage.fillContactInfo(validUser.email.split('@')[0], validUser.email, '0771234567');
    }

    if (await checkoutPage.addressInput.isVisible().catch(() => false)) {
      await checkoutPage.fillShippingAddress('123 Main Street', 'Colombo');
    }

    const card = ONEPAY_CARDS.visa1;
    await checkoutPage.fillCardDetails(card.cardNumber, card.expiry, card.cvv);

    await checkoutPage.placeOrder();

    const confirmed = await orderConfirmationPage.successHeading.isVisible({ timeout: 30000 }).catch(() => false);
    if (!confirmed) {
      const url = page.url();
      expect(url).toMatch(/order|confirmation|thank.you|success/i);
    } else {
      const info = await orderConfirmationPage.getConfirmationInfo();
      expect(info.successMessage).toBeTruthy();
    }
  });

  test('should complete checkout with OnePay Mastercard', async ({
    page, shopPage, productPage, cartPage, checkoutPage, orderConfirmationPage, loginPage
  }) => {
    const { validUser } = loginData;

    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await shopPage.open();

    const productNames = await shopPage.productCards.locator('a.product-name').allInnerTexts();
    await page.getByRole('link', { name: productNames[0] }).and(page.locator('.product-name')).click();

    await productPage.waitForPageLoaded();
    await productPage.addToCart();

    await cartPage.open();
    await cartPage.proceedToCheckout();

    await expect(checkoutPage.checkoutLayout).toBeVisible({ timeout: 10000 });

    if (await checkoutPage.fullNameInput.isVisible().catch(() => false)) {
      await checkoutPage.fillContactInfo(validUser.email.split('@')[0], validUser.email, '0771234567');
    }

    if (await checkoutPage.addressInput.isVisible().catch(() => false)) {
      await checkoutPage.fillShippingAddress('123 Main Street', 'Colombo');
    }

    const card = ONEPAY_CARDS.master1;
    await checkoutPage.fillCardDetails(card.cardNumber, card.expiry, card.cvv);
    await checkoutPage.placeOrder();

    const confirmed = await orderConfirmationPage.successHeading.isVisible({ timeout: 30000 }).catch(() => false);
    if (!confirmed) {
      expect(page.url()).toMatch(/order|confirmation|thank.you|success/i);
    } else {
      const info = await orderConfirmationPage.getConfirmationInfo();
      expect(info.successMessage).toBeTruthy();
    }
  });

});
