import {PageManager} from '../../../../tools/manager/PageManager';
import {SalesInvoicePage} from './SalesInvoicePage';

export class NewSalesInvoicePage extends SalesInvoicePage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    override async saveDocument(): Promise<SalesInvoicePage> {
        await this.save();
        return new SalesInvoicePage(this.pageManager);
    }
}