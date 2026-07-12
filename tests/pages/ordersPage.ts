import { Page } from '@playwright/test';
import { selectSriLanka } from '../utils/selectCountry';

export class OrdersPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heading() {
    return this.page.locator('main h1');
  }

  get recentOrdersHeading() {
    return this.page.locator('main').getByRole('heading', { name: /recent orders/i });
  }

  get orderCards() {
    return this.page.locator('main').locator('.order-card, article, [class*="order-"]');
  }

  async open() {
    await this.page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.heading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async getOrderCount(): Promise<number> {
    return this.orderCards.count();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.heading.isVisible().catch(() => false);
  }
}
