import { Page } from '@playwright/test';

export interface OrderConfirmationInfo {
  orderNumber: string;
  successMessage: string;
}

export class OrderConfirmationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get confirmationContainer() {
    return this.page.locator('main').locator('section, div').filter({ hasText: /order|thank you|confirmation/i }).first();
  }

  get successHeading() {
    return this.page.getByRole('heading', { name: /thank you|order confirmed|order placed|success/i });
  }

  get orderNumberElement() {
    return this.page.locator('main').getByText(/#\d+|order.*\d{3,}|ref.*\d{3,}/i).first();
  }

  get orderNumber() {
    return this.page.locator('[class*="order-number"], [class*="order-ref"], strong:has-text("#")').first();
  }

  async waitForConfirmation(timeout = 30000) {
    await this.successHeading.waitFor({ state: 'visible', timeout });
    await this.page.waitForURL(/\/order\/|\/confirmation|\/thank-you|\/success/i, { timeout }).catch(() => {});
  }

  async getOrderNumberText(): Promise<string> {
    const text = await this.orderNumber.textContent().catch(() => '');
    const text2 = await this.orderNumberElement.textContent().catch(() => '');
    return text || text2 || '';
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successHeading.textContent().catch(() => '')) || '';
  }

  async getConfirmationInfo(): Promise<OrderConfirmationInfo> {
    return {
      orderNumber: await this.getOrderNumberText(),
      successMessage: await this.getSuccessMessage(),
    };
  }
}
