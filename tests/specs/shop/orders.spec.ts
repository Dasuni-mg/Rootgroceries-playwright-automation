import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';

test.describe('Orders', () => {

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display orders page when logged in', async ({ ordersPage, loginPage, page }) => {
    const { validUser } = loginData;
    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await ordersPage.open();
    await expect(ordersPage.heading).toBeVisible();
  });

  test('should show recent orders section', async ({ ordersPage, loginPage, page }) => {
    const { validUser } = loginData;
    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await ordersPage.open();
    await expect(ordersPage.recentOrdersHeading).toBeVisible();
  });

});
