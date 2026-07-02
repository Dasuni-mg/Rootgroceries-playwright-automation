import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/auth/loginPage';

test.describe('Home Page', () => {
  test('should open the login form from the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.open();
    await expect(homePage.loginButton).toBeVisible();

    await homePage.clickLogin();

    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.emailOrPhoneInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
