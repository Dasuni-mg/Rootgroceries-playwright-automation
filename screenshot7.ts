import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-http2',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  try {
    await page.goto('https://playwright.dev', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'playwright-dev.png', fullPage: true });
    console.log('Screenshot saved to playwright-dev.png');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
  await browser.close();
})();
