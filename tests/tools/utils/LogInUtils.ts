import {HomePage} from '../../app/pages/navigation/HomePage';
import {ProfileRole} from '../ProfileRoles';
import {ApiManager} from '../manager/ApiManager';
import {PageManager} from '../manager/PageManager';
import {LoginPage} from '../../app/pages/LoginPage';
import {TestDataFactory} from './TestDataFactory';
import {User} from './record-types';
import {DataUtils} from './DataUtils';

export interface LoggedInUser {
    homePage:  HomePage;
    user: User
}

export abstract class LogInUtils {

    static async ensureUserLoggedIn(
        apiManager: ApiManager,
        pageManager: PageManager,
        role: ProfileRole,
        username?: string
    ): Promise<LoggedInUser> {
        const user: User = TestDataFactory.generateUserInfo(role, username);
        await DataUtils.ensureUserExists(apiManager, user);
        const homepage: HomePage = await new LoginPage(pageManager).loginOrRestoreSession(user.email, role);

        return {homePage: homepage, user: user};
    }
}