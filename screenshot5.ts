import { firefox } from 'playwright';

(async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    await page.goto('https://playwright.dev', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'playwright-dev.png', fullPage: true });
    console.log('Screenshot saved to playwright-dev.png');
  } catch (e) {
    console.error('Error:', e.message);
  }
  await browser.close();
})();
