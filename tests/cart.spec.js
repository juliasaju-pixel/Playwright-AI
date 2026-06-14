import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { TEST_USERNAME, TEST_PASSWORD, PRODUCT_NAME, SECOND_PRODUCT_NAME } from '../utils/constants.js';

test.describe('Cart workflow', () => {
  test('should add items to cart and remove an item successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERNAME, TEST_PASSWORD);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart(PRODUCT_NAME);
    await inventoryPage.addItemToCart(SECOND_PRODUCT_NAME);

    await expect(inventoryPage.cartIcon).toBeVisible();
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.openCart();
    const cartPage = new CartPage(page);
    expect(await cartPage.getCartItemCount()).toBe(2);
    expect(await cartPage.hasItem(PRODUCT_NAME)).toBeTruthy();
    expect(await cartPage.hasItem(SECOND_PRODUCT_NAME)).toBeTruthy();

    await cartPage.removeItem(SECOND_PRODUCT_NAME);
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.hasItem(SECOND_PRODUCT_NAME)).toBeFalsy();
  });
});
