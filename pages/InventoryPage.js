import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.pageHeader = page.locator('.header_secondary_container');
  }

  async addItemToCart(itemName) {
    const button = this.page.locator(`.inventory_item:has-text("${itemName}") button:has-text("Add to cart")`);
    await this.click(button);
  }

  async addItemsToCart(itemNames) {
    for (const itemName of itemNames) {
      await this.addItemToCart(itemName);
    }
  }

  async removeItemFromCart(itemName) {
    const button = this.page.locator(`.inventory_item:has-text("${itemName}") button:has-text("Remove")`);
    await this.click(button);
  }

  async openCart() {
    await this.click(this.cartIcon);
  }

  async getCartCount() {
    const count = await this.cartBadge.count();
    if (count === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }
}
