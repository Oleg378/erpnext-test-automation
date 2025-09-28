import {PageManager} from '../../tools/manager/PageManager';
import {HomePage} from './navigation/HomePage';
import {SessionContextStorage} from '../../tools/SessionContext';
import {Navigation} from '../components/Navigation';
import {ProfileRole} from '../../tools/ProfileRoles';
import {BasePage} from './BasePage';
import {TestDataFactory} from '../../tools/TestDataFactory';

export class LoginPage extends BasePage{
    private static readonly LOGIN_EMAIL_INPUT: string = 'input#login_email';
    private static readonly LOGIN_PASSWORD_INPUT: string = 'input#login_password';
    private static readonly LOGIN_BUTTON: string = 'button.btn-login';
    private static readonly WIZARD_NEXT_BUTTON: string = 'button.next-btn';
    private static readonly FULL_NAME_INPUT: string = 'input[data-fieldname=\'full_name\']';
    private static readonly EMAIL_INPUT: string = 'input[data-fieldname=\'email\']';
    private static readonly PASSWORD_INPUT: string = 'input[data-fieldname=\'password\']';
    private static readonly COMPANY_NAME_INPUT: string = 'input[data-fieldname=\'company_name\']';
    private static readonly COMPANY_ABBR_INPUT: string = 'input[data-fieldname=\'company_abbr\']';
    private static readonly COMPLETE_BUTTON: string = 'button.complete-btn'

    constructor(page: PageManager) {
        super(page);
    }

    async loginOrRestoreSession(username: string, role: ProfileRole): Promise<HomePage> {
        if (SessionContextStorage.hasUserSession(username)) {
            this.sessionContext = await this.restoreSessionByEmail(username);
            await this.manager.locateElementByText(Navigation.HOME.visibleElement);
        } else {
            await this.manager.fillInput(LoginPage.LOGIN_EMAIL_INPUT, username, `fill log in email '${username}'`)
            await this.manager.fillInput(LoginPage.LOGIN_PASSWORD_INPUT, role.new_password, `fill in password '${role.new_password}'`)

            await this.manager.click(LoginPage.LOGIN_BUTTON, 'Click on \'login\' button');
            await this.manager.locateElementByText(Navigation.HOME.visibleElement);
            this.sessionContext = await this.manager.generateSessionContext(role);
            SessionContextStorage.putUserSession(username, this.sessionContext)
        }
        return new HomePage(this.manager);
    }

    async fillSetUpWizard(): Promise<HomePage> {
        await this.manager.fillInput(LoginPage.LOGIN_EMAIL_INPUT, TestDataFactory.SUPER_ADMIN_CREDENTIALS.email, 'fill log in email \'Administrator\'')
        await this.manager.fillInput(LoginPage.LOGIN_PASSWORD_INPUT, TestDataFactory.SUPER_ADMIN_CREDENTIALS.password, 'fill in password \'admin\'')
        await this.manager.click(LoginPage.LOGIN_BUTTON, 'Click on \'login\' button');

        await this.manager.click(LoginPage.WIZARD_NEXT_BUTTON);

        await this.manager.fillInput(LoginPage.FULL_NAME_INPUT, TestDataFactory.USER_FOR_SYSTEM_SETUP.fullName)
        await this.manager.fillInput(LoginPage.EMAIL_INPUT, TestDataFactory.USER_FOR_SYSTEM_SETUP.email)
        await this.manager.fillInput(LoginPage.PASSWORD_INPUT, TestDataFactory.USER_FOR_SYSTEM_SETUP.password)
        await this.manager.click(LoginPage.WIZARD_NEXT_BUTTON);

        await this.manager.fillInput(LoginPage.COMPANY_NAME_INPUT, TestDataFactory.MAIN_COMPANY_INFO.name)
        await this.manager.fillInput(LoginPage.COMPANY_ABBR_INPUT, TestDataFactory.MAIN_COMPANY_INFO.abbreviation)
        await this.manager.click(LoginPage.COMPLETE_BUTTON);

        await this.manager.locateElementByText(Navigation.HOME.visibleElement);
        return new HomePage(this.manager);
    }
}