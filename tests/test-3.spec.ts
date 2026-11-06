import { test, expect } from '@playwright/test';

test('Actions and Assertions', async ({ page }) => {


  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Forms' }).click(); //Actions don't have a timeout by default - they will run until the test times out (30s default)
  await expect(page).toHaveTitle('Forms'); //Expect does have a default timeout. 5s to land on the page with a <title> of "Forms"
  //You can cange the expect timeout on a per expect basis:
  await expect.soft(page, {message: "Not on right page potentially"}).toHaveURL(/forXXXms\.html$/, {timeout: 6000}); //And also change to "soft" expects that allow code beyond this point to execute (but still ultimately report a test fail)
  const slowExpect = expect.configure({timeout: 6000}); //If you need to set up a different expect timeout for multiple lines, consider creating a custom "slowExpect"
  await slowExpect.soft(page.locator('h1')).not.toBeVisible();
  
  
  await page.locator('#textInput').click({ button: 'left', clickCount: 3 }); //Actions can take options objects { }
  //await page.locator('#doesnotexist').click({ timeout: 5000 }); //Timeout means action must complete within this time
  await page.locator('#textInput').fill('Hello World'); //Replace existing text - does not send key presses
  await page.locator('#textInput').press('Control+a'); //Simulate a real use clearing the text box with keyboard shortcuts
  await page.locator('#textInput').press('Backspace'); //Deleting text like a human
  await page.locator('#textInput').fill('Something else'); //fill() automatically clears text
  await page.locator('#textInput').pressSequentially('And something more', { delay: 200 }) //Like WebDriver .sendKeys();, sends key presses, appends to existing text
  //await page.locator('#textInput').clear(); //Clears the text box - does not sent keypresses
  await page.locator('#textArea').click();
  await page.locator('#textArea').fill('Steve was\nhere\n');
  await page.locator('#checkbox').check(); //Force on
  await page.locator('#checkbox').click(); //toggle the checkbox i.e. if was on, now off
  await page.locator('#checkbox').uncheck(); //Force off
  await page.locator('#select').selectOption('Selection Two');

  //There should be 3 radio buttons
  await slowExpect(page.locator('input[type=radio]')).toHaveCount(3); //Also has the slowExpect timeout of 6s

  await page.locator('#three').check();
  await page.locator('#password').click();
  await page.locator('#password').fill('asdfasdf');
  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('#textInputValue')).toContainText('Hello World');
});

test('Image validation and ARIA snapshots', async ({page})=>{
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.locator('#textInput').fill('Hello world');
  await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png'); //1st run fails if no "golden sample" has already been captured

  //ARIA snapshot - good for checking the whole page content/individual sections
  await expect(page.locator('#right-column')).toMatchAriaSnapshot(`
    - heading "Forms" [level=1]
    - paragraph: This form has an id of theForm.
    - table:
      - rowgroup:
        - row "Text Input with id/name textInput * Hello world":
          - cell "Text Input with id/name textInput *"
          - cell "Hello world":
            - textbox: Hello world
        - row "Text Area with id/name textArea":
          - cell "Text Area with id/name textArea"
          - cell:
            - textbox
        - row "Checkbox with id/name checkbox":
          - cell "Checkbox with id/name checkbox"
          - cell:
            - checkbox
        - row "Select with id/name select Selection One":
          - cell "Select with id/name select"
          - cell "Selection One":
            - combobox:
              - option "Selection One" [selected]
              - option "Selection Two"
              - option "Selection Three"
        - row "Radio buttons with id/name radio One Two Three":
          - cell "Radio buttons with id/name radio"
          - cell "One Two Three":
            - radio [checked]
            - text: ""
            - radio
            - text: ""
            - radio
            - text: ""
        - row "Password input with id/name password":
          - cell "Password input with id/name password"
          - cell:
            - textbox
        - row "File selector with id/name file Choose File":
          - cell "File selector with id/name file"
          - cell "Choose File":
            - button "Choose File"
        - row "Submit Clear":
          - cell
          - cell "Submit Clear":
            - link "Submit":
              - /url: "#"
            - link "Clear":
              - /url: "#"
        - row "* Mandatory field.":
          - cell "* Mandatory field."
    `);

});

test('Check placeholder', async ({page})=>{
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/my-account/');
  const searchBox = page.getByRole('searchbox', { name: 'Search for:' });
  await expect(searchBox.nth(0)).toHaveAttribute('placeholder', 'Search products…');
  await searchBox.first().fill('Cap');
  await expect(searchBox.nth(0)).toHaveValue('Cap');
});

test('Drag drop', async ({ page }) => {
  await page.goto('/webdriver2/docs/cssXPath.html');
  //Dragging and dropping one element to another is simple:
  //await page.locator('div#one').dragTo(page.locator('div#two'))

  //Dragging and dropping one element is a little trickier:
  await page.dragAndDrop('#slider a', //Source
    '#slider a', //Target (same)
    {
      targetPosition: { x: 100, y: 0 }, //How far to drag
      force: true, //Dont do actionability checks (don't worry that we are dragging the source "outside" of itself)
      steps: 20
    } //Smooth the movement over 20 steps
  )
});

test('Simple file chooser', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html');
  const fileChooserPromise = page.waitForEvent('filechooser'); //Set up event wait - NO AWAIT
  await page.getByRole('button', { name: 'Choose File' }).click(); //Do action that triggers file chooser
  const fileChooser = await fileChooserPromise; //Wait for the file chooser to appear
  await fileChooser.setFiles('./tests/example.spec.ts');
});

test('Drag drop files', async ({ page }) => {
  //test.abort('This test is currently failing due to a bug in Playwright. See');

  await page.goto('https://codyhouse.co/ds/components/app/drag-drop-file');
  await page.locator('iframe').contentFrame().locator('label').drop({
    files: { name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }, //tsconfig.json file added to root to fix VS Code being unable to find Buffer type info
    //files: './tests/example.spec.ts' //Can use real file or create a file on the fly with a buffer
  });
  //test.skip(true, 'This test is currently failing due to a bug in Playwright. See https://github.com/microsoft/playwright/issues/12345');
});

test('Capturing Text', async ({ page }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
  await page.locator('#textInput').fill("Hello World");

  let textPromise = page.locator('#right-column').textContent();
  console.log("Without 'await'ing textContent() you get a 'promise' of the future text, not the actual text");
  console.log(textPromise);

  let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

  console.log("The right column text is with textContent is: " + rightColText);

  rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

  console.log("The right column text is with innertext is: " + rightColText);

  let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
  console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

  //Using generic $eval to get the browser to return the INPUT text
  //This will *not* retry or wait
  textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.

  console.log("The text box actually contains: " + textBoxText);

  await page.$eval('#textInput', elm => {
    console.log(typeof (elm)); //Writes to browser's console! Not NodeJS console.
  });

  await page.locator('#textInput').evaluate(elm => { //using locator().evaluate() the locator will be retried if no element found
    console.log(elm); //Also outputs to browser console.
  });

  expect(textBoxText).toBe("Hello World");
  await expect(page).toHaveTitle("Forms", { timeout: 5000 }) //Override global config with a custom expect timeout
});

test('Generic methods', {lock: 'cart'}, async ({ page }) => {
  //A comment
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

  const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
  console.log(`There are ${menuLinks.length} links`)

  console.log("The link texts are:")

  for (const iterator of menuLinks) {
    console.log(iterator!.trim())
  }
  //$eval and $$eval DONT retry. If the locator doesnt find a matching element(s) then you get null.

  //Preferred - using retry-able Playwright locators
  //expect(await page.locator('#menu a').all()).toHaveLength(5) //Collection should have 5 members - do not cotinue until that is true
  const preferredLinks = await page.locator('#menu a').all();
  for (const elm of preferredLinks) {
    // const elmtext = await elm.textContent();
    // const elmtexttrimmed = elmtext?.trim(); //Combine these two steps below
    console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
  }
});