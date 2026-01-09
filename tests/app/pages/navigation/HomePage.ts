import {AbstractNavigationPage} from './AbstractNavigationPage';
import {PageManager} from '../../../tools/manager/PageManager';
import {SalesInvoiceListPage} from '../domains/sales/sales-invoice/SalesInvoiceListPage';

export class HomePage extends AbstractNavigationPage {
    private static readonly SALES_INVOICE_BUTTON: string = 'text="Sales Invoice"';

    constructor(manager: PageManager) {
        super(manager);
    }

    async openSalesInvoiceListPage(): Promise<SalesInvoiceListPage> {
        await this.pageManager.click(
            HomePage.SALES_INVOICE_BUTTON,
            'Open Sales Invoices list'
        );
        return new SalesInvoiceListPage(this.pageManager);
    }
}