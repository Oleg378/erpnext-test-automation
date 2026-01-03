import {BasePage} from '../../BasePage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {NewSalesInvoicePage} from './NewSalesInvoicePage';

export class SalesInvoiceListPage extends BasePage {
    private static readonly ADD_SALES_INVOICE_BUTTON: string = 'button[data-label="Add Sales Invoice"]';
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewSalesInvoicePage(): Promise<NewSalesInvoicePage> {
        await this.pageManager.click(
            SalesInvoiceListPage.ADD_SALES_INVOICE_BUTTON,
            'Click on "Add Sales Invoice" button'
        );
        return new NewSalesInvoicePage(this.pageManager);
    }
}