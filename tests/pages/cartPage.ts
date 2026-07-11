import { Page } from '@playwright/test';
import { selectSriLanka } from '../../tests/utils/selectCountry';

export interface CartItemInfo {
  name: string;
  price: string;
  quantity: number;
}

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get cartLayout() {
    return this.page.locator('.cart-layout');
  }

  get cartLines() {
    return this.page.locator('.cart-line');
  }

  get heading() {
    return this.page.locator('.cart-items h1');
  }

  get emptyHeading() {
    return this.page.getByRole('heading', { name: /your cart is ready/i });
  }

  get shopGroceriesLink() {
    return this.page.getByRole('link', { name: /shop groceries/i });
  }

  get orderSummary() {
    return this.page.locator('.order-summary');
  }

  get subtotal() {
    return this.orderSummary.locator('.price, [class*="subtotal"]');
  }

  get checkoutButton() {
    return this.page.getByRole('link', { name: /proceed to checkout/i });
  }

  get continueShoppingButton() {
    return this.page.getByRole('link', { name: /continue shopping/i });
  }

  get cartCountBadge() {
    return this.page.locator('.cart-count');
  }

  async open() {
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.cartLayout.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async getItemCount(): Promise<number> {
    return this.cartLines.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.cartLines.locator('.product-name, h2, h3, [class*="item-name"]').allInnerTexts();
  }

  async getItemPrices(): Promise<string[]> {
    return this.cartLines.locator('.price, [class*="item-price"]').allInnerTexts();
  }

  async getItemQuantities(): Promise<number[]> {
    const texts = await this.cartLines.locator('input[type="number"], .qty-stepper span, [class*="quantity"]').allInnerTexts();
    return texts.map((t) => parseInt(t, 10) || 1);
  }

  async getCartItems(): Promise<CartItemInfo[]> {
    const names = await this.getItemNames();
    const prices = await this.getItemPrices();
    const quantities = await this.getItemQuantities();
    return names.map((name, i) => ({
      name,
      price: prices[i] || '',
      quantity: quantities[i] || 1,
    }));
  }

  async getSubtotal(): Promise<string> {
    return (await this.subtotal.innerText()).trim();
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getItemCount();
    return count === 0;
  }

  async removeItem(index: number) {
    const removeBtn = this.cartLines.nth(index).getByRole('button', { name: /remove|delete/i });
    await removeBtn.click();
    await this.page.waitForTimeout(500);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForTimeout(500);
  }
}
