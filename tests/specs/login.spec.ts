import {Navigation} from '../app/components/Navigation';
import {LoginPage} from '../app/pages/LoginPage';
import {HomePage} from '../app/pages/navigation/HomePage';
import {PayablesPage} from '../app/pages/navigation/PayablesPage';
import {test} from '../fixtures/combined.test.fixture';

test.beforeAll(async ({apiManager}) => {
    let testGet = await apiManager.get('/');
    await apiManager.expectResponseToBeOk(testGet);
})

test.describe('API + UI DEMO:', () => {
    test('API DEMO: ping base url', async ({apiManager}) => {
        let data = {
            'usr': 'Administrator',
            'pwd': 'admin'
        }
        await apiManager.post('/api/method/login', data);
        let testGet = await apiManager.get('/api/resource/Customer');
        await apiManager.expectResponseToBeOk(testGet);
    })

    test('IU DEMO: Login as admin', async ({ pageManager }) => {
        let homePage: HomePage = await new LoginPage(pageManager).loginAsAdmin();
        let payablesPage: PayablesPage = await homePage.navigateTo(Navigation.ACCOUNTING);
        await payablesPage.navigateTo(Navigation.STOCK);
    });
})