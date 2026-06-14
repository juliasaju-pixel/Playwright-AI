# Playwright JavaScript Automation Guardrails & Coding Standards

## General Rules

- **MANDATORY:** All test cases MUST follow the Page Object Model (POM) pattern.
- Use **Jest** as the test runner with `@playwright/test` or the native Playwright test runner.
- Every test method MUST include a JSDoc comment explaining the test purpose.
- Use Playwright's built-in auto-waiting. DO NOT use `setTimeout()` or `page.waitForTimeout()` unless absolutely necessary.
- Always run tests in **Chromium** browser only for this demo.
- All tests MUST use the **async/await** pattern with Playwright's async API.

---

## Existing File Immutability (HIGHEST PRIORITY)

- **CRITICAL:** NEVER modify, rename, reorder, or delete any existing test file or test function.
- **CRITICAL:** NEVER change existing fixtures in `playwright.config.js` or existing constants in `utils/constants.js`.
- Adding a new test MUST NOT break any previously passing test.
- New code must be **appended only** — at the bottom of the relevant class or file.
- If a conflict arises, surface it as an inline comment. DO NOT auto-resolve silently.

| Scenario | Allowed? |
|---|---|
| Add a new test function inside an existing test file | ✅ Yes — append only |
| Add a new test file | ✅ Yes |
| Edit an existing `test()` function | ❌ No |
| Rename or reorder existing tests | ❌ No |
| Change existing fixtures in `playwright.config.js` | ❌ No |
| Add a new fixture | ✅ Yes — append only |
| Add new constants to `utils/constants.js` | ✅ Yes — env vars, credentials, test data only |
| Change or remove existing constants | ❌ No |
| Modify existing page object methods | ❌ No |
| Add new methods to an existing page object | ✅ Yes — append only |

---

## Page Object Model (POM) Rules

- **CRITICAL:** Create separate Page Object classes in a `pages/` directory.
- Each Page Object class MUST represent a single page or component.
- Page Object classes should contain:
  - Locators defined as **static class-level string constants** (`UPPER_SNAKE_CASE`)
  - Action methods (e.g., `enterUsername()`, `clickLoginButton()`)
  - Getter methods that return values for assertions (e.g., `getErrorMessage()`, `isLoggedIn()`)
- **CRITICAL:** DO NOT place any `expect()` assertions inside Page Object classes.
- **CRITICAL:** DO NOT hardcode string literals inline inside methods — define all locators as static class-level constants.
- **CRITICAL:** Only import from `utils/constants.js` for env config (`BASE_URL`), credentials, error messages, and test data — NOT for locator strings.
- Use descriptive method names in `camelCase` that clearly indicate the action being performed.
- Keep Page Objects focused on UI interactions only — no test logic.

```js
// ✅ CORRECT — Locators as static class constants, env config from utils/constants.js
const { BASE_URL } = require('../utils/constants');

class LoginPage {
  // Locators — defined here, not in constants.js
  static USERNAME_FIELD = '#user-name';
  static PASSWORD_FIELD = '#password';
  static LOGIN_BUTTON = '#login-button';
  static INVENTORY_CONTAINER = '[data-test="inventory-container"]';

  constructor(page) {
    this.page = page;
  }

  /** Navigate to the login page. */
  async navigate() {
    await this.page.goto(BASE_URL);
  }

  /** Type the username into the username input field. */
  async enterUsername(username) {
    await this.page.locator(LoginPage.USERNAME_FIELD).fill(username);
  }

  /** Click the login submit button. */
  async clickLoginButton() {
    await this.page.locator(LoginPage.LOGIN_BUTTON).click();
  }

  /** Return true if the inventory container is visible after login. */
  async isLoggedIn() {
    return this.page.locator(LoginPage.INVENTORY_CONTAINER).isVisible();
  }
}

module.exports = { LoginPage };
` `` 

` ``js
// ❌ WRONG — Raw selectors and actions directly in test functions
test('login', async ({ page }) => {
  await page.fill('#user-name', 'standard_user');   // Forbidden: raw selector in test
  await page.click('#login-button');                 // Forbidden: action outside page object
  await expect(page.locator('#inventory_container')).toBeVisible();
});
` ``

---

## Locator Strategy

- **Priority Order:** Use locators in this order of preference:
  1. `getByRole()` — semantic roles like `button`, `textbox`, `heading`
  2. `getByLabel()` — for form fields with visible labels
  3. `getByPlaceholder()` — for input fields with placeholder text
  4. `getByTestId()` — when `data-testid` attributes are available
  5. `getByText()` — for elements identified by unique visible text
  6. `page.locator()` with CSS selectors — only as a last resort
- **CRITICAL:** NEVER use XPath locators.
- **CRITICAL:** Avoid fragile selectors (e.g., `nth-child`, deeply nested CSS chains).
- Define all locator strings as **static class-level constants** (`UPPER_SNAKE_CASE`) in the Page Object class — NOT in `utils/constants.js`.

---

## Wait Strategy

- **CRITICAL:** DO NOT use `page.waitForTimeout()` with hardcoded delays.
- **CRITICAL:** DO NOT use `setTimeout()` anywhere in the codebase.
- Rely on Playwright's auto-waiting for standard actions (`click`, `fill`, `check`, etc.).
- Use `page.waitForLoadState('networkidle')` or `page.waitForLoadState('domcontentloaded')` when explicit load state checking is needed.
- Use `page.waitForSelector()` only when an element requires explicit waiting beyond auto-waiting.
- Use `page.waitForURL()` to wait for navigation to a specific URL.

` ``js
// ✅ CORRECT — Use Playwright's built-in waiting mechanisms
await this.page.waitForLoadState('networkidle');
await this.page.waitForURL('**/inventory.html');

// ❌ WRONG — Hardcoded delays
await new Promise(r => setTimeout(r, 3000));  // Forbidden
await this.page.waitForTimeout(3000);          // Forbidden
` ``

---

## Security & Safety

- **CRITICAL:** DO NOT hardcode credentials, API keys, or sensitive data in test files or page objects.
- Store all credentials and sensitive values in `utils/constants.js` (loaded from environment variables via `process.env`) or a `.env` file loaded with `dotenv`.
- **`utils/constants.js` scope:** environment config (`BASE_URL`), credentials, error message strings, and test data values ONLY. Locator selectors must NOT be placed here.
- **CRITICAL:** DO NOT write to production environments. Always use the designated test URL.

` ``js
// ✅ CORRECT — Import credentials from constants; locators defined in the page object class
const { VALID_USERNAME, VALID_PASSWORD } = require('../utils/constants');
await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

// ❌ WRONG — Hardcoded credentials in test
await loginPage.login('standard_user', 'secret_sauce');

// ❌ WRONG — Locator imported from constants.js (locators belong in the POM class)
const { LOGIN_BUTTON } = require('../utils/constants');
` ``

---

## Code Style & Naming Conventions

- Use `camelCase` for all JavaScript function, method, and variable names.
- Use `PascalCase` for Page Object class names (e.g., `LoginPage`, `InventoryPage`).
- Use `UPPER_SNAKE_CASE` for all constants in `utils/constants.js` and static class locators.
- Test file names must follow the pattern `<feature>.test.js` (e.g., `login.test.js`).
- Page Object file names must follow the pattern `<PageName>.page.js` (e.g., `LoginPage.page.js`).
- Test `describe` block names must follow the pattern `<Feature> Tests` (e.g., `Login Tests`).
- Test method names must follow the pattern `should <scenario being validated>` (e.g., `should log in successfully as standard user`).
- Keep test methods concise — delegate all UI interactions to Page Object methods.

---

## File Organization

` ``
saucedemo_tests/
├── pages/
│   └── LoginPage.page.js         # One Page Object file per page or component
├── tests/
│   └── login.test.js             # One test file per feature
├── utils/
│   └── constants.js              # All URLs, credentials, messages, test data
├── playwright.config.js          # Playwright configuration (browser, baseURL, etc.)
├── package.json                  # Project dependencies
└── .env                          # Environment variables (gitignored)
` ``

---

## Fixtures & Test Setup (playwright.config.js)

- Set `browserName` to `chromium` — only Chromium is used for this demo.
- Use `use.baseURL` to configure the base URL centrally.
- Use Playwright's `test.beforeEach` / `test.afterEach` for per-test setup and teardown inside test files.
- Each test MUST receive a clean, isolated browser context via Playwright's built-in `page` fixture.
- NEVER share mutable state between tests via module-level variables or class-level attributes.

` ``js
// ✅ CORRECT — playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    browserName: 'chromium',
    headless: true,
  },
  reporter: [['html', { outputFolder: 'report' }]],
});
` ``

---

## Test File Rules

- Each test file maps to exactly ONE feature area (e.g., `login.test.js` covers login only).
- All test functions MUST be grouped inside a `describe()` block.
- NO module-level test functions outside a `describe` block are allowed.
- Each test MUST have a **JSDoc comment** explaining what is being validated.
- Each test MUST contain ONE logical assertion (single responsibility principle).
- Assertion failure messages MUST be descriptive.
- Use tags or custom annotations for categorisation where applicable (e.g., smoke, regression).

` ``js
// ✅ CORRECT test structure
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage.page');
const { VALID_USERNAME, VALID_PASSWORD } = require('../utils/constants');

describe('Login Tests', () => {

  /**
   * Verify that standard_user can log in and is redirected to the inventory page.
   */
  test('should log in successfully as standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    expect(await loginPage.isLoggedIn()).toBe(true);
  });

});
` ``

` ``js
// ❌ WRONG — No describe block, no JSDoc, raw Playwright calls in test
test('login', async ({ page }) => {
  await page.fill('#user-name', 'standard_user');
  await page.click('#login-button');
  await expect(page.locator('#inventory_container')).toBeVisible();
});
` ``

---

## Error Prevention

- **CRITICAL:** DO NOT override or shadow Playwright's native `Page` methods in Page Objects.
- Use JSDoc `@param` and `@returns` annotations on all public Page Object methods.
- Use `playwright.config.js` for all global setup and teardown logic.
- Handle all test data through `utils/constants.js` — avoid hardcoded values anywhere.
- DO NOT use empty `catch` blocks that silently swallow assertion failures.

` ``js
// ❌ WRONG — Silent failure swallowing
try {
  expect(await loginPage.isLoggedIn()).toBe(true);
} catch (e) {}

// ❌ WRONG — No JSDoc annotations
async login(u, p) {
  await this.enterUsername(u);
  await this.enterPassword(p);
}

// ✅ CORRECT — JSDoc annotations, no silent catch
/**
 * Fill credentials and submit the login form.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<void>}
 */
async login(username, password) {
  await this.enterUsername(username);
  await