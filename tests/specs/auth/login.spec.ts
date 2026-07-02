import { test, expect } from '@playwright/test';
import { loginData } from '../../data/loginData';
import { LoginPage } from '../../pages/auth/loginPage';


test.describe('Login Feature', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const { validUser } = loginData;

    await loginPage.login(validUser.email, validUser.password);

    // Form should submit without client-side validation errors
    await expect(loginPage.emailOrPhoneError).toBeHidden();
    await expect(loginPage.passwordError).toBeHidden();
  });

  test('Login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Use valid email with invalid password
    await loginPage.login(loginData.validUser.email, loginData.invalidUser.password)

    // Verify we stay on login page (login should fail)
    await expect(page).toHaveURL('/login');

    // Verify error notification appears (server error or invalid credentials)
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('Login with invalid email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Use invalid email with valid password
    await loginPage.login(loginData.invalidUser.email, loginData.validUser.password);

    // Verify we stay on login page (login should fail)
    await expect(page).toHaveURL('/login');

    // Verify error notification appears (server error or invalid credentials)
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('Login with empty email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Try to login with empty email and valid password
    await loginPage.login('', loginData.validUser.password);

    // Verify we stay on login page
    await expect(page).toHaveURL('/login');

    // Verify validation error appears near the email field
    await expect(loginPage.emailOrPhoneError).toBeVisible();
  });

  test('Login with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Try to login with valid email and empty password
    await loginPage.login(loginData.validUser.email, '');

    // Verify we stay on login page
    await expect(page).toHaveURL('/login');

    // Verify validation error appears near the password field
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('Login with both fields empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Try to login with both email and password empty
    await loginPage.login('', '');

    // Verify we stay on login page
    await expect(page).toHaveURL('/login');

    // Verify validation errors appear near both fields
    await expect(loginPage.emailOrPhoneError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('Forgot password link directs to Reset Password form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Click the forgot password link
    await loginPage.clickForgotPassword();

    // Verify navigation to reset password page
    await expect(page).toHaveURL('/forgot-password');

    // Verify the Reset Password form header is visible
    await expect(page.getByRole('heading', { name: /Reset password/i })).toBeVisible();
  });

  test('Create Account link directs to registration page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Click the create account link
    await loginPage.clickCreateAccount();

    // Verify navigation to register/signup page
    await expect(page).toHaveURL('/register');

    // Verify the Registration form header is visible
    await expect(page.getByRole('heading', { name: /Create account/i })).toBeVisible();
 
  });

});
