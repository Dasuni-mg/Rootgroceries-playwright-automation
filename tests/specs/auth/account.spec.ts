import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';

test.describe('Account', () => {

  test('should redirect to login when not authenticated', async ({ accountPage, page }) => {
    await accountPage.page.goto('/account', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display account info when logged in', async ({ accountPage, loginPage, page }) => {
    const { validUser } = loginData;
    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await accountPage.open();
    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.savedAddressesSection).toBeVisible();
  });

  test('should display danger zone section for logged in user', async ({ accountPage, loginPage, page }) => {
    const { validUser } = loginData;
    await loginPage.open();
    await loginPage.login(validUser.email, validUser.password);
    await page.waitForTimeout(1000);

    await accountPage.open();
    await expect(accountPage.dangerZoneSection).toBeVisible();
  });

});
