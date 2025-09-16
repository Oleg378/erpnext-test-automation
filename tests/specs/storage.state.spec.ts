import {test} from '../fixtures/combined.test.fixture';
import {ApiClient} from '../app/api/ApiClient';
import {ProfileRole, ProfileRoles} from '../tools/ProfileRoles';
import {SessionContextStorage} from '../tools/SessionContext';
import {LoginPage} from '../app/pages/LoginPage';
import {HomePage} from '../app/pages/navigation/HomePage';
import {Navigation} from '../app/components/Navigation';

let username: string
let profileRole: ProfileRole

test.beforeAll(async ({apiManager}) => {
    profileRole = ProfileRoles.Accounts
    await ApiClient.postRetrieveAdminCookies(apiManager);
    username = await ApiClient.postCreateNewUser(apiManager, profileRole, false);
});

test.describe('RESTORE SESSION DEMO: @sessions', () => {
    test.describe.configure({ mode: 'serial' });
    test('Log in as User and store sessionContext', async ({pageManager}) => {
        if (!SessionContextStorage.hasUserSession(username)) {
            let homePage: HomePage = await new LoginPage(pageManager)
                .login(username, profileRole.new_password);
            await homePage.navigateTo(Navigation.ACCOUNTING);
            const sessionContext = await pageManager.getSessionContext(profileRole);
            SessionContextStorage.putUserSession(username, sessionContext);
        }
    });

    test('Log in as User or Use storageState', async ({pageManager}) => {
        if (!SessionContextStorage.hasUserSession(username)) {
            await new LoginPage(pageManager)
                .login(username, profileRole.new_password);
        }
        else {
            const sessionContext = SessionContextStorage.getUserSession(username);
            await pageManager.restoreBrowserContext(sessionContext);
        }
        let homePage: HomePage = new HomePage(pageManager);
        await homePage.navigateTo(Navigation.ACCOUNTING);
    });
});