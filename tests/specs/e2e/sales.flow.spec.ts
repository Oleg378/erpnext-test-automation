import {test} from '../../fixtures/combined.test.fixture';
import {SalesFlowInitializer, SalesFlowConfig} from '../../app/flows/sales/SalesFlowInitializer';
import {Customer, Item, QuotationResponse, SalesOrderResponse, Supplier} from '../../tools/utils/record-types';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../../tools/utils/enums/UOMEnum';
import {DeliveryAction} from '../../app/flows/sales/DeliveryAction';
import {expect} from '@playwright/test';
import {Step} from '../../decorators/step.decorator';
import {ApiManager} from '../../tools/manager/ApiManager';
import {ApiClient} from '../../app/api/ApiClient';
import {ProcurementAction} from '../../app/flows/sales/ProcurementAction';


const ITEMS: Map<Item, number> = new Map<Item, number>([
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'THE_RING'), 1],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'AXE'), 2],
    [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'ARROW'), 3],
]);
const SUPPLIER: Supplier = {
    supplier_name: 'SCIENCE&FICTION'
};
const CUSTOMER: Customer = {
    customer_name: 'Reader',
    customer_type: 'Company'
};
const FLOW_CONFIG: SalesFlowConfig = {
    items: ITEMS,
    supplier: SUPPLIER,
    customer: CUSTOMER
}
let flow: ProcurementAction | DeliveryAction;

class SalesFlowAssertions {
    @Step('Assert Quotation status')
    static async assertQuotationStatus(quotationName: string, apiManager: ApiManager): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        const parsedResponse: QuotationResponse = await ApiClient.getQuotation(quotationName, apiManager);
        const quotationStatus = parsedResponse.data.status
        expect(quotationStatus, 'Quotation status should be "Ordered"').toBe('Ordered');
    }

    @Step('Assert Sales Order status, delivery_status and billing_status')
    static async assertSalesOrderStatus(
        salesOrderName: string,
        expected: {status: string, delivery_status: string, billing_status: string},
        apiManager: ApiManager
    ): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        const parsedResponse: SalesOrderResponse = await ApiClient.getSalesOrder(salesOrderName, apiManager);
        expect(parsedResponse.data.status, `Sales Order status should be "${expected.status}"`)
            .toBe(expected.status);
        expect(parsedResponse.data.delivery_status, `Sales Order delivery_status should be "${expected.delivery_status}"`)
            .toBe(expected.delivery_status);
        expect(parsedResponse.data.billing_status, `Sales Order billing_status should be "${expected.billing_status}"`)
            .toBe(expected.billing_status);
    }
}

test.describe(
    'Sales Process: Quotation → Sales Order → Procurement → Shipment → Accounting @sales',
    () => {
        test.describe.configure({mode: 'serial'});
        test('Quotation → Sales Order',
            async ({apiManager, pageManager}) => {
                flow = await SalesFlowInitializer
                    .createFlowWithQuotation(apiManager, pageManager, FLOW_CONFIG)
                    .submitQuotation()
                    .createAndSubmitSalesOrder()
                    .executeAll();

                const context = flow.getContext()
                if (!context.quotation) {
                    throw new Error('Quotation is Undefined')
                }
                await SalesFlowAssertions.assertQuotationStatus(context.quotation.name, apiManager)
            })

        test('Procurement',
            async ({apiManager, pageManager}) => {
                const procurementFlow = flow as ProcurementAction;
                flow = await procurementFlow
                    .setManager(apiManager, pageManager)
                    .createAndSubmitMaterialRequest()
                    .createAndSubmitPurchaseOrder()
                    .createAndSubmitPurchaseReceipt()
                    .executeAll();
                const context = flow.getContext()
                if (!context.salesOrder) {
                    throw new Error('Sales Order is Undefined')
                }
                await SalesFlowAssertions.assertSalesOrderStatus(
                    context.salesOrder.name,
                    {
                        status: 'To Deliver and Bill',
                        delivery_status: 'Not Delivered',
                        billing_status: 'Not Billed'
                    },
                    apiManager
                );
            })

        test('Delivery Note → Sales Invoice → Payment Entry',
            async ({apiManager, pageManager}) => {
                const deliveryFlow = flow as DeliveryAction;
                await deliveryFlow
                    .setManager(apiManager, pageManager)
                    .createAndSubmitDeliveryNote()
                    .createAndSubmitSalesInvoice()
                    .createAndSubmitPaymentEntry()
                    .executeAll();
                const context = flow.getContext()
                if (!context.salesOrder) {
                    throw new Error('Sales Order is Undefined')
                }
                await SalesFlowAssertions.assertSalesOrderStatus(
                    context.salesOrder.name,
                    {
                        status: 'Completed',
                        delivery_status: 'Fully Delivered',
                        billing_status: 'Fully Billed'
                    },
                    apiManager
                );
            })
    })