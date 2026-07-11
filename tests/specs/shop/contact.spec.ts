import { test, expect } from '../../fixtures';

test.describe('Contact Page', () => {

  test('should display contact page with heading', async ({ contactPage }) => {
    await contactPage.open();
    await expect(contactPage.heading).toBeVisible();
    await expect(contactPage.messageHeading).toBeVisible();
  });

  test('should display contact form fields', async ({ contactPage }) => {
    await contactPage.open();
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.subjectInput).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();
    await expect(contactPage.sendButton).toBeVisible();
  });

  test('should allow filling contact form', async ({ contactPage }) => {
    await contactPage.open();
    await contactPage.nameInput.fill('Test User');
    await contactPage.emailInput.fill('test@example.com');
    await contactPage.subjectInput.fill('Test Subject');
    await contactPage.messageInput.fill('This is a test message.');

    await expect(contactPage.nameInput).toHaveValue('Test User');
    await expect(contactPage.emailInput).toHaveValue('test@example.com');
    await expect(contactPage.subjectInput).toHaveValue('Test Subject');
    await expect(contactPage.messageInput).toHaveValue('This is a test message.');
  });

});
