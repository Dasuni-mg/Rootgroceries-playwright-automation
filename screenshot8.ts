import { chromium } from 'playwright';
import * as fs from 'fs';

(async () => {
  const html = fs.readFileSync('playwright-dev.html', 'utf-8');
  const modifiedHtml = html
    .replace(/src="\//g, 'src="https://playwright.dev/')
    .replace(/href="\//g, 'href="https://playwright.dev/')
    .replace(/url\(\//g, 'url(https://playwright.dev/');

  fs.writeFileSync('playwright-dev-local.html', modifiedHtml);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') .replace(/^([A-Z]):/, function(_, d) { return '/' + d.toLowerCase()}) + '/playwright-dev-local.html', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'playwright-dev.png', fullPage: true });
    console.log('Screenshot saved to playwright-dev.png');
  } catch (e) {
    console.error('Error:', e.message);
  }
  await browser.close();
})();
