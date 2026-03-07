import {test} from '../fixtures/combined.test.fixture';
import {ProfileRole, ProfileRoles} from '../app/data/ProfileRoles';
import {LogInUtils} from '../app/ui/auth/LogInUtils';

const profileRole: ProfileRole = ProfileRoles.Accounts

test.describe('RESTORE SESSION DEMO: @sessions', () => {
    test.describe.configure({ mode: 'serial' });
    test('Log in as new random User via LogInUtils', async ({pageManager, apiManager}) => {
        await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            profileRole)
        await pageManager.closePage();
    });

    test('Log in as ABOBA_BOBA and store sessionContext', async ({pageManager, apiManager}) => {
        await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            profileRole,
            'ABOBA_BOBA')
        await pageManager.closePage();
    });

    test('Log in as ABOBA_BOBA via LogInUtils & storageState', async ({pageManager, apiManager}) => {
        await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            profileRole,
            'ABOBA_BOBA')
        await pageManager.closePage();
    });
});