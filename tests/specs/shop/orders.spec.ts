import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';

test.describe('Orders', () => {

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display orders page when logged in', async ({ loginPage, page }) => {
    const { validUser } = loginData;
    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForURL(/\/$|\/shop|\/orders/, { timeout: 15000 });

    await page.getByRole('link', { name: /orders/i }).first().click();
    await page.waitForURL(/\/orders/, { timeout: 15000 });
    await expect(page.locator('main h1')).toBeVisible();
  });

});
