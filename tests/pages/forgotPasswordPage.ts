import { Page } from '@playwright/test';
import { selectSriLanka } from '../utils/selectCountry';

export class ForgotPasswordPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heading() {
    return this.page.getByRole('heading', { name: /reset password/i });
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  get resetButton() {
    return this.page.getByRole('button', { name: /reset|send/i });
  }

  async open() {
    await this.page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.heading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }
}
