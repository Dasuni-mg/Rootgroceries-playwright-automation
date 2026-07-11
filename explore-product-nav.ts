import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://rootsgroceries.com/shop', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog.isVisible().catch(() => false)) {
    const sri = dialog.getByRole('button', { name: /sri lanka/i });
    if (await sri.isVisible().catch(() => false)) { await sri.click(); await page.waitForTimeout(1000); }
  }
  
  // Get product cards and try clicking
  const cards = page.locator('article.product-card');
  const count = await cards.count();
  console.log(`Product cards: ${count}`);
  
  // Check what class the product name link has
  const productLinks = page.locator('a.product-name');
  const linkCount = await productLinks.count();
  console.log(`.product-name links: ${linkCount}`);
  
  for (let i = 0; i < Math.min(3, linkCount); i++) {
    const text = await productLinks.nth(i).innerText();
    const href = await productLinks.nth(i).getAttribute('href');
    console.log(`  Link ${i}: text="${text}" href="${href}"`);
  }
  
  // Try combinations of selectors
  const allLinks = page.locator('a[href*="/product/"]');
  const allCount = await allLinks.count();
  console.log(`\nAll product links: ${allCount}`);
  
  for (let i = 0; i < Math.min(5, allCount); i++) {
    const text = await allLinks.nth(i).innerText();
    const href = await allLinks.nth(i).getAttribute('href');
    const cls = await allLinks.nth(i).getAttribute('class');
    console.log(`  Link ${i}: text="${text.trim()}" href="${href}" class="${cls}"`);
  }
  
  // Try clicking the FIRST in-stock product's NAME link
  console.log('\n--- Trying to click first in-stock product name ---');
  for (let i = 0; i < linkCount; i++) {
    const productName = await productLinks.nth(i).innerText();
    console.log(`Trying: "${productName.trim()}"`);
    await productLinks.nth(i).click();
    await page.waitForTimeout(3000);
    console.log(`  URL after click: ${page.url()}`);
    console.log(`  Title: ${await page.title()}`);
    
    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    console.log(`  h1 count: ${h1Count}`);
    if (h1Count > 0) {
      const h1Text = await h1.first().innerText();
      console.log(`  h1 text: "${h1Text}"`);
    }
    
    // Check add to cart button
    const atc = page.getByRole('button', { name: /add to cart/i });
    const atcExists = await atc.count();
    const atcEnabled = atcExists > 0 ? await atc.isEnabled().catch(() => false) : false;
    console.log(`  Add to Cart: exists=${atcExists}, enabled=${atcEnabled}`);
    
    if (atcEnabled) {
      console.log('  -> Found enabled Add to Cart button, stopping');
      break;
    }
    
    // Go back
    await page.goBack();
    await page.waitForTimeout(2000);
    console.log(`  URL after goBack: ${page.url()}`);
  }
  
  await browser.close();
})();
