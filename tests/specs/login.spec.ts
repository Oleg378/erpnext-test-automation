import {Navigation} from '../app/components/Navigation';
import {LoginPage} from '../app/pages/LoginPage';
import {HomePage} from '../app/pages/navigation/HomePage';
import {PayablesPage} from '../app/pages/navigation/PayablesPage';
import {test} from '../fixtures/combined.test.fixture';

test.beforeAll(async ({apiManager}) => {
    const testGet = await apiManager.get('/', 'sanity check', false);
    await apiManager.expectResponseToBeOk(testGet);
})

test.describe('API + UI DEMO: @sanity', () => {
    test('API DEMO: Get a Customer list @api', async ({apiManager}) => {
        let data = {
            'usr': 'Administrator',
            'pwd': 'admin'
        }
        await apiManager.post('/api/method/login', data);
        const testGet = await apiManager.get('/api/resource/Customer');
        await apiManager.expectResponseToBeOk(testGet);
    })

    test('IU DEMO: Login as admin', async ({ pageManager }) => {
        const homePage: HomePage = await new LoginPage(pageManager).loginAsAdmin();
        const payablesPage: PayablesPage = await homePage.navigateTo(Navigation.ACCOUNTING);
        await payablesPage.navigateTo(Navigation.STOCK);
    });
})