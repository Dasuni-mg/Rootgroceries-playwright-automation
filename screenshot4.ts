import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Test http first
  for (const url of ['http://example.com', 'https://example.com', 'https://rootsgroceries.com']) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      console.log(`OK: ${url} -> ${await page.title()}`);
    } catch (e) {
      console.error(`FAIL: ${url} -> ${e.message}`);
    }
  }

  await browser.close();
})();
