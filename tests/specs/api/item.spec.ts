import {apiTest} from '../../fixtures/api.test.fixture';
import {ApiClient} from '../../app/api/ApiClient';
import {Item, Supplier} from '../../tools/utils/record-types';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../../tools/utils/enums/UOMEnum';

const supplier: Supplier = {
    supplier_name: `supplier4item.spec_${TestDataFactory.generateUID()}`
}
const item: Item = TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.KG)

apiTest.beforeAll(async ({apiManager}) => {
    await ApiClient.postRetrieveAdminCookies(apiManager, false);
    await ApiClient.postCreateNewSupplier(supplier, apiManager, false);
});

apiTest.describe('Create item @item @api', () => {
    apiTest.describe.configure({ mode: 'serial' });
    apiTest('Create new Item', async ({apiManager}) => {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        await ApiClient.postCreateNewItem(item, apiManager);
    })

    apiTest('Set supplier for Item', async ({apiManager}) => {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        await ApiClient.putUpdateItemSupplier(item, supplier, apiManager)
    })
})