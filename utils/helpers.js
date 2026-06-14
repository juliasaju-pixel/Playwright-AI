import { LoginPage } from '../pages/LoginPage.js';

export async function loginAs(page, username, password) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
  return loginPage;
}

export function getEnvVariable(key, fallback = '') {
  return process.env[key] || fallback;
}

export function parseIntSafe(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
