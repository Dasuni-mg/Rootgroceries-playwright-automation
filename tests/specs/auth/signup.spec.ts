import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/auth/signupPage';
import { signupData } from '../../data/signupData';

test.describe('Signup Page', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.open();
  });

  test('Should create an account with valid data', async ({ page }) => {
    await signupPage.fillSignupForm(
      signupData.validUser.username,
      signupData.validUser.email,
      signupData.validUser.phone,
      signupData.validUser.password
    );

    await signupPage.clickCreateAccount();

    await expect(page).toHaveURL("https://rootsgroceries.com/");
  });

  test.describe('Username Validation', () => {
    signupData.username.forEach((data: { value: string; error: string }) => {
      test(`Username: ${data.value || 'Empty Username'}`, async () => {
        await signupPage.fillSignupForm(
          data.value,
          signupData.validUser.email,
          signupData.validUser.phone,
          signupData.validUser.password
        );

        await signupPage.clickCreateAccount();

        if (data.error) {
          await expect(signupPage.usernameError).toContainText(data.error);
        } else {
          await expect(signupPage.usernameError).toBeHidden();
        }
      });
    });
  });

  test.describe('Email Validation', () => {
    signupData.email.forEach((data: { value: string; error: string }) => {
      test(`Email: ${data.value || 'Empty Email'}`, async () => {
        await signupPage.fillSignupForm(
          signupData.validUser.username,
          data.value,
          signupData.validUser.phone,
          signupData.validUser.password
        );

        await signupPage.clickCreateAccount();

        if (data.error) {
          await expect(signupPage.emailError).toContainText(data.error);
        } else {
          await expect(signupPage.emailError).toBeHidden();
        }
      });
    });
  });

  test.describe('Phone Validation', () => {
    signupData.phone.forEach((data: { value: string; error: string }) => {
      test(`Phone: ${data.value || 'Empty Phone'}`, async () => {
        await signupPage.fillSignupForm(
          signupData.validUser.username,
          signupData.validUser.email,
          data.value,
          signupData.validUser.password
        );

        await signupPage.clickCreateAccount();

        if (data.error) {
          await expect(signupPage.phoneError).toContainText(data.error);
        } else {
          await expect(signupPage.phoneError).toBeHidden();
        }
      });
    });
  });

  test.describe('Password Validation', () => {
    signupData.password.forEach((data: { value: string; error: string }) => {
      test(`Password: ${data.value || 'Empty Password'}`, async () => {
        await signupPage.fillSignupForm(
          signupData.validUser.username,
          signupData.validUser.email,
          signupData.validUser.phone,
          data.value
        );

        await signupPage.clickCreateAccount();

        if (data.error) {
          await expect(signupPage.passwordError).toContainText(data.error);
        } else {
          await expect(signupPage.passwordError).toBeHidden();
        }
      });
    });
  });
});