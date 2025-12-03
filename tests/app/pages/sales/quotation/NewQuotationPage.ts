import {QuotationPage} from './QuotationPage';
import {PageManager} from '../../../../tools/manager/PageManager';

export class NewQuotationPage extends QuotationPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<QuotationPage> {
        await this.save();
        return new QuotationPage(this.pageManager);
    }
}