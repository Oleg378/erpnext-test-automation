import {PageManager} from '../../tools/manager/PageManager';
import {HomePage} from './navigation/HomePage';
import {SessionContextStorage} from '../../tools/SessionContext';
import {Navigation} from '../components/Navigation';
import {ProfileRole} from '../../tools/ProfileRoles';
import {BasePage} from './BasePage';
import {TestDataFactory} from '../../tools/TestDataFactory';

export class LoginPage extends BasePage{
    constructor(page: PageManager) {
        super(page);
    }

    async loginOrRestoreSession(username: string, role: ProfileRole): Promise<HomePage> {
        if (SessionContextStorage.hasUserSession(username)) {
            this.sessionContext = await this.restoreSessionByEmail(username);
            await this.manager.locateElementByText(Navigation.HOME.visibleElement);
        } else {
            await this.manager.fillInput('input#login_email', username, `fill log in email '${username}'`)
            await this.manager.fillInput('input#login_password', role.new_password, `fill in password '${role.new_password}'`)

            await this.manager.click('button.btn-login', 'Click on \'login\' button');
            await this.manager.locateElementByText(Navigation.HOME.visibleElement);
            this.sessionContext = await this.manager.generateSessionContext(role);
            SessionContextStorage.putUserSession(username, this.sessionContext)
        }
        return new HomePage(this.manager);
    }

    async fillSetUpWizard(): Promise<HomePage> {
        await this.manager.fillInput('input#login_email', TestDataFactory.SUPER_ADMIN_CREDENTIALS.email, 'fill log in email \'Administrator\'')
        await this.manager.fillInput('input#login_password', TestDataFactory.SUPER_ADMIN_CREDENTIALS.password, 'fill in password \'admin\'')
        await this.manager.click('button.btn-login', 'Click on \'login\' button');

        await this.manager.click('button.next-btn');

        await this.manager.fillInput('input[data-fieldname=\'full_name\']', TestDataFactory.USER_FOR_SYSTEM_SETUP.fullName)
        await this.manager.fillInput('input[data-fieldname=\'email\']', TestDataFactory.USER_FOR_SYSTEM_SETUP.email)
        await this.manager.fillInput('input[data-fieldname=\'password\']', TestDataFactory.USER_FOR_SYSTEM_SETUP.password)
        await this.manager.click('button.next-btn');

        await this.manager.fillInput('input[data-fieldname=\'company_name\']', TestDataFactory.MAIN_COMPANY_INFO.name)
        await this.manager.fillInput('input[data-fieldname=\'company_abbr\']', TestDataFactory.MAIN_COMPANY_INFO.abbreviation)
        await this.manager.click('button.complete-btn');

        await this.manager.locateElementByText(Navigation.HOME.visibleElement);
        return new HomePage(this.manager);
    }
}