import { Locator, Page } from '@playwright/test';
import { selectSriLanka } from '../../utils/selectCountry';

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get usernameInput() {
    return this.page.getByRole('textbox', { name: /name/i });
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  get phoneInput() {
    return this.page.getByRole('textbox', { name: /phone/i });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: /password/i });
  }

  get createAccountButton() {
    return this.page.getByRole('button', { name: /create account|register/i });
  }

  get loginLink() {
    return this.page.getByRole('main').getByRole('link', { name: /login/i });
  }

  get usernameError() {
    const container = this.usernameInput.locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }

  get emailError() {
    const container = this.emailInput.locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }

  get phoneError() {
    const container = this.phoneInput.locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }

  get passwordError() {
    const container = this.passwordInput.locator('..').locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }

  async open() {
    await this.page.goto('/register', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
  }

  async closeCountryGateIfPresent() {
    const dialog = this.page.getByRole('dialog').first();
    if (await dialog.isVisible().catch(() => false)) {
      await selectSriLanka(this.page);
    }
  }

  async fillSignupForm(username: string, email: string, phone: string, password: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.passwordInput.fill(password);
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async clickLogin() {
    await this.loginLink.click();
  }
}
