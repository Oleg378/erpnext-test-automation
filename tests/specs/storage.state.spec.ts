import {test} from '../fixtures/combined.test.fixture';
import {ProfileRole, ProfileRoles} from '../tools/ProfileRoles';
import {LogInUtils} from '../tools/utils/LogInUtils';

const profileRole: ProfileRole = ProfileRoles.Accounts

test.describe('RESTORE SESSION DEMO: @sessions', () => {
    test.describe.configure({ mode: 'serial' });
    test('Log in as new random User via LogInUtils', async ({pageManager, apiManager}) => {
        await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            profileRole)
    });

    test('Log in as ABOBA_BOBA and store sessionContext', async ({pageManager, apiManager}) => {
        await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            profileRole,
            'ABOBA_BOBA')
    });

    test('Log in as ABOBA_BOBA via LogInUtils & storageState', async ({pageManager, apiManager}) => {
        await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            profileRole,
            'ABOBA_BOBA')
    });
});