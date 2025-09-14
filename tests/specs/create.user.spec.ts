import {apiTest} from '../fixtures/api.test.fixture';
import {ApiClient} from '../app/api/ApiClient';
import {ProfileRoles} from '../tools/ProfileRoles';

apiTest.describe('Create new users with different roles: @sanity @api', () => {
    Object.values(ProfileRoles).forEach(role => {
        apiTest(`A new User with role ${role.role_profile_name}`, async ({ apiManager }) => {
            await ApiClient.postRetrieveAdminCookies(apiManager);
            const username: string = await ApiClient.postCreateNewUser(apiManager, role);
            await apiManager.attachDataToReport(`New user with profileRole ${role.role_profile_name} has been created!`, username);
        });
    });
})