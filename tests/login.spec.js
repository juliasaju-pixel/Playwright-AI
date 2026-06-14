import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { BASE_URL, TEST_USERNAME, TEST_PASSWORD, INVALID_PASSWORD } from '../utils/constants.js';

test.describe('Login page', () => {
  test('should authenticate successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERNAME, TEST_PASSWORD);

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.cartIcon).toBeVisible();
    await inventoryPage.expectUrlToContain('inventory.html');
  });

  test('should show an error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERNAME, INVALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});
