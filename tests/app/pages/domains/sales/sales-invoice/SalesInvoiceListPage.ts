import {PageManager} from '../../../../../tools/manager/PageManager';
import {NewSalesInvoicePage} from './NewSalesInvoicePage';
import {Step} from '../../../../../decorators/step.decorator';
import {SalesInvoicePage} from './SalesInvoicePage';
import {AbstractListOfDocumentsPage} from '../../../AbstractListOfDocumentsPage';

export class SalesInvoiceListPage extends AbstractListOfDocumentsPage {
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

    @Step('Open existing Quotation by Document Name:')
    async openSalesInvoiceByDocumentName(name: string): Promise<SalesInvoicePage> {
        await this.openDocumentByName(name);
        return new SalesInvoicePage(this.pageManager)
    }
}