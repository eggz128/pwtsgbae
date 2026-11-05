import { test, expect } from '@playwright/test'

test.describe.configure({ timeout: 30000 }); //Overrides test timeout set in global config

//Local (to this file) hooks
test.beforeAll(async () => { //you cant use page in beforeAll()
  console.log('Runs once at the start of this test file')
});

test.beforeEach(async ({ page }) => { //but you can in beforeEach()
  console.log("Runs before each and every test in this file");
  await page.goto('https://www.google.com');
})

test.afterEach(async () => {
  console.log("Runs after each and every test in this file")
});

test.afterAll(() => {
  console.log("Runs once, after the last test has completed")
})


test.describe('A group of tests', () => {
  //Test suites (describe() ) can also have their own hooks
  test.beforeAll(async () => {
    console.log('Runs once at the start of this test file')
  });

  test.beforeEach(async ({ page }) => {
    console.log("Runs before each and every test in this file");
    await page.goto('https://www.google.com');
  })

  test.afterEach(async () => {
    console.log("Runs after each and every test in this file")
  });

  test.afterAll(() => {
    console.log("Runs once, after the last test has completed")
  })


  test('Waits', async ({ page }) => {
    page.setDefaultTimeout(15000); //Overrides action timeout (if set) in global config
    const slowExpect = expect.configure({ timeout: 7000 }); //Create a slow expect
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/index.html');
    await page.getByRole('link', { name: 'Dynamic Content' }).click();

    await page.pause(); //If browser is headed, test will pause here (like a breakpoint)

    await page.locator('#delay').click();
    await page.locator('#delay').fill('10');
    await page.getByRole('link', { name: 'Load Content' }).click();
    //await page.waitForTimeout(17000);
    await page.locator('img[src$="apple.jpg"]').click();

    //await page.locator('img[src$="apple.jpg"]').click({timeout: 5000});

    // const apple = page.locator('img[src$="apple.jpg"]');
    // await apple.waitFor(); //wait for apple to appear

    // const spinner = page.locator('#spinner-holder > img');
    // await spinner.waitFor({state: 'hidden'}); //or wait for spinner to go away

    //await slowExpect(page).toHaveURL("khjkjh"); //slowExpect has a custom (non 5s) timeout set
    await page.getByRole('link', { name: 'Home' }).click();
  });

  test.describe('An inner suite', () => {

    //test.describe.configure({timeout: 60000}); //These tests are slow and need 60s

    test('Capture order number @Smoke', async ({ page, browserName }) => {
      //test.fail(); //This makes a failing test report pass
      test.skip(browserName === 'webkit', "Don't run on safari");
      //test.abort(); //Stop and fail here
      test.slow(); //Triples the test timeout - this is a slow test

      await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
      await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();

      await test.step('Do login', async () => {
        await page.getByRole('textbox', { name: 'Username or email address' }).click();
        await page.getByRole('textbox', { name: 'Username or email address' }).fill('exampleuser@example.com');
        await page.locator('#doesnotexist').click({ timeout: 2000 });
        await page.locator('#password').click();
        await page.locator('#password').fill('examplepassword!!');
        await page.getByRole('button', { name: 'Log in' }).click();
      }, { box: true, subtitle: "Will fail here" }) //boxing hides the erroring code in the report

      await page.locator('#menu-item-43').getByRole('link', { name: 'Shop' }).click();
      await page.getByRole('button', { name: 'Add to cart: “Beanie”' }).click();
      await page.getByRole('link', { name: 'View cart ', description: 'View cart' }).click();
      await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
      await page.getByRole('textbox', { name: 'First name' }).first().click();
      await page.getByRole('textbox', { name: 'First name' }).fill('Steve');
      await page.getByRole('textbox', { name: 'Last name' }).click();
      await page.getByRole('textbox', { name: 'Last name' }).fill('Powell');
      await page.getByRole('textbox', { name: 'Street address' }).click();
      await page.getByRole('textbox', { name: 'Street address' }).fill('123 Street');
      await page.getByRole('textbox', { name: 'Town / City' }).click();
      await page.getByRole('textbox', { name: 'Town / City' }).fill('Somewhereville');
      await page.getByRole('textbox', { name: 'Postcode' }).click();
      await page.getByRole('textbox', { name: 'Postcode' }).fill('SA19 2FJ');
      await page.getByRole('textbox', { name: 'Phone' }).click();
      await page.getByRole('textbox', { name: 'Phone' }).fill('01184960123');
      await page.getByRole('button', { name: 'Place order' }).click();

      let orderNum: string = await page.locator('li.order > strong').textContent() ?? "";
      console.log(orderNum);
      //orderNum = orderNum + 1; //"Break" the captured order number to test the expect below is working 

      await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();
      await page.getByRole('link', { name: ' Orders' }).click();

      await expect(page.locator('#post-7 tbody > tr:nth-child(1) > th')).toContainText(orderNum);

    });

    test('waitforfunction', { tag: ['@Smoke', '@Regression'] /* array of tags in optional 2nd arg */ }, async ({ page }) => {
      page.setDefaultTimeout(0); //No action timeout
      await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html');
      const textBox = page.locator('#textInput');
      await textBox.waitForFunction((textBox: HTMLInputElement) => textBox.value === 'Ready');
      console.log("Text box value is 'Ready'");
      await textBox.waitForFunction((textBox: HTMLInputElement, argValue) => { return textBox.value === argValue }, 'Set');
      console.log("Text box value is 'Set'. You now have 5 seconds to change it to 'Go'");
      await textBox.waitForFunction(
        (textBox: HTMLInputElement, argValue) => { return textBox.value === argValue },
        'Go',
        { timeout: 5000 } //Defaults to 0 - will wait until test timeout if not specified
      );
    });
  });
});


test("Waiting for a pop up window", async ({ page, context }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html");

  //[a,b] = [10,20] - aray destructuring syntax will assign a=10 b=20
  //Below we discard the second promise return value - we only need the first which gets us a handle to the new page
  const [newSpawnedPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
    context.waitForEvent('page'), //Returns the new page instance when done
    page.locator("#right-column > a[onclick='return popUpWindow();']").click(), //promise returns void (nothing)
  ]);

  //await page.pause();
  await page.waitForTimeout(2000); //Pause for 2s - try to avoid this as other wait types can exit early if condition is met


  const closeBtn = newSpawnedPage.getByRole('link', { name: 'Close Window' });
  await closeBtn.click();

  await page.getByRole('link', { name: 'Load Content' }).click();

});