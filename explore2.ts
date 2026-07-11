import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Explore product detail page
  console.log(`=== /product/unicom-polos-melluma ===`);
  await page.goto('https://rootsgroceries.com/product/unicom-polos-melluma', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log(`  ERROR: ${e.message}`));
  await page.waitForTimeout(2000);

  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog.isVisible().catch(() => false)) {
    const sri = dialog.getByRole('button', { name: /sri lanka/i });
    if (await sri.isVisible().catch(() => false)) {
      await sri.click();
      await page.waitForTimeout(1000);
    }
  }

  console.log(`  URL: ${page.url()}`);
  console.log(`  Title: ${await page.title().catch(() => 'N/A')}`);
  const headings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log(`  Headings: ${headings.join(' | ')}`);
  const buttons = await page.locator('button').all();
  const btnTexts = [];
  for (const btn of buttons) {
    const text = await btn.innerText().catch(() => '');
    if (text.trim()) btnTexts.push(text.trim());
  }
  console.log(`  Buttons: ${btnTexts.join(' | ')}`);
  const mainText = await page.locator('main').innerText().catch(() => '');
  console.log(`  Main text preview: ${mainText.substring(0, 500)}`);

  // Explore checkout after login
  console.log(`\n=== Login first, then checkout ===`);
  const loginPage = page;
  await loginPage.goto('https://rootsgroceries.com/login', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log(`  ERROR: ${e.message}`));
  await page.waitForTimeout(2000);

  const dialog2 = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog2.isVisible().catch(() => false)) {
    const sri = dialog2.getByRole('button', { name: /sri lanka/i });
    if (await sri.isVisible().catch(() => false)) {
      await sri.click();
      await page.waitForTimeout(1000);
    }
  }

  // Login
  const emailInput = page.getByRole('textbox', { name: /email/i });
  const passwordInput = page.getByRole('textbox', { name: /password/i });
  const loginBtn = page.getByRole('button', { name: /login/i });
  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill('nuwanika@gmail.com');
    await passwordInput.fill('DasuNI@96');
    await loginBtn.click();
    await page.waitForTimeout(3000);
    console.log(`  After login URL: ${page.url()}`);
  }

  // Go to checkout
  await page.goto('https://rootsgroceries.com/checkout', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log(`  ERROR checkout: ${e.message}`));
  await page.waitForTimeout(3000);
  console.log(`  Checkout URL: ${page.url()}`);
  console.log(`  Checkout Title: ${await page.title().catch(() => 'N/A')}`);
  const cHeadings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log(`  Checkout Headings: ${cHeadings.join(' | ')}`);
  const cTextboxes = await page.getByRole('textbox').all();
  const cTextboxNames = [];
  for (const tb of cTextboxes) {
    const label = await tb.getAttribute('aria-label').catch(() => '') || await tb.getAttribute('name').catch(() => '') || await tb.getAttribute('placeholder').catch(() => '');
    cTextboxNames.push(label);
  }
  console.log(`  Checkout Textboxes: ${cTextboxNames.join(' | ')}`);
  const cButtons = await page.locator('button').all();
  const cBtnTexts = [];
  for (const btn of cButtons) {
    const text = await btn.innerText().catch(() => '');
    if (text.trim()) cBtnTexts.push(text.trim());
  }
  console.log(`  Checkout Buttons: ${cBtnTexts.join(' | ')}`);

  // Explore /orders after login (authenticated)
  await page.goto('https://rootsgroceries.com/orders', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log(`  ERROR orders: ${e.message}`));
  await page.waitForTimeout(2000);
  console.log(`\n=== /orders (authenticated) ===`);
  console.log(`  URL: ${page.url()}`);
  console.log(`  Title: ${await page.title().catch(() => 'N/A')}`);
  const oHeadings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log(`  Headings: ${oHeadings.join(' | ')}`);

  // Explore /account (authenticated)
  await page.goto('https://rootsgroceries.com/account', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log(`  ERROR account: ${e.message}`));
  await page.waitForTimeout(2000);
  console.log(`\n=== /account (authenticated) ===`);
  console.log(`  URL: ${page.url()}`);
  console.log(`  Title: ${await page.title().catch(() => 'N/A')}`);
  const aHeadings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log(`  Headings: ${aHeadings.join(' | ')}`);
  const aTextboxes = await page.getByRole('textbox').all();
  const aTextboxNames = [];
  for (const tb of aTextboxes) {
    const label = await tb.getAttribute('aria-label').catch(() => '') || await tb.getAttribute('name').catch(() => '') || await tb.getAttribute('placeholder').catch(() => '');
    aTextboxNames.push(label);
  }
  console.log(`  Textboxes: ${aTextboxNames.join(' | ')}`);

  await browser.close();
})();
