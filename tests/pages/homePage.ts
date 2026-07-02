import { Page } from '@playwright/test';
import { selectSriLanka } from '../utils/selectCountry';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get loginButton() {
    return this.page.locator('a.account-chip', { hasText: 'Login' }).first();
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
