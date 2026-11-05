import {Page, Locator} from '@playwright/test'

export class LoginPagePOM {

    page: Page;
    usernameTextBox: Locator;
    #passwordTextBox: Locator; //JS Private field : name starts with #
    private submitButton: Locator; //TS feature, use private keyword

    
    constructor(page: Page){
        this.page = page;
        //Locator
        this.usernameTextBox = page.getByRole('row', { name: 'User Name?' }).locator('#username');
        this.#passwordTextBox = page.locator('#password');
        this.submitButton = page.getByRole('link', { name: 'Submit' });
    }

    //Service methods
    async setUsername(username: string){
        //await this.usernameTextBox.fill(username)
        await this.usernameTextBox.press('Control+a'); //Clear text box as a user dows
        await this.usernameTextBox.press('Backspace');
        await this.usernameTextBox.pressSequentially(username, {delay: 200}); //Send real keypresses
    }

    async setPassword(password: string){
        await this.#passwordTextBox.fill(password)
    }

    async submitForm(){
        await this.submitButton.click()
    }

    //Higher level helpwe
    async doLogin(username: string, password: string){
        await this.setPassword(password);
        await this.setUsername(username);
        await this.submitForm();
    }


}