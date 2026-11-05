import { test, expect } from '@playwright/test';
import { HomePagePOM } from './POMs/HomePagePOM';
import { LoginPagePOM } from './POMs/LoginPagePOM';
import { AddRecordPagePOM } from './POMs/AddRecordPagePOM';

test('test', async ({ page }) => {
  //Go to home page
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  //Now on login page
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  //Should now be on add record page
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('POM login test', async({page})=>{
    //await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    const homePage = new HomePagePOM(page);
    await homePage.goToPage();
    await homePage.goLogin();

    const loginPage = new LoginPagePOM(page);
    // await loginPage.setUsername('edgewords');
    // await loginPage.setPassword('edgewords123');
    // await loginPage.submitForm();
    await loginPage.doLogin('edgewords', 'edgewords123'); //High level service method

    //Should be logged in, check the heading
    const addRecordPage = new AddRecordPagePOM(page);
    const heading = addRecordPage.getHeading();
    //expect(await heading).toBe("Add A Record To the Database"); //Doesnt retry - so vulnerable to a page load race
    //await expect.poll(async ()=>{ return await addRecordPage.getHeading()}).toBe("Add A Record To the Database"); //If locators are private, then use polling to retry capture using the service method
    await expect(addRecordPage.pageHeading).toHaveText("Add A Record To the Database"); //Public locators let you use PW web first assertions
    //await addRecordPage.pageHeading.locator('xpath=./../../../div').click(); //But Public locators let you escape the POM abstraction layer
})

test('OR test', async({page})=>{ //In an Object Repository approach, locators are stored for the test to use. No service methods.
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  const homePageOR = new HomePagePOM(page);
  await homePageOR.loginLink.click();
  const loginPageOR = new LoginPagePOM(page);
  await loginPageOR.usernameTextBox.fill('edgewords');
  //These locators have been made private in the HomePagePOM, so the code is commented out to allow the test(s) to compile
  //await loginPageOR.#passwordTextBox.fill('edgewords123');
  //await loginPageOR.submitButton.click();
})