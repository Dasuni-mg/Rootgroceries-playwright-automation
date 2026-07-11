import { Page } from '@playwright/test';
import { selectSriLanka } from '../utils/selectCountry';

export class AccountPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heading() {
    return this.page.locator('main h1');
  }

  get savedAddressesSection() {
    return this.page.locator('main').getByText(/saved addresses/i);
  }

  get dangerZoneSection() {
    return this.page.locator('main').getByText(/danger zone/i);
  }

  async open() {
    await this.page.goto('/account', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.heading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async isLoggedIn(): Promise<boolean> {
    return this.heading.isVisible().catch(() => false);
  }
}
