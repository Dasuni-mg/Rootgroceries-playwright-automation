import { Page } from '@playwright/test';

export async function selectSriLanka(page: Page): Promise<boolean> {
  // Wait for the country gate dialog to appear (it may load after domcontentloaded)
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i }).first();
  try {
    await dialog.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return false; // no dialog, nothing to do
  }

  // Try clicking the Sri Lanka card if enabled
  const sri = dialog.locator('button:has-text("Sri Lanka")').first();
  if (await sri.isVisible().catch(() => false) && await sri.isEnabled().catch(() => false)) {
    await sri.click();
    await page.waitForLoadState('networkidle').catch(() => null);
    // Check if dialog was dismissed (may have navigated)
    const stillOpen = await dialog.isVisible().catch(() => false);
    if (!stillOpen) return true;
  }

  // Force-close the dialog: remove it from DOM + escape key
  await page.evaluate(() => {
    const gate = document.querySelector<HTMLElement>('[class*="country-gate"], [role="dialog"][aria-modal="true"]');
    if (gate) gate.remove();
  }).catch(() => {});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Verify it's gone
  const closed = !(await dialog.isVisible().catch(() => false));
  return closed;
}
