import {apiTest} from '../../fixtures/api.test.fixture';
import {ProfileRoles} from '../../app/data/ProfileRoles';
import {TestDataFactory} from '../../app/data/TestDataFactory';
import {AuthClient} from '../../app/api-clients/auth-client/AuthClient';
import {UserClient} from '../../app/api-clients/user-client/UserClient';

apiTest.describe('Create new users with different roles: @sanity @api-clients', () => {
    Object.values(ProfileRoles).forEach(role => {
        apiTest(`A new User with role ${role.role_profile_name}`, async ({ apiManager }) => {
            await AuthClient.postRetrieveAdminCookies(apiManager);
            await UserClient.postCreateNewUser(TestDataFactory.generateUserInfo(role), apiManager);
        });
    });
})