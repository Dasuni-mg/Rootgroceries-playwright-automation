import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';

test.describe('Account', () => {

  test('should redirect to login when not authenticated @regression', async ({ page }) => {
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display account page when logged in @regression', async ({ loginPage, page }) => {
    const { validUser } = loginData;
    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForURL(/\/$|\/shop|\/account/, { timeout: 15000 });

    await page.getByRole('link', { name: /account/i }).first().click();
    await page.waitForURL(/\/account/, { timeout: 15000 });
    await expect(page.locator('main h1')).toBeVisible();
  });

});
