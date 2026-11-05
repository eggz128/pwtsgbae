import {Page, Locator} from '@playwright/test'

export class AddRecordPagePOM {

    page: Page;
    pageHeading: Locator
    
    constructor(page: Page){
        this.page = page;
        //Locator
        this.pageHeading = page.locator('h1');

    }

    //Service methods
    async getHeading(): Promise<string>{
        return await this.pageHeading.textContent() ?? "";
    }


}