# Playwright Test Automation Framework for RootGroceries

## Project Structure

```
tests/
├── pages/              # Page Object Models
├── specs/              # Test specifications
├── fixtures/           # Playwright fixtures
├── utils/              # Utility classes
├── helpers/            # Helper functions
├── data/               # Test data and constants
├── config/             # Configuration files
└── reports/            # Test reports and screenshots
```

## Installation

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npx playwright test --headed
```

### Run specific test file
```bash
npx playwright test tests/specs/homePage.spec.ts
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

## Configuration

Environment variables can be set in `.env` file:

```
BASE_URL=http://localhost:3000
HEADLESS=true
SLOW_MO=0
RETRIES=2
```

## Features

- ✅ Page Object Model (POM) design pattern
- ✅ TypeScript support
- ✅ Comprehensive test fixtures
- ✅ Utility helpers
- ✅ Test data management
- ✅ Logging and reporting
- ✅ Cross-browser testing
- ✅ Screenshots and videos on failure
- ✅ Multiple environment support

## Project Structure Details

### Pages (Page Object Model)
- `BasePage.ts` - Base class with common methods
- `HomePage.ts` - Home page object
- `LoginPage.ts` - Login page object

### Utilities
- `Logger.ts` - Logging utility
- `DataGenerator.ts` - Random data generation
- `WaitHelper.ts` - Wait and retry helpers

### Helpers
- `AssertionHelper.ts` - Custom assertions
- `NavigationHelper.ts` - Navigation utilities

### Data
- `testData.ts` - Test data objects
- `urls.ts` - URL constants
- `selectors.ts` - CSS selectors

### Tests
- `homePage.spec.ts` - Home page tests
- `loginPage.spec.ts` - Login tests
- `cart.spec.ts` - Cart tests

## Adding New Tests

1. Create a page object in `tests/pages/`
2. Create test specs in `tests/specs/`
3. Use fixtures from `tests/fixtures/`
4. Reference test data from `tests/data/`

## Best Practices

- Use Page Object Model for maintainability
- Keep selectors in `tests/data/selectors.ts`
- Use fixtures for page initialization
- Add meaningful test descriptions
- Use custom assertions from helpers
- Log important actions

## Troubleshooting

### Tests fail with network errors
- Check if the application is running
- Verify BASE_URL in `.env`

### Elements not found
- Check selectors in `tests/data/selectors.ts`
- Use Playwright Inspector to debug

### Slow test execution
- Adjust retries in `tests/config/config.ts`
- Check if application is responsive

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
