import {test} from '../fixtures/combined.test.fixture';
import {SalesFlowInitializer, SalesFlowConfig} from '../app/flows/sales/SalesFlowInitializer';
import {Customer, Item, Supplier} from '../tools/utils/record-types';
import {TestDataFactory} from '../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../tools/utils/enums/UOMEnum';


const ITEMS: Map<Item, number> = new Map<Item, number>([
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'CASE_ROUTING'), 1],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'SECURITY'), 2],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'COMPANIES'), 3],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS,  UOMEnum.UNIT, 'MESSAGES_FOR_PROPOSAL'), 5],
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

test.describe(
    'Sales Process: Quotation → Order → Warehouse → Shipment → Accounting @sales',
    () => {
    test.describe.configure({ mode: 'serial' });
    test('Quotation -> Sales Order -> Sales Invoice', async ({apiManager, pageManager}) => {
        await SalesFlowInitializer
            .creteFlowWithQuotation(apiManager, pageManager, FLOW_CONFIG)
            .submitQuotation(apiManager, pageManager)
            .createAndSubmitSalesOrder(apiManager, pageManager)
            .createMaterialRequest(apiManager, pageManager)
            .createPurchaseOrder(apiManager, pageManager)
            .createPurchaseReceipt(apiManager, pageManager)
            .createDeliveryNote(apiManager, pageManager)
            .createSalesInvoice(apiManager, pageManager)
            .createPaymentEntry(apiManager, pageManager)
            .executeAll();
    })
})