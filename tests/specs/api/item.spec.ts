import {apiTest} from '../../fixtures/api.test.fixture';
import {TestDataFactory} from '../../app/data/TestDataFactory';
import {ItemGroupEnum} from '../../enums/ItemGroupEnum';
import {UOMEnum} from '../../enums/UOMEnum';
import {AuthClient} from '../../app/api-clients/auth-client/AuthClient';
import {ItemClient} from '../../app/api-clients/item-client/ItemClient';
import {SupplierClient} from '../../app/api-clients/supplier-client/SupplierClient';
import {Item} from '../../app/types/item.type';
import {Supplier} from '../../app/types/supplier.type';

const supplier: Supplier = {
    supplier_name: `supplier4item.spec_${TestDataFactory.generateUID()}`
}
const item: Item = TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.KG)

apiTest.beforeAll(async ({apiManager}) => {
    await AuthClient.postRetrieveAdminCookies(apiManager, false);
    await SupplierClient.postCreateNewSupplier(supplier, apiManager, false);
});

apiTest.describe('Create item @item @api-clients', () => {
    apiTest.describe.configure({ mode: 'serial' });
    apiTest('Create new Item', async ({apiManager}) => {
        await AuthClient.postRetrieveAdminCookies(apiManager);
        await ItemClient.postCreateNewItem(item, apiManager);
    })

    apiTest('Set supplier for Item', async ({apiManager}) => {
        await AuthClient.postRetrieveAdminCookies(apiManager);
        await ItemClient.putUpdateItemSupplier(item, supplier, apiManager)
    })
})