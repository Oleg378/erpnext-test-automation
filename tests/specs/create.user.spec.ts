import {apiTest} from '../fixtures/api.test.fixture';
import {ApiClient} from '../app/api/ApiClient';
import {ProfileRole, ProfileRoles} from '../tools/ProfileRoles';

apiTest.describe('Create new user', () => {
    apiTest('Create a new User with role Accounts', async ({apiManager}) => {
        const profileRole: ProfileRole = ProfileRoles.Accounts;
        await ApiClient.postRetrieveAdminCookies(apiManager);
        const responseData = await ApiClient.postCreateNewUser(apiManager, profileRole);
        await apiManager.attachDataToReport(`New user with profileRole ${profileRole.role_profile_name} has been created!`, responseData);
    })
})