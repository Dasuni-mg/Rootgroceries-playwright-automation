import { test, expect } from '../../fixtures';

test.describe('Forgot Password', () => {

  test('should display forgot password page with heading @regression', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await expect(forgotPasswordPage.heading).toBeVisible();
  });

  test('should display email input and reset button @regression', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await expect(forgotPasswordPage.emailInput).toBeVisible();
    await expect(forgotPasswordPage.resetButton).toBeVisible();
  });

  test('should allow entering email @regression', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await forgotPasswordPage.emailInput.fill('test@example.com');
    await expect(forgotPasswordPage.emailInput).toHaveValue('test@example.com');
  });

});
