import {BasePage} from '../../BasePage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {NewQuotationPage} from './NewQuotationPage';
import {QuotationPage} from './QuotationPage';

export class QuotationListPage extends BasePage{
    private static readonly ADD_QUOTATION_BUTTON: string = 'button[data-label="Add Quotation"]';
    private static readonly FILTER_BY_DOCUMENT_MANE_INPUT: string = 'input[data-fieldname="name"]';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewQuotationPage(): Promise<NewQuotationPage> {
        await this.pageManager.click(QuotationListPage.ADD_QUOTATION_BUTTON)
        return new NewQuotationPage(this.pageManager);
    }

    async openQuotationByDocumentName(name: string): Promise<QuotationPage> {
        await this.pageManager.fillInput(QuotationListPage.FILTER_BY_DOCUMENT_MANE_INPUT, name);
        await this.pageManager.click(`a[data-name="${name}"]`) // click on quotation from list by its document name
        return new QuotationPage(this.pageManager)
    }
}