import {test} from "../fixtures/manager.fixture";
import {Navigation} from "../app/components/Navigation";

import {LoginPage} from "../app/pages/LoginPage";
import {HomePage} from "../app/pages/navigation/HomePage";
import {PayablesPage} from "../app/pages/navigation/PayablesPage";

    // first log in
    // input[data-fieldname="language"] English
    // button.next-btn
    // input[data-fieldname="full_name"] boba dodod
    // input[data-fieldname="email"] sdfsd@tes.com
    // input[data-fieldname="password"] asdsafds123!


test('DEMO: Login as admin', async ({ manager }) => {
    let homePage: HomePage = await new LoginPage(manager).loginAsAdmin();
    let payablesPage: PayablesPage = await homePage.navigateTo(Navigation.ACCOUNTING);
    await payablesPage.navigateTo(Navigation.STOCK);
});