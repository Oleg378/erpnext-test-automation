import {BasePage} from '../BasePage';
import {PageManager} from '../../../tools/manager/PageManager';
import {NewQuotationPage} from './quotation/NewQuotationPage';

export class QuotationListPage extends BasePage{
    private static readonly ADD_QUOTATION_BUTTON: string = 'button[data-label="Add Quotation"]';
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewQuotationPage(): Promise<NewQuotationPage> {
        await this.pageManager.click(QuotationListPage.ADD_QUOTATION_BUTTON)
        return new NewQuotationPage(this.pageManager);
    }
}