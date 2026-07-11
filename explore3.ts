import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Shop page - combos
  await page.goto('https://rootsgroceries.com/shop', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog.isVisible().catch(() => false)) {
    const sri = dialog.getByRole('button', { name: /sri lanka/i });
    if (await sri.isVisible().catch(() => false)) { await sri.click(); await page.waitForTimeout(1000); }
  }
  console.log('=== Shop combos ===');
  const combos = await page.getByRole('combobox').all();
  for (const c of combos) {
    const label = await c.getAttribute('aria-label').catch(() => '');
    const name = await c.getAttribute('name').catch(() => '');
    const id = await c.getAttribute('id').catch(() => '');
    const opts = await c.locator('option').all();
    const optTexts = [];
    for (const o of opts) {
      const val = await o.getAttribute('value').catch(() => '');
      const txt = await o.innerText().catch(() => '');
      optTexts.push(`${val}=${txt}`);
    }
    console.log(`  ${label || name || id}: [${optTexts.join(', ')}]`);
  }

  // Checkbox on shop
  console.log('\n=== Shop checkboxes ===');
  const chks = await page.getByRole('checkbox').all();
  for (const ch of chks) {
    const label = await ch.getAttribute('aria-label').catch(() => '');
    const checked = await ch.isChecked().catch(() => false);
    console.log(`  ${label || 'unnamed'}: checked=${checked}`);
  }

  // Add item to cart then go to checkout
  await page.goto('https://rootsgroceries.com/product/unicom-polos-melluma', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const atcBtn = page.getByRole('button', { name: /add to cart/i });
  if (await atcBtn.isVisible().catch(() => false)) {
    await atcBtn.click();
    await page.waitForTimeout(2000);
    console.log('\n=== After Add to Cart ===');
  }

  // Go to checkout directly
  await page.goto('https://rootsgroceries.com/checkout', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log(`\n=== Checkout (with item in cart) ===`);
  console.log(`  URL: ${page.url()}`);
  const cHeadings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log(`  Headings: ${cHeadings.join(' | ')}`);
  const cTextboxes = await page.getByRole('textbox').all();
  for (const tb of cTextboxes) {
    const label = await tb.getAttribute('aria-label').catch(() => '') || await tb.getAttribute('name').catch(() => '') || await tb.getAttribute('placeholder').catch(() => '');
    const visible = await tb.isVisible().catch(() => false);
    if (label) console.log(`  Textbox: ${label} visible=${visible}`);
  }
  const cButtons = await page.locator('button').all();
  for (const btn of cButtons) {
    const text = await btn.innerText().catch(() => '');
    if (text.trim()) console.log(`  Button: "${text.trim()}"`);
  }
  const cCombos = await page.getByRole('combobox').all();
  for (const c of cCombos) {
    const label = await c.getAttribute('aria-label').catch(() => '');
    const opts = await c.locator('option').all();
    const optTexts = [];
    for (const o of opts) {
      const txt = await o.innerText().catch(() => '');
      if (txt.trim()) optTexts.push(txt.trim());
    }
    console.log(`  Combo ${label}: [${optTexts.join(', ')}]`);
  }
  const mainText = await page.locator('main').innerText().catch(() => '');
  console.log(`  Main: ${mainText.substring(0, 800)}`);

  await browser.close();
})();
