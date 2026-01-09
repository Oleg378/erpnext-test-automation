import {test} from '../fixtures/combined.test.fixture';
import {SalesFlowInitializer, SalesFlowConfig} from '../app/flows/sales/SalesFlowInitializer';
import {Customer, Item, Supplier} from '../tools/utils/record-types';
import {TestDataFactory} from '../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../tools/utils/enums/UOMEnum';
import {DeliveryAction} from '../app/flows/sales/DeliveryAction';


const ITEMS: Map<Item, number> = new Map<Item, number>([
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'CASE_ROUTING'), 1],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'SECURITY'), 2],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'COMPANIES'), 3],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'MESSAGES_FOR_PROPOSAL'), 5],
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
let flow: DeliveryAction;

test.describe(
    'Sales Process: Quotation → Sales Order → Procurement → Shipment → Accounting @sales',
    () => {
        test.describe.configure({mode: 'serial'});
        test('Quotation → Sales Order → Sales Invoice → Procurement',
            async ({apiManager, pageManager}) => {
                flow = await SalesFlowInitializer
                    .creteFlowWithQuotation(apiManager, pageManager, FLOW_CONFIG)
                    .submitQuotation()
                    .createAndSubmitSalesOrder()
                    .createAndSubmitMaterialRequest()
                    .createAndSubmitPurchaseOrder()
                    .createAndSubmitPurchaseReceipt()
                    .executeAll();
                // some cheks
                await flow
                    .createAndSubmitDeliveryNote()
                    .createAndSubmitSalesInvoice()
                    .createAndSubmitPaymentEntry()
                    .executeAll();
                // some cheks
            })
    })