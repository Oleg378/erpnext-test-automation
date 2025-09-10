import {PageManager} from '../../tools/PageManager';
import {HomePage} from './navigation/HomePage';

export class LoginPage {
    private readonly manager: PageManager;

    constructor(page: PageManager) {
        this.manager = page;
    }

    async loginAsAdmin() {
        await this.manager.fillInput('input#login_email', 'Administrator', 'fill log in email \'Administrator\'')
        await this.manager.fillInput('input#login_password', 'admin', 'fill in password \'admin\'')

        await this.manager.click('button.btn-login', 'Click on \'login\' button');
        return new HomePage(this.manager);
    }

    // first log in after fresh install:
    // input[data-fieldname='language'] English
    // button.next-btn
    // input[data-fieldname='full_name'] boba dodod
    // input[data-fieldname='email'] sdfsd@tes.com
    // input[data-fieldname='password'] asdsafds123!
}