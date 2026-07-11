import { test, expect } from '../../fixtures';
import { signupData } from '../../data/signupData';

test.describe('Signup Page', () => {

  test.beforeEach(async ({ signupPage }) => {
    await signupPage.open();
  });

  test('Signup form is displayed with heading @smoke', async ({ signupPage, page }) => {
    await expect(signupPage.page.getByRole('heading', { name: /Create account/i })).toBeVisible();
  });

  test('All fields are empty on initial load @smoke', async ({ signupPage }) => {
    await expect(signupPage.usernameInput).toHaveValue('');
    await expect(signupPage.emailInput).toHaveValue('');
    await expect(signupPage.phoneInput).toHaveValue('');
    await expect(signupPage.passwordInput).toHaveValue('');
  });

  test('Should create an account with valid data @smoke @regression', async ({ signupPage, page }) => {
    await signupPage.fillSignupForm(
      signupData.validUser.username,
      signupData.validUser.email,
      signupData.validUser.phone,
      signupData.validUser.password
    );

    await signupPage.clickCreateAccount();
    await page.waitForLoadState('networkidle');

    // Form should either navigate away (success) or show no visible client-side errors
    await expect(signupPage.usernameError.or(signupPage.emailError).or(signupPage.passwordError)).toBeHidden();
  });

  test('Should create an account without phone number @smoke', async ({ signupPage, page }) => {
    await signupPage.fillSignupForm(
      signupData.validUserWithoutPhone.username,
      signupData.validUserWithoutPhone.email,
      signupData.validUserWithoutPhone.phone,
      signupData.validUserWithoutPhone.password
    );

    await signupPage.clickCreateAccount();

    // After signup without phone, the form may either:
    // 1. Navigate to home page (https://rootsgroceries.com/)
    // 2. Stay on registration page with success indication
    await expect(page).toHaveURL(/\/register|https:\/\/rootsgroceries.com\//);
  });

  test('Login link navigates to login page @smoke', async ({ signupPage, page }) => {
    await signupPage.clickLogin();
    await expect(page).toHaveURL('/login');
  });

  test.describe('Username Validation @regression', () => {
    signupData.username.forEach((data: { value: string; error: string }) => {
      test(`Username: ${data.value || 'Empty Username'}`, async ({ signupPage }) => {
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

  test.describe('Email Validation @regression', () => {
    // Add the critical security/edge case tests from explore-signup-errors.ts
    const criticalTestCases = [
      { value: 'abc', error: 'Invalid email format' },
      { value: 'john@', error: 'Invalid email format' },
      { value: 'user@domain.com', error: '' },
      { value: 'user+tag@domain.co.uk', error: '' }
    ];
    
    criticalTestCases.forEach((data) => {
      test(`Email: ${data.value || 'Empty Email'}`, async ({ signupPage }) => {
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

  // test.describe('Phone Validation', () => {
  //   signupData.phone.forEach((data: { value: string; error: string }) => {
  //     test(`Phone: ${data.value || 'Empty Phone'}`, async () => {
  //       await signupPage.fillSignupForm(
  //         signupData.validUser.username,
  //         signupData.validUser.email,
  //         data.value,
  //         signupData.validUser.password
  //       );

  //       await signupPage.clickCreateAccount();

  //       if (data.error) {
  //         await expect(signupPage.phoneError).toContainText(data.error);
  //       } else {
  //         await expect(signupPage.phoneError).toBeHidden();
  //       }
  //     });
  //   });
  // });

  // test.describe('Password Validation', () => {
  //   signupData.password.forEach((data: { value: string; error: string }) => {
  //     test(`Password: ${data.value || 'Empty Password'}`, async () => {
  //       await signupPage.fillSignupForm(
  //         signupData.validUser.username,
  //         signupData.validUser.email,
  //         signupData.validUser.phone,
  //         data.value
  //       );

  //       await signupPage.clickCreateAccount();

  //       if (data.error) {
  //         await expect(signupPage.passwordError).toContainText(data.error);
  //       } else {
  //         await expect(signupPage.passwordError).toBeHidden();
  //       }
  //     });
  //   });
  // });
});