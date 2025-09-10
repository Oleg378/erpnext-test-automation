import {apiTest} from '../fixtures/api.test.fixture';
import {ApiUtils} from '../app/api/ApiUtils';
import {ProfileRoles} from '../tools/ProfileRoles';

apiTest.describe('Create new user', () => {
    apiTest('Create a new User with role Accounts', async ({apiManager}) => {
        await ApiUtils.postCreateNewUser(apiManager, ProfileRoles.Accounts)
    })
})