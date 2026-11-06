import { test, expect } from '@playwright/test';

test.describe.configure({mode: 'serial'})


test('test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  await page.locator('#menu-main').getByRole('link', { name: 'My account' }).click(); //Chaining - find the menu (.) inside the menu find the link (.) do a click()
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('exampleuser@example.com');
  await page.locator('xpath=//*[@id="password"]').click(); //Use XPath to find password text box
  await page.locator('css=#password').fill('examplepassword!!'); //Find same text box using CSS
  //await page.locator('[id=password]').click(); //Equivalant long form previous locator. css=/xpath= annotations are optional.
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.locator('#menu-item-43').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('button', { name: 'Add to cart: “Belt”' }).click();
  await page.waitForTimeout(2000); //Thread.sleep - dumb wait - do not use in production tests
  await page.locator('#menu-item-44').getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Remove Belt from cart' }).click();
  await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();
  await page.getByRole('link', { name: ' Log out' }).click(); //Note the strange  character. You can remove this because name: does a sub string match
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('second test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  //await page.getByRole('button', { name: 'Dismiss', exact: true }).click(); //Normally name is case insensitive and a sub-sring (part) match
  //await page.getByRole('button', { name: /disMiss.*/i }).click(); //Can also use RegEx. This one has a case insensitive flag (i)

  const notThere = page.locator("DOESNOTEXIST"); //PW will not stop here even though the element dosn't (and will never) exist
  const dismissButton = page.getByRole('button', { name: /disMiss.*/i }).describe("The dismiss link"); //describe() adds a friendly name for the loactor to the report
  // await dismissButton.click();
  // await dismissButton.dblclick();
  await dismissButton.hover();
  //await notThere.click(); //Uncomment and the test will fail. PW finds(searches for) an element only when an action is performed on it.
});

test('index filter visible', async({page})=>{
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/sdocs/auth.php');
  //await page.locator('#username').click(); //Strict mode violation: There are 2 elements with an id of username?
  //Yes - the page has invalid HTML. Clicking the "Register" menu item hides the login form and shows a new register form
  //The username input there re-uses #username

  //Recorded:
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  // The PW recorder spots this problem and uses chaining to avoid it.

  //But we could also:
  await page.locator('#username').nth(0).click(); //Click the first #username (or use .first() instead of .nth(0)  )
  //But what if the forms were swapped (making Register first) - this would then click the "wrong" #username...
  await page.locator('#username:visible').click(); //Use a PW CSS extension to exclude the hidden #username
  await page.locator('#username').filter({visible: true}).click(); //Use filter() to do the same
  await page.locator('#username').visible().click(); //or new to PW 1.63 use .visible();
  
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');

});


test('chaining locators vs within', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/product/cap/');
  const mainProductSection = page.locator('.summary.entry-summary');
  const addToCartButton = page.getByRole('button'); //Matches multiple on page buttons
  await addToCartButton.hideHighlight();
  //await addToCartButton.click(); //Strict mode violation. Matches 8 elements.
  await mainProductSection.getByRole('button').click(); //Chaining - only one button in main
  await addToCartButton.within(mainProductSection).click(); //Within - get button in main
})

test('all products', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual matches logging the text
  }; //No need to await console, but you do need to await the locator.textContent() . Or you will only get the "promise" of the text, not the actual text.
});

test('Locator Handler', async ({ page }) => { //How to handle unpredicatable modal "pop ups"
  // Setup the handler.
  const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
  await page.addLocatorHandler(
    cookieConsent, //Locator to watch out for
    async () => { //If spotted, what to do
      //console.log("Spotted cookie consent")
      await page.getByRole('button', { name: 'Accept' }).click();
    }
    , //Optional arguments - can be omitted
    {
      times: 10, //How many times the locator may appear before the handler should stop handling the locator
      //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
      noWaitAfter: false //this can be overridden however
    }
  );

  // Now write the test as usual. If during "actionability checks" the cookie prompt is spotted, it will be handled.
  await page.goto('https://www.ikea.com/');
  await page.getByRole('link', { name: "Make space for what you love" }).click();
  await expect(page.getByText('Make space forwhat you love')).toBeVisible();

  //If you're confident the locator will no longer be found you can de-register the handler
  //await page.removeLocatorHandler(cookieConsent);
  //If the cookie consent form appears from here on it may cause issues with the test...
  await page.locator('#main > div:nth-child(1) > div > div > div > p > span').hover(); //Need an actionability check here to trigger the locator if the cookie consent form appears on page 2 (i.e. didn't already get handled on page 1)
  await page.waitForTimeout(10000); //Big dumb wait before finishing the test
});
