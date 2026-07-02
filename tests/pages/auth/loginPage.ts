import { Page } from '@playwright/test';
import { selectSriLanka } from '../../utils/selectCountry';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get emailOrPhoneInput() {
    return this.page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[aria-label*="email" i]').first();
  }

  get passwordInput() {
    return this.page.locator('input[type="password"], input[name="password"], input[aria-label*="password" i]').first();
  }

  get loginButton() {
    return this.page.locator('button[type="submit"], button:has-text("Login")').first();
  }

  get emailOrPhoneError() {
    const container = this.emailOrPhoneInput.locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }

  get passwordError() {
    // Password input is wrapped with show/hide button; error lives outside that wrapper
    const container = this.passwordInput.locator('..').locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }

  get forgotPasswordLink() {
    return this.page.locator('a[href*="forgot"], a:has-text("Forgot password")').first();
  }

  get createAccountLink() {
    return this.page.locator('a[href*="register"], a[href*="signup"], a:has-text("Create Account"), a:has-text("Sign up")').first();
  }

  async open() {
    await this.page.goto('/login', { waitUntil: 'networkidle' });
    await selectSriLanka(this.page);
  }
  async login(email: string, password: string) {
    await selectSriLanka(this.page);
    await this.emailOrPhoneInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await selectSriLanka(this.page);
    await this.forgotPasswordLink.click();
  }

  async clickCreateAccount() {
    await selectSriLanka(this.page);
    await this.createAccountLink.click();
  }
}
