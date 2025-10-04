import {HomePage} from '../app/pages/navigation/HomePage';
import {ProfileRole} from './ProfileRoles';
import {ApiManager} from './manager/ApiManager';
import {PageManager} from './manager/PageManager';
import {ApiClient} from '../app/api/ApiClient';
import {LoginPage} from '../app/pages/LoginPage';
import {TestDataFactory} from './TestDataFactory';
import {User} from './record-types';

export abstract class LogInUtils {

    static async ensureUserLoggedIn(
        apiManager: ApiManager,
        pageManager: PageManager,
        role: ProfileRole,
        username?: string
    ): Promise<{homepage: HomePage, userEmail: string}> {
        const user: User = TestDataFactory.generateUserInfo(role, username);
        await ApiClient.postRetrieveAdminCookies(apiManager);
        const registeredUsers: string[] = await ApiClient.getListOfUsers(apiManager);
        if(!registeredUsers.includes(user.email)) {
            await ApiClient.postCreateNewUser(user, apiManager);
        }
        const homepage: HomePage = await new LoginPage(pageManager).loginOrRestoreSession(user.email, role);

        return {homepage: homepage, userEmail: user.email};
    }
}