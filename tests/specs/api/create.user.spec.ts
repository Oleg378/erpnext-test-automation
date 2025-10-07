import {apiTest} from '../../fixtures/api.test.fixture';
import {ApiClient} from '../../app/api/ApiClient';
import {ProfileRoles} from '../../tools/ProfileRoles';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';

apiTest.describe('Create new users with different roles: @sanity @api', () => {
    Object.values(ProfileRoles).forEach(role => {
        apiTest(`A new User with role ${role.role_profile_name}`, async ({ apiManager }) => {
            await ApiClient.postRetrieveAdminCookies(apiManager);
            await ApiClient.postCreateNewUser(TestDataFactory.generateUserInfo(role), apiManager);
        });
    });
})