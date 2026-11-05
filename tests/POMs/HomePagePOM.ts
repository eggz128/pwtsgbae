import {Page, Locator} from '@playwright/test'

export class HomePagePOM {

    page: Page;
    loginLink: Locator;
    
    constructor(page: Page){
        this.page = page;
        //Locator
        this.loginLink = page.getByRole('link', {name: 'Login to Restricted Area'});
    }

    //Service methods
    async goToPage(){await this.page.goto('https://www.edgewordstraining.co.uk/webdriver2/')};
    async goLogin(){await this.loginLink.click()};

}