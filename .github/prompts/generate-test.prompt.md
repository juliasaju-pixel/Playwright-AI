# Generate Playwright Test Prompt

Use this prompt to generate a new Playwright JavaScript test using the repository's Page Object Model.

Guidelines:
- Write code in ES modules.
- Import `test` and `expect` from `@playwright/test`.
- Import page objects from `pages/` using relative paths.
- Keep secrets out of source; use `.env` and `utils/constants.js`.
- Provide a single complete test file with `test.describe` and one or more `test` cases.

Example prompt:
"Create a Playwright test that logs in, adds a product to the cart, and verifies the cart count using the existing POM classes."
