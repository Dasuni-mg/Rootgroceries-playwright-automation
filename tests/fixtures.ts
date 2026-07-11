import { test as base } from '@playwright/test';
import { ShopPage } from './pages/shopPage';
import { ProductPage } from './pages/productPage';
import { CartPage } from './pages/cartPage';
import { CheckoutPage } from './pages/checkoutPage';
import { OrderConfirmationPage } from './pages/orderConfirmationPage';
import { LoginPage } from './pages/auth/loginPage';
import { SignupPage } from './pages/auth/signupPage';
import { HomePage } from './pages/homePage';
import { AccountPage } from './pages/accountPage';
import { OrdersPage } from './pages/ordersPage';
import { ContactPage } from './pages/contactPage';
import { ForgotPasswordPage } from './pages/forgotPasswordPage';

type MyFixtures = {
  shopPage: ShopPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  homePage: HomePage;
  accountPage: AccountPage;
  ordersPage: OrdersPage;
  contactPage: ContactPage;
  forgotPasswordPage: ForgotPasswordPage;
};

export const test = base.extend<MyFixtures>({
  shopPage: async ({ page }, use) => { await use(new ShopPage(page)); },
  productPage: async ({ page }, use) => { await use(new ProductPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  orderConfirmationPage: async ({ page }, use) => { await use(new OrderConfirmationPage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  signupPage: async ({ page }, use) => { await use(new SignupPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  accountPage: async ({ page }, use) => { await use(new AccountPage(page)); },
  ordersPage: async ({ page }, use) => { await use(new OrdersPage(page)); },
  contactPage: async ({ page }, use) => { await use(new ContactPage(page)); },
  forgotPasswordPage: async ({ page }, use) => { await use(new ForgotPasswordPage(page)); },
});

export { expect } from '@playwright/test';
