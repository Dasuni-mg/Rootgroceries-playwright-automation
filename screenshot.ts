import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('https://playwright.dev', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'playwright-dev.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to playwright-dev.png');
})();
