import { ShopPage } from '../../pages/shopPage';
import { selectSriLanka } from '../../utils/selectCountry';
import { Page } from '@playwright/test';

async function closeCountryGate(page: Page) {
  await selectSriLanka(page);
}

export async function getInStockProductSlug(shopPage: ShopPage): Promise<string | null> {
  const page: Page = shopPage.page;
  await shopPage.open();

  const productCards = shopPage.productCards;
  const count = await productCards.count();
  if (count === 0) return null;

  for (let i = 0; i < count; i++) {
    const href = await productCards.nth(i).locator('a.product-name').getAttribute('href');
    if (!href) continue;

    const slug = href.replace('/product/', '');
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    await closeCountryGate(page);
    await page.waitForTimeout(1000);

    const atcButton = page.getByRole('button', { name: /add to cart/i });
    if (await atcButton.isVisible().catch(() => false) && await atcButton.isEnabled().catch(() => false)) {
      return slug;
    }
  }
  return null;
}

export async function getFirstProductSlug(shopPage: ShopPage): Promise<string | null> {
  await shopPage.open();
  const href = await shopPage.productCards.locator('a.product-name').first().getAttribute('href');
  if (!href) return null;
  return href.replace('/product/', '');
}
