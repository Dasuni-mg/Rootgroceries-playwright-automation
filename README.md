# Roots Groceries — Playwright Test Automation

End-to-end test automation for [Roots Groceries](https://rootsgroceries.com) using **Playwright** + **TypeScript**, built with industry-standard Page Object Model and custom fixtures.

---

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# View HTML report
npx playwright show-report
```

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Test Framework | Playwright Test |
| Language | TypeScript |
| Reporter | HTML + JSON + Console |
| Artifacts | Screenshots, Video, Trace (on failure) |
| CI | GitHub Actions |

---

## Project Structure

```
.
├── tests/
│   ├── specs/                    # Test files (one per feature)
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   ├── signup.spec.ts
│   │   │   ├── forgot-password.spec.ts
│   │   │   └── account.spec.ts
│   │   ├── shop/
│   │   │   ├── home.spec.ts
│   │   │   ├── cart.spec.ts
│   │   │   ├── checkout.spec.ts
│   │   │   ├── search.spec.ts
│   │   │   ├── product-preview.spec.ts
│   │   │   ├── orders.spec.ts
│   │   │   └── contact.spec.ts
│   │   └── helpers/
│   │       └── index.ts
│   ├── pages/                    # Page Objects (one per page)
│   │   ├── auth/
│   │   │   ├── loginPage.ts
│   │   │   └── signupPage.ts
│   │   ├── homePage.ts
│   │   ├── shopPage.ts
│   │   ├── productPage.ts
│   │   ├── cartPage.ts
│   │   ├── checkoutPage.ts
│   │   ├── ordersPage.ts
│   │   ├── contactPage.ts
│   │   ├── accountPage.ts
│   │   └── forgotPasswordPage.ts
│   ├── data/                     # Test data (separate from logic)
│   │   ├── loginData.ts
│   │   └── signupData.ts
│   ├── utils/
│   │   └── selectCountry.ts
│   ├── fixtures.ts               # Custom fixtures (DI container)
│   └── helpers/
│       └── helpers/
│           └── index.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## Running Tests

```bash
# All tests
npm test

# Smoke tests only (critical path)
npx playwright test --grep smoke

# Regression tests only (full suite)
npx playwright test --grep regression

# Single file
npx playwright test tests/specs/auth/login.spec.ts

# Single test
npx playwright test -g "Login with valid credentials"

# Headed mode (see the browser)
npx playwright test --headed

# Debug mode (step through with inspector)
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# Parallel (faster)
npx playwright test --workers=4

# Serial (deterministic)
npx playwright test --workers=1
```

---

## Test Tagging System

Tests are tagged inline in the test name. Use tags to run subsets.

| Tag | Purpose | When to Run |
|------|---------|-------------|
| `@smoke` | Critical user paths | Every commit / PR |
| `@regression` | Full validation suite | Before release |

**Example:**
```ts
test('Login with valid credentials @smoke @regression', async ({ loginPage }) => {
  // This test runs in both smoke and regression
});

test('Username: <script>@regression', async ({ signupPage }) => {
  // This test only runs in regression
});
```

**Run by tag:**
```bash
npx playwright test --grep smoke        # 11 tests
npx playwright test --grep regression   # 55+ tests
```

---

## Page Object Model

Every page has a corresponding class in `tests/pages/`. Tests never touch selectors directly.

```ts
// tests/pages/auth/loginPage.ts
export class LoginPage {
  get emailInput() { return this.page.getByRole('textbox', { name: /email/i }); }
  get passwordInput() { return this.page.getByRole('textbox', { name: /password/i }); }
  get loginButton() { return this.page.getByRole('button', { name: /login/i }); }

  constructor(private readonly page: Page) {}

  async open() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

**Three rules:**
1. No assertions inside page objects
2. Selectors use `getByRole` (not fragile CSS)
3. Each method does one thing

---

## Fixtures (Dependency Injection)

Fixtures inject page objects into tests automatically.

```ts
// tests/fixtures.ts
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  signupPage: async ({ page }, use) => { await use(new SignupPage(page)); },
  // ... more fixtures
});
```

**Usage in tests:**
```ts
import { test, expect } from '../../fixtures';

test('works', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.login('user@test.com', 'pass');
  await expect(page).toHaveURL('/account');
});
```

---

## Test Data

Data lives in `tests/data/` — separate from test logic.

```ts
// tests/data/signupData.ts
export const signupData = {
  validUser: {
    username: "janedoe",
    email: `jane${uid}@test.com`,
    phone: "0771234567",
    password: "Secure@123"
  },
  username: [
    { value: "Alice", error: "" },
    { value: "A", error: "Name is required" },
    { value: "' OR '1'='1", error: "" },
  ],
};
```

**Data-driven tests** iterate over matrices:
```ts
signupData.username.forEach(({ value, error }) => {
  test(`Username: ${value}`, async ({ signupPage }) => { ... });
});
```

---

## Artifacts

Captured automatically on failure:

| Artifact | Location | What It Contains |
|----------|----------|------------------|
| Screenshot | `test-results/` | PNG of the page at failure |
| Video | `test-results/` | WebM recording of the test |
| Trace | `test-results/` | Full timeline, network, console |

**View a trace:**
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## Configuration

`playwright.config.ts` controls everything:

| Setting | Value | Purpose |
|---------|-------|---------|
| `testDir` | `./tests/specs` | Where tests live |
| `timeout` | `30000ms` | Per-test timeout |
| `retries` | `0` (local) / `2` (CI) | Retry flaky tests |
| `workers` | `2` (CI) | Parallel execution |
| `trace` | `on` | Always capture traces |
| `screenshot` | `only-on-failure` | Capture on failure |
| `video` | `retain-on-failure` | Keep video on failure |
| `baseURL` | `rootsgroceries.com` | All relative URLs |

---

## CI/CD

Tests run automatically via GitHub Actions on push/PR. The workflow:

1. Install dependencies
2. Install Playwright browsers
3. Run smoke tests (fast feedback)
4. Run regression tests (full coverage)
5. Upload HTML report as artifact

---

## Best Practices

| Do | Don't |
|----|-------|
| Use `getByRole()` selectors | Use fragile CSS selectors |
| Keep data in `tests/data/` | Hardcode values in tests |
| Use fixtures for page objects | Instantiate `new LoginPage(page)` in tests |
| Assert with `expect()` auto-waiting | Use `waitForTimeout()` |
| One assertion per concept | Stack unrelated assertions |
| Name tests descriptively | Use vague names like "test 1" |
| Tag tests with `@smoke`/`@regression` | Leave tests untagged |

---

## Resources

- [Playwright Docs](https://playwright.dev)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
