import { Page } from '@playwright/test';
import { selectSriLanka } from '../../tests/utils/selectCountry';

export interface ProductDetailInfo {
  name: string;
  price: string;
  category: string;
  description: string;
  inStock: boolean;
  stockQuantity: number;
  imageUrl: string | null;
  currentQuantity: number;
}

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get productName() {
    return this.page.locator('h1');
  }

  get price() {
    return this.page.locator('main').getByText(/US\$/);
  }

  get categoryBadge() {
    return this.page.locator('main').getByText(/incense|beverages|chocolates|snacks|spices|rice|dairy|coconut|coffee|cookie|curry|flour|noodles|sambal|specials|vegetable|jam|drinks|papadam|kitchenware|health|game/i);
  }

  get description() {
    return this.page.locator('main p:first-of-type');
  }

  get stockStatus() {
    return this.page.locator('main').getByText(/in stock|out of stock/i);
  }

  get nativeBadge() {
    return this.page.getByText(/native to sri lanka/i);
  }

  get addToCartButton() {
    return this.page.getByRole('button', { name: /add to cart/i });
  }

  get quantityStepper() {
    return this.page.locator('main').locator('div.qty-stepper');
  }

  get quantityValue() {
    return this.quantityStepper.locator('span');
  }

  get increaseQuantityButton() {
    return this.quantityStepper.getByRole('button', { name: /increase quantity/i });
  }

  get decreaseQuantityButton() {
    return this.quantityStepper.getByRole('button', { name: /decrease quantity/i });
  }

  get productImage() {
    return this.page.locator('main img:first-of-type');
  }

  async waitForPageLoaded() {
    await this.page.waitForURL(/\/product\//, { timeout: 15000 });
    await this.productName.waitFor({ state: 'visible', timeout: 10000 });
  }

  async open(slug: string) {
    await this.page.goto(`/product/${slug}`, { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.waitForPageLoaded();
  }

  async setQuantity(qty: number) {
    const current = await this.getQuantity();
    if (qty === current) return;
    const diff = qty - current;
    const btn = diff > 0 ? this.increaseQuantityButton : this.decreaseQuantityButton;
    for (let i = 0; i < Math.abs(diff); i++) {
      if (await btn.isEnabled().catch(() => false)) {
        await btn.click();
        await this.page.waitForTimeout(100);
      }
    }
  }

  async getQuantity(): Promise<number> {
    const text = await this.quantityValue.innerText();
    return parseInt(text, 10) || 1;
  }

  async isInStock(): Promise<boolean> {
    const text = await this.stockStatus.innerText();
    return /in stock/i.test(text) && !/out of stock/i.test(text);
  }

  async getStockQuantity(): Promise<number> {
    const text = await this.stockStatus.innerText();
    const match = text.match(/(\d+)\s*in stock/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getProductInfo(): Promise<ProductDetailInfo> {
    const name = await this.productName.innerText();
    const price = await this.price.innerText();
    const category = await this.categoryBadge.innerText().catch(() => '');
    const description = await this.description.innerText().catch(() => '');
    const stockText = await this.stockStatus.innerText().catch(() => '');
    const inStock = /in stock/i.test(stockText) && !/out of stock/i.test(stockText);
    const match = stockText.match(/(\d+)\s*in stock/i);
    const stockQuantity = match ? parseInt(match[1], 10) : (inStock ? -1 : 0);
    const imageUrl = await this.productImage.getAttribute('src').catch(() => null);
    const currentQuantity = await this.getQuantity();

    return { name, price, category, description, inStock, stockQuantity, imageUrl, currentQuantity };
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.page.waitForTimeout(500);
  }
}
