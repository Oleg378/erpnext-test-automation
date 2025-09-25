import {HomePage} from '../app/pages/navigation/HomePage';
import {ProfileRole} from './ProfileRoles';
import {ApiManager} from './manager/ApiManager';
import {PageManager} from './manager/PageManager';
import {ApiClient} from '../app/api/ApiClient';
import {LoginPage} from '../app/pages/LoginPage';

export class LogInUtils {
    private constructor() {
        throw  new Error('LogInUtils instances are not allowed!');
    }

    static async ensureUserLoggedIn(
        apiManager: ApiManager,
        pageManager: PageManager,
        role: ProfileRole,
        username?: string
    ): Promise<{homepage: HomePage, userEmail: string}> {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        const userEmail = await ApiClient.postCreateNewUser(apiManager, role, true, username);
        const homepage: HomePage = await new LoginPage(pageManager).loginOrRestoreSession(userEmail, role);

        return {homepage: homepage, userEmail: userEmail};
    }
}