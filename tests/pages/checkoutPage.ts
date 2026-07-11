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

  get addressLine1Input() {
    return this.page.getByRole('textbox', { name: /address line 1/i });
  }

  get addressLine2Input() {
    return this.page.getByRole('textbox', { name: /address line 2/i });
  }

  get cityInput() {
    return this.page.getByRole('textbox', { name: /city/i });
  }

  get districtInput() {
    return this.page.getByRole('textbox', { name: /district/i });
  }

  get postalCodeInput() {
    return this.page.getByRole('textbox', { name: /postal code/i });
  }

  get phoneInput() {
    return this.page.getByRole('textbox', { name: /phone/i });
  }

  get deliveryDateInput() {
    return this.page.getByRole('textbox', { name: /delivery date/i });
  }

  get deliveryWindowSelect() {
    return this.page.getByRole('combobox', { name: /delivery window/i });
  }

  get saveAddressCheckbox() {
    return this.page.getByRole('checkbox', { name: /save this address/i });
  }

  get placeOrderButton() {
    return this.page.getByRole('button', { name: /place.*order/i });
  }

  get paymentMethodSection() {
    return this.page.locator('main').getByText('Payment method').locator('..');
  }

  get paymentFrames(): Promise<Frame[]> {
    return this._findPaymentFrames();
  }

  private async _findPaymentFrames(): Promise<Frame[]> {
    const frames: Frame[] = [];
    const allIframes = this.page.locator('iframe');
    const count = await allIframes.count();
    for (let i = 0; i < count; i++) {
      const frame = allIframes.nth(i).contentFrame();
      if (frame) {
        const src = await allIframes.nth(i).getAttribute('src').catch(() => '');
        if (src && (src.includes('onepay') || src.includes('payment') || src.includes('checkout') || src.includes('card'))) {
          frames.push(frame);
        }
      }
    }
    return frames;
  }

  async open() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await selectSriLanka(this.page);
    await this.checkoutLayout.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async fillAddress(addressLine1: string, city: string, district: string, postalCode: string, addressLine2?: string) {
    if (await this.addressLine1Input.isVisible().catch(() => false)) {
      await this.addressLine1Input.fill(addressLine1);
    }
    if (addressLine2 && await this.addressLine2Input.isVisible().catch(() => false)) {
      await this.addressLine2Input.fill(addressLine2);
    }
    if (await this.cityInput.isVisible().catch(() => false)) {
      await this.cityInput.fill(city);
    }
    if (await this.districtInput.isVisible().catch(() => false)) {
      await this.districtInput.fill(district);
    }
    if (await this.postalCodeInput.isVisible().catch(() => false)) {
      await this.postalCodeInput.fill(postalCode);
    }
  }

  async fillContact(phone: string) {
    if (await this.phoneInput.isVisible().catch(() => false)) {
      await this.phoneInput.fill(phone);
    }
  }

  async selectDeliveryWindow(window: string) {
    if (await this.deliveryWindowSelect.isVisible().catch(() => false)) {
      await this.deliveryWindowSelect.selectOption(window);
    }
  }

  async fillCardDetails(cardNumber: string, expiry: string, cvv: string) {
    const frames = await this.paymentFrames;

    if (frames.length > 0) {
      for (const frame of frames) {
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
    await this.page.waitForTimeout(2000);
  }
}
