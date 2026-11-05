import { test, expect } from '@playwright/test'; //Bring in test() and expect() methods from Playwright Test for this file to use

//test() takes 2 argyments : ("Test name", function with the test code)
test('Login test', {tag: '@Smoke'} , async ({ page }) => { //The test function can also request a "fixture". The "page" fixture is a web page to work with in the test code. 
  /*
  Arrange - Set the environment up ready to do "the test"
  */
  await page.goto('/webdriver2/');
  // Equivalent WebDriver JS code:
  //await driver.get('https://www.edgewordstraining.co.uk/webdriver2/');

  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  //await page.getByText('Login to Restricted Area').click();
  // Equivalent WebDriver JS code:
  //await driver.findElement(By.linkText('Login To Restricted Area')).click();
  // *Most automation tools use this same pattern*  i.e.:
  // tool---->Find something--->do something with the found thing
  // e.g. Cypress
  //cy.contains('Login To Restricted Area').click();

  /*
  Act - Do the steps that should provoke the desired output
  */
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();

  

  /*
  Assert - Check the output matches our expectations - Are we logged in?
  */
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});


// Don't "record at cursor" out here. 
// The code won't be valid and will prevent the test file from compiling and the tests being discovered (runnable)
//  await page.locator('#password').click(); //Not in a test() method callback function. Will break the file if uncommented.