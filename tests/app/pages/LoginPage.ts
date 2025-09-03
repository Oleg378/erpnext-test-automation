import {PageManager} from "../../tools/PageManager";
import {HomePage} from "./navigation/HomePage";

export class LoginPage {
    private readonly manager: PageManager;

    constructor(page: PageManager) {
        this.manager = page;
    }

    async loginAsAdmin() {
        await this.manager.fillInput('input#login_email', 'Administrator', 'fill log in email')
        await this.manager.fillInput('input#login_password', 'admin')

        await this.manager.click('button.btn-login', 'Click on login button');
        return new HomePage(this.manager);
    }
}