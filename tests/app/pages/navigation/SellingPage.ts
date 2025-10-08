import {AbstractNavigationPage} from './AbstractNavigationPage';
import {PageManager} from '../../../tools/manager/PageManager';
import {QuotationListPage} from '../sales/QuotationListPage';

export class SellingPage extends AbstractNavigationPage {
    private static readonly QUOTATION_BUTTON: string = 'a[title="Quotation"]';
    constructor(manager: PageManager) {
        super(manager);
    }

    async openQuotationListPage(): Promise<QuotationListPage> {
        await this.pageManager.click(SellingPage.QUOTATION_BUTTON);
        return new QuotationListPage(this.pageManager);
    }
}