# Playwright Test Framework Guidelines

## Writing Tests

### Basic Test Structure
```typescript
import { test, expect } from '../fixtures/pageFixture';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should do something', async ({ homePage }) => {
    // Test code
    expect(result).toBeTruthy();
  });
});
```

## Page Object Model

### Creating a New Page Object
1. Create a new file in `tests/pages/` extending `BasePage`
2. Define selectors as properties
3. Create methods for common actions
4. Import in `tests/pages/index.ts`

### Example
```typescript
export class ProductPage extends BasePage {
  readonly productName = '.product-name';
  
  async addToCart() {
    await this.click('.add-to-cart-btn');
  }
}
```

## Test Data Management

### Using Test Data
```typescript
import { testData } from '../data/testData';

// Access test data
const user = testData.users.validUser;
const product = testData.products.product1;
```

### Adding New Test Data
Update `tests/data/testData.ts` with new data objects.

## Fixtures

### Using Page Fixtures
```typescript
test('my test', async ({ homePage, loginPage, page }) => {
  // Use page objects from fixtures
  await homePage.navigateToHome();
});
```

## Utilities

### Logger
```typescript
import { Logger } from '../utils/Logger';

const logger = new Logger();
logger.info('Test message');
logger.error('Error message');
```

### DataGenerator
```typescript
import { DataGenerator } from '../utils/DataGenerator';

const email = DataGenerator.generateRandomEmail();
const password = DataGenerator.generateRandomPassword();
```

### WaitHelper
```typescript
import { WaitHelper } from '../utils/WaitHelper';

await WaitHelper.waitForSeconds(2);
await WaitHelper.waitWithRetry(() => myAsyncFunction(), 3, 1000);
```

## Helpers

### AssertionHelper
```typescript
import { AssertionHelper } from '../helpers/AssertionHelper';

const assertHelper = new AssertionHelper();
await assertHelper.assertTextContains(page, '.message', 'Success');
```

### NavigationHelper
```typescript
import { NavigationHelper } from '../helpers/NavigationHelper';

const navHelper = new NavigationHelper();
await navHelper.navigateTo(page, 'http://example.com');
```

## Best Practices

1. **Keep tests independent** - Each test should be able to run alone
2. **Use descriptive names** - Test names should clearly describe what they test
3. **Avoid hardcoding** - Use selectors from `tests/data/selectors.ts`
4. **Use page objects** - Reduces duplication and improves maintainability
5. **Wait properly** - Use Playwright's built-in waiting mechanisms
6. **Add logging** - Log important steps for debugging
7. **Use fixtures** - Leverage Playwright fixtures for setup/teardown
8. **Organize tests** - Group related tests in describe blocks

## Common Issues & Solutions

### Elements not found
- Check selector in browser console
- Wait for element to appear
- Use Playwright Inspector

### Tests timing out
- Increase timeout in config
- Check network/application performance
- Verify wait conditions

### Flaky tests
- Add explicit waits
- Use retries for network calls
- Check for race conditions

## Running Tests

### All tests
```bash
npm test
```

### Specific test file
```bash
npm test -- tests/specs/homePage.spec.ts
```

### Specific test
```bash
npm test -- -g "should do something"
```

### Debug mode
```bash
npm run test:debug
```

### UI mode
```bash
npm run test:ui
```

### Generate report
```bash
npm run test:report
```

## Debugging

### Inspector
```bash
npm test -- --debug
```

### VS Code Debugging
Set breakpoint and run tests in debug mode

### Screenshots
Automatically captured on failure in `playwright-report/`

### Video
Recorded on failure in `test-results/`
