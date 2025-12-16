import {PageManager} from '../../tools/manager/PageManager';
import {HomePage} from './navigation/HomePage';
import {SessionContextStorage} from '../../tools/SessionContext';
import {Navigation} from '../components/Navigation';
import {ProfileRole} from '../../tools/ProfileRoles';
import {BasePage} from './BasePage';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';

export class LoginPage extends BasePage{
    private static readonly LOGIN_EMAIL_INPUT: string = 'input#login_email';
    private static readonly LOGIN_PASSWORD_INPUT: string = 'input#login_password';
    private static readonly LOGIN_BUTTON: string = 'button.btn-login';
    private static readonly WIZARD_NEXT_BUTTON: string = 'button.next-btn';
    private static readonly FULL_NAME_INPUT: string = 'input[data-fieldname="full_name"]';
    private static readonly EMAIL_INPUT: string = 'input[data-fieldname="email"]';
    private static readonly PASSWORD_INPUT: string = 'input[data-fieldname="password"]';
    private static readonly COMPANY_NAME_INPUT: string = 'input[data-fieldname="company_name"]';
    private static readonly COMPANY_ABBR_INPUT: string = 'input[data-fieldname="company_abbr"]';
    private static readonly COMPLETE_BUTTON: string = 'button.complete-btn'

    constructor(page: PageManager) {
        super(page);
    }

    async loginOrRestoreSession(username: string, role: ProfileRole): Promise<HomePage> {
        if (SessionContextStorage.hasUserSession(username)) {
            this.sessionContext = await this.restoreSessionByEmail(username);
            await this.pageManager.locateElementByText(Navigation.HOME.visibleText)
        } else {
            await this.pageManager.fillInput(
                LoginPage.LOGIN_EMAIL_INPUT,
                username,
                `fill log in email "${username}"`
            );
            await this.pageManager.fillInput(
                LoginPage.LOGIN_PASSWORD_INPUT,
                role.new_password,
                `fill in password "${role.new_password}"`
            );

            await this.pageManager.click(
                LoginPage.LOGIN_BUTTON,
                'Click on "login" button'
            );
            await this.pageManager.locateElementByText(Navigation.HOME.visibleText)
            this.sessionContext = await this.pageManager.generateSessionContext(role);
            SessionContextStorage.putUserSession(username, this.sessionContext)
        }
        return new HomePage(this.pageManager);
    }

    async fillSetUpWizard(): Promise<HomePage> {
        await this.pageManager.fillInput(
            LoginPage.LOGIN_EMAIL_INPUT,
            TestDataFactory.SUPER_ADMIN_CREDENTIALS.email,
            'fill log in email "Administrator"'
        );
        await this.pageManager.fillInput(
            LoginPage.LOGIN_PASSWORD_INPUT,
            TestDataFactory.SUPER_ADMIN_CREDENTIALS.password,
            'fill in password "admin"'
        );
        await this.pageManager.click(
            LoginPage.LOGIN_BUTTON,
            'Click on "login" button'
        );

        await this.pageManager.click(LoginPage.WIZARD_NEXT_BUTTON);

        await this.pageManager.fillInput(LoginPage.FULL_NAME_INPUT, TestDataFactory.USER_FOR_SYSTEM_SETUP.fullName)
        await this.pageManager.fillInput(LoginPage.EMAIL_INPUT, TestDataFactory.USER_FOR_SYSTEM_SETUP.email)
        await this.pageManager.fillInput(LoginPage.PASSWORD_INPUT, TestDataFactory.USER_FOR_SYSTEM_SETUP.password)
        await this.pageManager.click(LoginPage.WIZARD_NEXT_BUTTON);

        await this.pageManager.fillInput(LoginPage.COMPANY_NAME_INPUT, TestDataFactory.MAIN_COMPANY_INFO.name)
        await this.pageManager.fillInput(LoginPage.COMPANY_ABBR_INPUT, TestDataFactory.MAIN_COMPANY_INFO.abbreviation)
        await this.pageManager.click(LoginPage.COMPLETE_BUTTON);

        await this.pageManager.locateElementByText(Navigation.HOME.visibleText)
        return new HomePage(this.pageManager);
    }
}