import {ApiClient} from '../app/api/ApiClient';
import {test} from '../fixtures/combined.test.fixture';
import {LoginPage} from '../app/pages/LoginPage';

test.describe('Ensure the set up process is completed and make it done if needed @setup', async () => {
    test('Check company presence and run set up if there is no company', async ({ apiManager, pageManager }) => {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        const companies: string[] = await ApiClient.getListOfCompanies(apiManager);
        if (companies.length < 1) {
            await new LoginPage(pageManager).fillSetUpWizard();
        }
    })
})

