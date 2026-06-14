import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { TEST_USERNAME, TEST_PASSWORD, PRODUCT_NAME, SECOND_PRODUCT_NAME, THIRD_PRODUCT_NAME } from '../utils/constants.js';

test.describe('Cart workflow', () => {
  test('should add three items to the cart, remove one item, and verify it is removed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERNAME, TEST_PASSWORD);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemsToCart([PRODUCT_NAME, SECOND_PRODUCT_NAME, THIRD_PRODUCT_NAME]);

    await expect(inventoryPage.cartIcon).toBeVisible();
    expect(await inventoryPage.getCartCount()).toBe(3);

    await inventoryPage.openCart();
    const cartPage = new CartPage(page);
    expect(await cartPage.getCartItemCount()).toBe(3);
    expect(await cartPage.hasItems([PRODUCT_NAME, SECOND_PRODUCT_NAME, THIRD_PRODUCT_NAME])).toBeTruthy();

    await cartPage.removeItem(SECOND_PRODUCT_NAME);
    expect(await cartPage.getCartItemCount()).toBe(2);
    expect(await cartPage.hasItem(SECOND_PRODUCT_NAME)).toBeFalsy();
    expect(await cartPage.hasItems([PRODUCT_NAME, THIRD_PRODUCT_NAME])).toBeTruthy();
  });
});
