import { Page } from '@playwright/test';

export async function selectSriLanka(page: Page): Promise<boolean> {
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  try {
    await dialog.waitFor({ state: 'visible', timeout: 3000 });
  } catch {
    return false;
  }

  // Try clicking the enabled Sri Lanka country-card button
  const countryCards = dialog.locator('button.country-card');
  const cardCount = await countryCards.count().catch(() => 0);
  for (let i = 0; i < cardCount; i++) {
    const text = await countryCards.nth(i).innerText().catch(() => '');
    const disabled = await countryCards.nth(i).isDisabled().catch(() => true);
    if (/sri lanka/i.test(text) && !disabled) {
      await countryCards.nth(i).click({ force: true });
      await page.waitForTimeout(1500);
      const gone = !(await dialog.isVisible().catch(() => false));
      if (gone) return true;
    }
  }

  // Force-close: remove dialog from DOM + escape key
  await page.evaluate(() => {
    const gate = document.querySelector<HTMLElement>('.country-gate');
    if (gate) gate.remove();
  }).catch(() => {});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  return !(await dialog.isVisible().catch(() => false));
}
