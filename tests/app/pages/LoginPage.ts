import {PageManager} from '../../tools/manager/PageManager';
import {HomePage} from './navigation/HomePage';
import {SessionContextStorage} from '../../tools/SessionContext';
import {Navigation} from '../components/Navigation';
import {ProfileRole} from '../../tools/ProfileRoles';
import {BasePage} from './BasePage';

export class LoginPage extends BasePage{
    constructor(page: PageManager) {
        super(page);
    }

    async login(username: string, role: ProfileRole): Promise<HomePage> {
        if (SessionContextStorage.hasUserSession(username)) {
            this.sessionContext = await this.restoreSessionByEmail(username);
            await this.manager.locateElementByText(Navigation.HOME.visibleElement);
        } else {
            await this.manager.fillInput('input#login_email', username, 'fill log in email \'Administrator\'')
            await this.manager.fillInput('input#login_password', role.new_password, 'fill in password \'admin\'')

            await this.manager.click('button.btn-login', 'Click on \'login\' button');
            await this.manager.locateElementByText(Navigation.HOME.visibleElement);
            this.sessionContext = await this.manager.generateSessionContext(role);
            SessionContextStorage.putUserSession(username, this.sessionContext)
        }
        return new HomePage(this.manager);
    }

    // first log in after fresh install:
    // input[data-fieldname='language'] English
    // button.next-btn
    // input[data-fieldname='full_name'] boba dodod
    // input[data-fieldname='email'] sdfsd@tes.com
    // input[data-fieldname='password'] asdsafds123!
}