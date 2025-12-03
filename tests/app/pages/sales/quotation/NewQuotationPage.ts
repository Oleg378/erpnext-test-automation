import {QuotationPage} from './QuotationPage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../../tools/utils/enums/DocStatesEnum';

export class NewQuotationPage extends QuotationPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<QuotationPage> {
        await this.save();
        return new QuotationPage(this.pageManager);
    }
}