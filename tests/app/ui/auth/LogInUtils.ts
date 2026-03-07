import {HomePage} from '../pages/navigation/HomePage';
import {ProfileRole} from '../../data/ProfileRoles';
import {ApiManager} from '../../../managers/ApiManager';
import {PageManager} from '../../../managers/PageManager';
import {LoginPage} from '../pages/LoginPage';
import {TestDataFactory} from '../../data/TestDataFactory';
import {TestDataSetup} from '../../data/TestDataSetup';
import {User} from '../../types/user.type';

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
        await TestDataSetup.ensureUserExists(apiManager, user);
        const homepage: HomePage = await new LoginPage(pageManager).loginOrRestoreSession(user.email, role);

        return {homePage: homepage, user: user};
    }
}