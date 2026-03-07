import {test} from '../fixtures/combined.test.fixture';
import {LoginPage} from '../app/ui/pages/LoginPage';
import {AuthClient} from '../app/api-clients/auth-client/AuthClient';
import {CompanyClient} from '../app/api-clients/company-client/CompanyClient';

test.describe('Ensure the set up process is completed and make it done if needed @setup', async () => {
    test('Check company presence and run set up if there is no company', async ({ apiManager, pageManager }) => {
        await AuthClient.postRetrieveAdminCookies(apiManager);
        const companies: string[] = await CompanyClient.getListOfCompanies(apiManager);
        if (companies.length < 1) {
            await new LoginPage(pageManager).fillSetUpWizard();
        }
    })
})

