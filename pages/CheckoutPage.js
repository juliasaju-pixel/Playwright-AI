import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cartEmptyMessage = page.locator('text=Your cart is empty');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeMessage = page.locator('text=Thank you for your order');
  }

  /**
   * Enter checkout information (first name, last name, postal code)
   */
  async enterCheckoutInfo(firstName, lastName, postalCode) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Click the continue button to proceed from checkout info page
   */
  async clickContinue() {
    await this.click(this.continueButton);
  }

  /**
   * Click the finish button to complete checkout
   */
  async clickFinish() {
    await this.click(this.finishButton);
  }

  /**
   * Get the error message if checkout fails
   */
  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  /**
   * Check if cart empty message is visible
   */
  async isCartEmptyMessageVisible() {
    const count = await this.cartEmptyMessage.count();
    return count > 0;
  }

  /**
   * Check if the checkout was successful (order complete message visible)
   */
  async isOrderCompleted() {
    const count = await this.completeMessage.count();
    return count > 0;
  }
}
