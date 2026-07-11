import { Page } from '@playwright/test';

export interface OrderConfirmationInfo {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

export class OrderConfirmationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get orderNumberHeading() {
    return this.page.locator('main h1');
  }

  get orderStatusBadge() {
    return this.page.locator('main').getByText(/placed|confirmed|processing|delivered|cancelled/i).first();
  }

  get paymentMethod() {
    return this.page.locator('main').getByText(/cash on delivery|card|credit|visa|master/i).first();
  }

  get paymentStatus() {
    return this.page.locator('main').getByText(/pending|paid|completed/i).first();
  }

  get deliveryAddress() {
    return this.page.locator('main').getByText(/delivery address/i);
  }

  get orderItems() {
    return this.page.locator('main').getByText(/order items/i);
  }

  async waitForConfirmation(timeout = 30000) {
    await this.page.waitForURL(/\/order\//, { timeout }).catch(() => {});
    await this.orderNumberHeading.waitFor({ state: 'visible', timeout });
  }

  async getOrderNumberText(): Promise<string> {
    return (await this.orderNumberHeading.textContent()) || '';
  }

  async getStatus(): Promise<string> {
    return (await this.orderStatusBadge.textContent()) || '';
  }

  async getPaymentMethod(): Promise<string> {
    return (await this.paymentMethod.textContent()) || '';
  }

  async getConfirmationInfo(): Promise<OrderConfirmationInfo> {
    return {
      orderNumber: await this.getOrderNumberText(),
      status: await this.getStatus(),
      paymentMethod: await this.getPaymentMethod(),
      paymentStatus: (await this.paymentStatus.textContent().catch(() => '')) || '',
    };
  }
}
