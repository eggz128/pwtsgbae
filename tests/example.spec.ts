import { expect } from '@playwright/test';
import { test } from './globalbeforeafter';

test('has title', async function({ page }) { //Altered to use "full function syntax" - has no benifit here so just use default arrow syntax: =>
  await page.goto('https://playwright.dev/'); //async + await is important to allow a step to complete in browser *before* executing next step

  //Rule of thumb: If something (an action) needs to happen in a browser, you must "await" it.

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => { //PW Test should set up a "page" fixture for the test code to use
  await page.goto('https://playwright.dev/');
  //await page.goto('https://www.bing.com');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
