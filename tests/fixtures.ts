import { test as base } from '@playwright/test';
import { ShopPage } from './pages/shopPage';
import { ProductPage } from './pages/productPage';
import { CartPage } from './pages/cartPage';
import { CheckoutPage } from './pages/checkoutPage';
import { OrderConfirmationPage } from './pages/orderConfirmationPage';
import { LoginPage } from './pages/auth/loginPage';
import { SignupPage } from './pages/auth/signupPage';

type MyFixtures = {
  shopPage: ShopPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
};

export const test = base.extend<MyFixtures>({
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

export { expect } from '@playwright/test';
