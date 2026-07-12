import { Page } from '@playwright/test';
import { selectSriLanka } from '../utils/selectCountry';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heroHeading() {
    return this.page.locator('main h1');
  }

  get heroSubtext() {
    return this.page.locator('main').getByText(/flavours.*rooted|rooted.*sri lanka/i);
  }

  get shopByCategoryHeading() {
    return this.page.locator('main').getByRole('heading', { name: /shop by category/i });
  }

  get allProductsHeading() {
    return this.page.locator('main').getByRole('heading', { name: /all products/i });
  }

  get shopLink() {
    return this.page.getByRole('link', { name: /shop the sri lankan harvest/i });
  }

  get trackOrdersLink() {
    return this.page.getByRole('link', { name: /track orders/i });
  }

  get viewAllLink() {
    return this.page.getByRole('link', { name: /view all/i });
  }

  get productCards() {
    return this.page.locator('main').locator('article.product-card');
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.heroHeading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
