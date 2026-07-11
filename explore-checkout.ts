import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Login first
  await page.goto('https://rootsgroceries.com/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog.isVisible().catch(() => false)) {
    await dialog.getByRole('button', { name: /sri lanka/i }).click();
    await page.waitForTimeout(1000);
  }
  await page.getByRole('textbox', { name: /email/i }).fill('nuwanika@gmail.com');
  await page.getByRole('textbox', { name: /password/i }).fill('DasuNI@96');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForTimeout(2000);

  // Add item to cart
  await page.goto('https://rootsgroceries.com/product/unicom-polos-melluma', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: /add to cart/i }).click();
  await page.waitForTimeout(2000);

  // Go to checkout
  await page.goto('https://rootsgroceries.com/checkout', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Checkout URL:', page.url());
  console.log('Checkout title:', await page.title());

  const headings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log('Headings:', headings);

  // Textboxes
  const textboxes = await page.getByRole('textbox').all();
  console.log(`\nTextboxes (${textboxes.length}):`);
  for (const tb of textboxes) {
    const aria = await tb.getAttribute('aria-label') || '';
    const name = await tb.getAttribute('name') || '';
    const placeholder = await tb.getAttribute('placeholder') || '';
    const visible = await tb.isVisible();
    console.log(`  aria="${aria}" name="${name}" placeholder="${placeholder}" visible=${visible}`);
  }

  // Combos
  const combos = await page.getByRole('combobox').all();
  console.log(`\nCombos (${combos.length}):`);
  for (const c of combos) {
    const aria = await c.getAttribute('aria-label') || '';
    const name = await c.getAttribute('name') || '';
    const visible = await c.isVisible();
    const options = await c.locator('option').all();
    const optTexts = [];
    for (const o of options) {
      const val = await o.getAttribute('value');
      const txt = await o.innerText();
      if (val || txt.trim()) optTexts.push(`${val}=${txt.trim()}`);
    }
    console.log(`  aria="${aria}" name="${name}" visible=${visible}`);
    console.log(`  options: [${optTexts.join(', ')}]`);
  }

  // Buttons
  const buttons = await page.getByRole('button').all();
  console.log(`\nButtons (${buttons.length}):`);
  for (const b of buttons) {
    const text = await b.innerText();
    const visible = await b.isVisible();
    const enabled = await b.isEnabled();
    if (text.trim()) console.log(`  "${text.trim()}" visible=${visible} enabled=${enabled}`);
  }

  // Checkboxes
  const checks = await page.getByRole('checkbox').all();
  console.log(`\nCheckboxes (${checks.length}):`);
  for (const c of checks) {
    const aria = await c.getAttribute('aria-label') || '';
    const visible = await c.isVisible();
    console.log(`  aria="${aria}" visible=${visible}`);
  }

  // See iframes for payment
  const iframes = page.locator('iframe');
  const iframeCount = await iframes.count();
  console.log(`\niFrames: ${iframeCount}`);
  for (let i = 0; i < iframeCount; i++) {
    const src = await iframes.nth(i).getAttribute('src');
    console.log(`  iframe ${i}: ${src}`);
  }

  await browser.close();
})();
