import {test} from '../fixtures/combined.test.fixture';
import {SalesFlow, SalesFlowConfig} from '../app/flows/SalesFlow';
import {Customer, Item, Supplier} from '../tools/utils/record-types';
import {TestDataFactory} from '../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../tools/utils/enums/UOMEnum';


const ITEMS: Map<Item, number> = new Map<Item, number>([
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'CASE_ROUTING'), 1],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'SECURITY'), 1],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'COMPANIES'), 8]
]);
const SUPPLIER: Supplier = {
    supplier_name: 'OLEKSI&MAKS'
};
const CUSTOMER: Customer = {
    customer_name: 'Alina',
    customer_type: 'Company'
};
const FLOW_CONFIG: SalesFlowConfig = {
    items: ITEMS,
    supplier: SUPPLIER,
    customer: CUSTOMER
}

let salesFlow: SalesFlow;
test.beforeAll(async ({apiManager}) => {
    salesFlow = await SalesFlow.create(apiManager, FLOW_CONFIG)
});

test.describe('Sales Process: Quotation → Order → Warehouse → Shipment → Accounting @sales', () => {
    test.describe.configure({ mode: 'serial' });
    test('Create Quotation for Customer (Draft)', async ({apiManager, pageManager}) => {
        await salesFlow.sales.createQuotationDraft(apiManager, pageManager);
    })
    test('Submit Quotation', async ({apiManager, pageManager}) => {
        await salesFlow.sales.submitQuotation(apiManager, pageManager);
    })
    test('Create Sales Order (Draft)', async ({apiManager, pageManager}) => {
        await salesFlow.sales.createOrderDraft(apiManager, pageManager);
    })
})