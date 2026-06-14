import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async removeItem(itemName) {
    const button = this.page.locator(`.cart_item:has-text("${itemName}") button:has-text("Remove")`);
    await this.click(button);
  }

  async hasItem(itemName) {
    return this.page.locator(`.cart_item:has-text("${itemName}")`).isVisible();
  }

  async hasItems(itemNames) {
    for (const itemName of itemNames) {
      if (!(await this.hasItem(itemName))) {
        return false;
      }
    }
    return true;
  }

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }
}
