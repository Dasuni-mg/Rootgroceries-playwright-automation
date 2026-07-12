import { Page } from '@playwright/test';
import { selectSriLanka } from '../utils/selectCountry';

export class ContactPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heading() {
    return this.page.locator('main h1');
  }

  get messageHeading() {
    return this.page.locator('main').getByRole('heading', { name: /send a message/i });
  }

  get nameInput() {
    return this.page.getByRole('textbox', { name: /name/i });
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  get subjectInput() {
    return this.page.getByRole('textbox', { name: /subject/i });
  }

  get messageInput() {
    return this.page.getByRole('textbox', { name: /message/i });
  }

  get sendButton() {
    return this.page.getByRole('button', { name: /send message/i });
  }

  async open() {
    await this.page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.heading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }
}
