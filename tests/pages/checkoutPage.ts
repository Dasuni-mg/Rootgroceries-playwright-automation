import { Page, Frame } from '@playwright/test';
import { selectSriLanka } from '../../tests/utils/selectCountry';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get checkoutLayout() {
    return this.page.locator('.checkout-layout');
  }

  get checkoutForm() {
    return this.page.locator('.checkout-form');
  }

  get heading() {
    return this.page.locator('.checkout-form h1');
  }

  get orderSummary() {
    return this.page.locator('.order-summary');
  }

  get fullNameInput() {
    return this.page.getByRole('textbox', { name: /full name|name/i });
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  get phoneInput() {
    return this.page.getByRole('textbox', { name: /phone|mobile/i });
  }

  get addressInput() {
    return this.page.getByRole('textbox', { name: /address|street|delivery/i });
  }

  get cityInput() {
    return this.page.getByRole('textbox', { name: /city|town/i });
  }

  get placeOrderButton() {
    return this.page.getByRole('button', { name: /place order|pay now|pay|complete order/i });
  }

  get cardholderNameInput() {
    return this.page.getByRole('textbox', { name: /cardholder|card holder|name on card/i });
  }

  get paymentFrame(): Promise<Frame | null> {
    return this._findPaymentFrame();
  }

  private async _findPaymentFrame(): Promise<Frame | null> {
    const iframe = this.page.locator('iframe[src*="onepay"], iframe[title*="card"], iframe[id*="card"], iframe[class*="card"]');
    if (await iframe.count().then(c => c > 0)) {
      return iframe.first().contentFrame();
    }
    const allIframes = this.page.locator('iframe');
    const count = await allIframes.count();
    for (let i = 0; i < count; i++) {
      const frame = allIframes.nth(i).contentFrame();
      if (frame) {
        const src = await allIframes.nth(i).getAttribute('src').catch(() => '');
        if (src && (src.includes('onepay') || src.includes('card') || src.includes('payment'))) {
          return frame;
        }
      }
    }
    return null;
  }

  async open() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.checkoutLayout.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async fillContactInfo(fullName: string, email: string, phone: string) {
    if (await this.fullNameInput.isVisible().catch(() => false)) {
      await this.fullNameInput.fill(fullName);
    }
    if (await this.emailInput.isVisible().catch(() => false)) {
      await this.emailInput.fill(email);
    }
    if (await this.phoneInput.isVisible().catch(() => false)) {
      await this.phoneInput.fill(phone);
    }
  }

  async fillShippingAddress(address: string, city: string) {
    if (await this.addressInput.isVisible().catch(() => false)) {
      await this.addressInput.fill(address);
    }
    if (await this.cityInput.isVisible().catch(() => false)) {
      await this.cityInput.fill(city);
    }
  }

  async fillCardDetails(cardNumber: string, expiry: string, cvv: string) {
    const frame = await this.paymentFrame;

    if (frame) {
      const cardInput = frame.locator('input[name="cardnumber"], input[name="card-number"], input[aria-label*="card number" i], input[placeholder*="card number" i]');
      const expiryInput = frame.locator('input[name="expiry"], input[name="exp-date"], input[aria-label*="expir" i], input[placeholder*="mm" i]');
      const cvvInput = frame.locator('input[name="cvv"], input[name="cvc"], input[aria-label*="cvv" i], input[aria-label*="cvc" i], input[placeholder*="cvv" i], input[placeholder*="cvc" i]');

      if (await cardInput.isVisible().catch(() => false)) {
        await cardInput.fill(cardNumber);
      }
      if (await expiryInput.isVisible().catch(() => false)) {
        await expiryInput.fill(expiry);
      }
      if (await cvvInput.isVisible().catch(() => false)) {
        await cvvInput.fill(cvv);
      }
    } else {
      const cardInput = this.page.locator('input[name="cardnumber"], input[name="card-number"], input[aria-label*="card number" i]');
      const expiryInput = this.page.locator('input[name="expiry"], input[name="exp-date"], input[aria-label*="expir" i]');
      const cvvInput = this.page.locator('input[name="cvv"], input[name="cvc"], input[aria-label*="cvv" i]');

      if (await cardInput.isVisible().catch(() => false)) {
        await cardInput.fill(cardNumber);
      }
      if (await expiryInput.isVisible().catch(() => false)) {
        await expiryInput.fill(expiry);
      }
      if (await cvvInput.isVisible().catch(() => false)) {
        await cvvInput.fill(cvv);
      }
    }
    await this.page.waitForTimeout(500);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForTimeout(1000);
  }
}
