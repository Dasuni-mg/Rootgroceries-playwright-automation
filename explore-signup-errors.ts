import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://rootsgroceries.com/register', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const dialog = page.getByRole('dialog', { name: /where are you shopping/i });
  if (await dialog.isVisible().catch(() => false)) {
    const sri = dialog.getByRole('button', { name: /sri lanka/i });
    if (await sri.isVisible().catch(() => false)) { await sri.click(); await page.waitForTimeout(1000); }
  }

  // Test all validation errors
  const tests = [
    { name: 'empty form', fill: {}, click: true },
    { name: 'invalid email abc', fill: { name: 'Test', email: 'abc', phone: '', password: 'Secure@123' }, click: true },
    { name: 'invalid email john@', fill: { name: 'Test', email: 'john@', phone: '', password: 'Secure@123' }, click: true },
    { name: 'short name A', fill: { name: 'A', email: 'test@test.com', phone: '', password: 'Secure@123' }, click: true },
    { name: 'special chars @@@', fill: { name: '@@@', email: 'test@test.com', phone: '', password: 'Secure@123' }, click: true },
    { name: 'sql injection name', fill: { name: "' OR '1'='1", email: 'test@test.com', phone: '', password: 'Secure@123' }, click: true },
    { name: 'xss name', fill: { name: '<script>alert(1)</script>', email: 'test@test.com', phone: '', password: 'Secure@123' }, click: true },
  ];

  for (const t of tests) {
    if (t.name !== 'empty form') {
      await page.goto('https://rootsgroceries.com/register', { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1000);
      const dialog2 = page.getByRole('dialog', { name: /where are you shopping/i });
      if (await dialog2.isVisible().catch(() => false)) {
        const sri2 = dialog2.getByRole('button', { name: /sri lanka/i });
        if (await sri2.isVisible().catch(() => false)) { await sri2.click(); await page.waitForTimeout(500); }
      }
    } else {
      // Clear fields
      await page.getByRole('textbox', { name: /^name/i }).fill('');
      await page.getByRole('textbox', { name: /email/i }).fill('');
      await page.getByRole('textbox', { name: /^password/i }).fill('');
    }

    if (t.fill.name !== undefined) {
      const nameInput = page.getByRole('textbox', { name: /^name/i });
      await nameInput.fill('');
      await nameInput.fill(t.fill.name);
    }
    if (t.fill.email !== undefined) {
      const emailInput = page.getByRole('textbox', { name: /email/i });
      await emailInput.fill('');
      await emailInput.fill(t.fill.email);
    }
    if (t.fill.phone !== undefined) {
      const phoneInput = page.getByRole('textbox', { name: /phone/i });
      await phoneInput.fill('');
      await phoneInput.fill(t.fill.phone);
    }
    if (t.fill.password !== undefined) {
      const pwdInput = page.getByRole('textbox', { name: /^password/i });
      await pwdInput.fill('');
      await pwdInput.fill(t.fill.password);
    }

    if (t.click) {
      await page.getByRole('button', { name: /create account/i }).click();
      await page.waitForTimeout(1500);
    }

    console.log(`\n=== ${t.name} ===`);
    const errors = await page.locator('small.field-error, .field-error').all();
    for (const el of errors) {
      const text = await el.innerText().catch(() => '');
      const visible = await el.isVisible().catch(() => false);
      if (text.trim() && visible) console.log(`  ERROR: "${text.trim()}"`);
    }
  }

  await browser.close();
})();
