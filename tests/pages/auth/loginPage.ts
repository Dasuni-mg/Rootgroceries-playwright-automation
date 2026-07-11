import { Page } from '@playwright/test';
import { selectSriLanka } from '../../utils/selectCountry';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get emailOrPhoneInput() {
    return this.page.getByRole('textbox', { name: /email or phone/i });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: /password/i });
  }

  get loginButton() {
    return this.page.getByRole('button', { name: /login/i });
  }

  get emailOrPhoneError() {
    const container = this.emailOrPhoneInput.locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]');
  }

  get passwordError() {
    // Password input is wrapped with show/hide button; error lives outside that wrapper
    const container = this.passwordInput.locator('..').locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]');
  }

  get forgotPasswordLink() {
    return this.page.getByRole('link', { name: /forgot password/i });
  }

  get createAccountLink() {
    return this.page.getByRole('link', { name: /create account|sign up/i });
  }

  async open() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
  }
  
  async login(email: string, password: string) {
    await selectSriLanka(this.page);
    await this.emailOrPhoneInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click({ force: true });
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
