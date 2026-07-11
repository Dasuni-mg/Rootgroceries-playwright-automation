import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Login page
  await page.goto('https://rootsgroceries.com/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Dismiss country gate
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog.isVisible().catch(() => false)) {
    const sri = dialog.getByRole('button', { name: /sri lanka/i });
    if (await sri.isVisible().catch(() => false)) { await sri.click(); await page.waitForTimeout(1000); }
  }
  
  // Try invalid login
  await page.getByRole('textbox', { name: /email/i }).fill('wrong@example.com');
  await page.getByRole('textbox', { name: /password/i }).fill('WrongPass');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForTimeout(3000);
  
  console.log('After invalid login URL:', page.url());
  console.log('After invalid login title:', await page.title());
  
  // Find error messages
  const smalls = await page.locator('small, .error, .field-error, [class*="error"], [class*="alert"]').all();
  console.log(`\nError elements found: ${smalls.length}`);
  for (const el of smalls) {
    const text = await el.innerText().catch(() => '');
    const visible = await el.isVisible().catch(() => false);
    const className = await el.getAttribute('class').catch(() => '');
    const tag = await el.evaluate(el => el.tagName).catch(() => '');
    if (text.trim()) console.log(`  <${tag} class="${className}"> visible=${visible} text="${text.trim()}"`);
  }
  
  // Check for any alert-like elements
  const alerts = await page.getByRole('alert').all();
  console.log(`\nrole=alert elements: ${alerts.length}`);
  
  // Try valid login
  await page.goto('https://rootsgroceries.com/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const dialog2 = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog2.isVisible().catch(() => false)) {
    const sri2 = dialog2.getByRole('button', { name: /sri lanka/i });
    if (await sri2.isVisible().catch(() => false)) { await sri2.click(); await page.waitForTimeout(1000); }
  }
  
  await page.getByRole('textbox', { name: /email/i }).fill('nuwanika@gmail.com');
  await page.getByRole('textbox', { name: /password/i }).fill('DasuNI@96');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForTimeout(3000);
  console.log('\nAfter valid login URL:', page.url());
  console.log('After valid login title:', await page.title());
  
  // Now explore signup page for actual error messages
  await page.goto('https://rootsgroceries.com/register', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const dialog3 = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog3.isVisible().catch(() => false)) {
    const sri3 = dialog3.getByRole('button', { name: /sri lanka/i });
    if (await sri3.isVisible().catch(() => false)) { await sri3.click(); await page.waitForTimeout(1000); }
  }
  
  // Test email errors
  const emailInput = page.getByRole('textbox', { name: /email/i });
  await emailInput.fill('abc');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(1000);
  
  const emailErrors = await page.locator('small, .field-error').all();
  console.log('\n=== Signup error elements ===');
  for (const el of emailErrors) {
    const text = await el.innerText().catch(() => '');
    const visible = await el.isVisible().catch(() => false);
    if (text.trim()) console.log(`  visible=${visible} text="${text.trim()}"`);
  }
  
  // Test what happens with empty fields
  await page.goto('https://rootsgroceries.com/register', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const dialog4 = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog4.isVisible().catch(() => false)) {
    const sri4 = dialog4.getByRole('button', { name: /sri lanka/i });
    if (await sri4.isVisible().catch(() => false)) { await sri4.click(); await page.waitForTimeout(1000); }
  }
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(1000);
  
  const allErrors = await page.locator('small, .field-error').all();
  console.log('\n=== Empty form errors ===');
  for (const el of allErrors) {
    const text = await el.innerText().catch(() => '');
    const visible = await el.isVisible().catch(() => false);
    if (text.trim()) console.log(`  visible=${visible} text="${text.trim()}"`);
  }
  
  // Find password error text with weak password
  await page.getByRole('textbox', { name: /^name/i }).fill('Test User');
  await page.getByRole('textbox', { name: /email/i }).fill('test@test.com');
  await page.getByRole('textbox', { name: /^password/i }).fill('weak');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(1000);
  
  const pwdErrors = await page.locator('small, .field-error').all();
  console.log('\n=== Weak password errors ===');
  for (const el of pwdErrors) {
    const text = await el.innerText().catch(() => '');
    const visible = await el.isVisible().catch(() => false);
    if (text.trim()) console.log(`  visible=${visible} text="${text.trim()}"`);
  }
  
  await browser.close();
})();
