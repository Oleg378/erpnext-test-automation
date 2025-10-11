import {test} from '../fixtures/combined.test.fixture';
import {SalesFlow} from '../app/flows/SalesFlow';

let salesFlow: SalesFlow;
test.beforeAll(async ({apiManager}) => {
    salesFlow = await SalesFlow.create(apiManager)
});

test.describe('Sales Process: Quotation → Order → Warehouse → Shipment → Accounting @sales', () => {
    test.describe.configure({ mode: 'serial' });
    test('Create Quotation for Customer', async ({apiManager, pageManager}) => {
        await salesFlow.sales.createQuotationDraft(apiManager, pageManager);
    })
})