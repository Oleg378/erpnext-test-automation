import {HomePage} from '../../app/pages/navigation/HomePage';
import {ProfileRole} from '../ProfileRoles';
import {ApiManager} from '../manager/ApiManager';
import {PageManager} from '../manager/PageManager';
import {LoginPage} from '../../app/pages/LoginPage';
import {TestDataFactory} from './TestDataFactory';
import {User} from './record-types';
import {DataUtils} from './DataUtils';

export abstract class LogInUtils {

    static async ensureUserLoggedIn(
        apiManager: ApiManager,
        pageManager: PageManager,
        role: ProfileRole,
        username?: string
    ): Promise<{homePage: HomePage, userEmail: string}> {
        const user: User = TestDataFactory.generateUserInfo(role, username);
        await new DataUtils(apiManager).ensureUserExists(user);
        const homepage: HomePage = await new LoginPage(pageManager).loginOrRestoreSession(user.email, role);

        return {homePage: homepage, userEmail: user.email};
    }
}