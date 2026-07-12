import { Page } from '@playwright/test';
import { selectSriLanka } from '../../tests/utils/selectCountry';

export interface ProductInfo {
  name: string;
  price: string;
  packSize: string;
  category: string;
  inStock: boolean;
  imageUrl: string | null;
  productUrl: string | null;
}

export class ShopPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get searchInput() {
    return this.page.getByPlaceholder('Search groceries');
  }

  get searchForm() {
    return this.page.locator('form.search-box');
  }

  get categorySelect() {
    return this.page.getByRole('combobox', { name: /category/i });
  }

  get sortSelect() {
    return this.page.getByRole('combobox', { name: /sort/i });
  }

  get productCards() {
    return this.page.locator('article.product-card');
  }

  get productGrid() {
    return this.page.locator('div.product-grid');
  }

  get previousPageButton() {
    return this.page.getByRole('button', { name: /previous/i });
  }

  get nextPageButton() {
    return this.page.getByRole('button', { name: /next/i });
  }

  async open() {
    await this.page.goto('/shop', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.page.waitForTimeout(1000);
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async closeCountryGateIfPresent() {
    const dialog = this.page.getByRole('dialog', { name: /where are you shopping/i });
    if (await dialog.isVisible().catch(() => false)) {
      await selectSriLanka(this.page);
    }
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchInput.fill('');
  }

  async selectCategory(category: string) {
    await this.categorySelect.selectOption(category);
    await this.page.waitForTimeout(500);
  }

  async selectSort(sortValue: string) {
    await this.sortSelect.selectOption(sortValue);
    await this.page.waitForTimeout(500);
  }

  async getProductCardsCount() {
    return this.productCards.count();
  }

  async getAllProductNames(): Promise<string[]> {
    return this.productCards.locator('a.product-name').allInnerTexts();
  }

  async goToNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForTimeout(500);
  }

  async goToPreviousPage() {
    await this.previousPageButton.click();
    await this.page.waitForTimeout(500);
  }

  async getCurrentPage(): Promise<number> {
    const text = await this.page.getByText(/\d+ \/ \d+/).textContent();
    if (!text) return 1;
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }

  async getTotalPages(): Promise<number> {
    const text = await this.page.getByText(/\d+ \/ \d+/).textContent();
    if (!text) return 1;
    const match = text.match(/\d+\s*\/\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
}
