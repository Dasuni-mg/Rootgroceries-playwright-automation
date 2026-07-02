import { Locator, Page } from '@playwright/test';
import { selectSriLanka } from '../../utils/selectCountry';

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get usernameInput() {
    return this.page.locator(
      'input[name="username"], input[name="name"], input[placeholder*="username" i], input[placeholder*="name" i], input[aria-label*="username" i], input[aria-label*="name" i]'
    ).first();
  }

  get emailInput() {
    return this.page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i], input[autocomplete="email"], input[aria-label*="email" i]'
    ).first();
  }

  get phoneInput() {
    return this.page.locator(
      'input[type="tel"], input[name="phone"], input[placeholder*="phone" i], input[aria-label*="phone" i]'
    ).first();
  }

  get passwordInput() {
    return this.page.locator(
      'input[type="password"], input[name="password"], input[placeholder*="password" i], input[aria-label*="password" i]'
    ).first();
  }

  get createAccountButton() {
    return this.page.locator('button[type="submit"], button:has-text("Create Account"), button:has-text("Register"), input[type="submit"]').first();
  }

  get loginLink() {
    return this.page.locator('a:has-text("Login"), a:has-text("Sign In")').first();
  }

  get usernameError() {
    return this.getFieldError(this.usernameInput);
  }

  get emailError() {
    return this.getFieldError(this.emailInput);
  }

  get phoneError() {
    return this.getFieldError(this.phoneInput);
  }

  get passwordError() {
    return this.getFieldError(this.passwordInput);
  }

  async open() {
    await this.page.goto('/register', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
  }

  async closeCountryGateIfPresent() {
    // kept for backward compatibility; prefer using selectSriLanka
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

  private getFieldError(inputLocator: Locator) {
    const container = inputLocator.locator('..');
    return container.locator('small, .error, .text-red-500, .invalid-feedback, [role="alert"]').first();
  }
}
