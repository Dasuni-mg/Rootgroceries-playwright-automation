import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const pages = ['/', '/shop', '/cart', '/login', '/register', '/account', '/orders', '/contact', '/forgot-password'];

  for (const url of pages) {
    console.log(`\n=== ${url} ===`);
    await page.goto(`https://rootsgroceries.com${url}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log(`  ERROR: ${e.message}`));
    await page.waitForTimeout(2000);

    // Dismiss country gate if present
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

    // Get all headings
    const headings = await page.locator('h1, h2, h3').allInnerTexts();
    console.log(`  Headings: ${headings.join(' | ')}`);

    // Get all links
    const links = await page.locator('a').all();
    const linkInfo = [];
    for (const link of links.slice(0, 30)) {
      const text = await link.innerText().catch(() => '');
      const href = await link.getAttribute('href').catch(() => '');
      if (text.trim()) linkInfo.push(`${text.trim()} -> ${href}`);
    }
    console.log(`  Links (first 30):`);
    linkInfo.forEach(l => console.log(`    ${l}`));

    // Get buttons
    const buttons = await page.locator('button').all();
    const btnTexts = [];
    for (const btn of buttons) {
      const text = await btn.innerText().catch(() => '');
      if (text.trim()) btnTexts.push(text.trim());
    }
    console.log(`  Buttons: ${btnTexts.join(' | ')}`);

    // Get key structural elements
    const main = await page.locator('main').innerHTML().catch(() => '');
    const hasProductGrid = main.includes('product-grid') || main.includes('product-card');
    const hasForm = main.includes('form') || main.includes('input');
    console.log(`  Has product grid: ${hasProductGrid}, Has form: ${hasForm}`);

    // Get role-based elements
    const textboxes = await page.getByRole('textbox').all();
    const textboxNames = [];
    for (const tb of textboxes) {
      const label = await tb.getAttribute('name').catch(() => '');
      const placeholder = await tb.getAttribute('placeholder').catch(() => '');
      const ariaLabel = await tb.getAttribute('aria-label').catch(() => '');
      textboxNames.push(label || placeholder || ariaLabel || 'unnamed');
    }
    console.log(`  Textboxes: ${textboxNames.join(' | ')}`);

    // Get comboboxes
    const combos = await page.getByRole('combobox').all();
    const comboLabels = [];
    for (const c of combos) {
      const label = await c.getAttribute('aria-label').catch(() => '');
      const name = await c.getAttribute('name').catch(() => '');
      comboLabels.push(label || name || 'unnamed');
    }
    console.log(`  Comboboxes: ${comboLabels.join(' | ')}`);
  }

  await browser.close();
})();
