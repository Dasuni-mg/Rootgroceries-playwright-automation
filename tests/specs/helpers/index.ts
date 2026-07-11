import { ShopPage } from '../../pages/shopPage';

export async function getInStockProductSlug(shopPage: ShopPage): Promise<string | null> {
  await shopPage.open();

  const productCards = shopPage.productCards;
  const count = await productCards.count();
  if (count === 0) return null;

  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);
    const stockText = await card.innerText().catch(() => '');
    if (!/in stock/i.test(stockText)) continue;

    const href = await card.locator('a.product-name').getAttribute('href').catch(() => null);
    if (!href) continue;
    return href.replace('/product/', '');
  }
  return null;
}

export async function getFirstProductSlug(shopPage: ShopPage): Promise<string | null> {
  await shopPage.open();
  const href = await shopPage.productCards.locator('a.product-name').first().getAttribute('href').catch(() => null);
  if (!href) return null;
  return href.replace('/product/', '');
}
