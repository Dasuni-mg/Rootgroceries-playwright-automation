import { test, expect } from '../../fixtures';
import { loginData } from '../../data/loginData';


test.describe('Login Feature', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('Login with valid credentials @regression', async ({ loginPage }) => {
    const { validUser } = loginData;

    await loginPage.login(validUser.email, validUser.password);

    await expect(loginPage.emailOrPhoneError).toBeHidden();
    await expect(loginPage.passwordError).toBeHidden();
  });

  test('Login with invalid password @regression', async ({ loginPage, page }) => {
    await loginPage.login(loginData.validUser.email, loginData.invalidUser.password)

    await expect(page).toHaveURL('/login');
    await expect(page.locator('.toast-error')).toBeVisible();
  });

  test('Login with invalid email @regression', async ({ loginPage, page }) => {
    await loginPage.login(loginData.invalidUser.email, loginData.validUser.password);

    await expect(page).toHaveURL('/login');
    await expect(page.locator('.toast-error')).toBeVisible();
  });

  test('Login with empty email', async ({ loginPage, page }) => {
    await loginPage.login('', loginData.validUser.password);

    await expect(page).toHaveURL('/login');
    await expect(loginPage.emailOrPhoneError).toBeVisible();
  });

  test('Login with empty password', async ({ loginPage, page }) => {
    await loginPage.login(loginData.validUser.email, '');

    await expect(page).toHaveURL('/login');
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('Login with both fields empty', async ({ loginPage, page }) => {
    await loginPage.login('', '');

    await expect(page).toHaveURL('/login');
    await expect(loginPage.emailOrPhoneError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('Forgot password link directs to Reset Password form', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL('/forgot-password');
    await expect(page.getByRole('heading', { name: /Reset password/i })).toBeVisible();
  });

  test('Create Account link directs to registration page', async ({ loginPage, page }) => {
    await loginPage.clickCreateAccount();

    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: /Create account/i })).toBeVisible();
  });

});
